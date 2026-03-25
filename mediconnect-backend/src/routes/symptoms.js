const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Rule-based fallback when Gemini API is unavailable
function fallbackDiagnosis(text, doctors) {
  const lower = text.toLowerCase();

  const rules = [
    { keywords: ['eye', 'red eye', 'itchy eye', 'blurry', 'vision'], diagnosis: 'Possible Conjunctivitis or Eye Strain', specialty: 'Ophthalmologist' },
    { keywords: ['headache', 'migraine', 'head pain', 'head ache'], diagnosis: 'Possible Tension Headache or Migraine', specialty: 'Neurologist' },
    { keywords: ['fever', 'high temperature', 'chills', 'sweating'], diagnosis: 'Possible Viral or Bacterial Infection', specialty: 'General Practitioner' },
    { keywords: ['cough', 'cold', 'runny nose', 'sneezing', 'sore throat'], diagnosis: 'Possible Upper Respiratory Tract Infection', specialty: 'General Practitioner' },
    { keywords: ['chest pain', 'chest tightness', 'heart', 'palpitation'], diagnosis: 'Possible Cardiac or Pulmonary Issue — Seek Immediate Care', specialty: 'Cardiologist' },
    { keywords: ['stomach', 'belly', 'abdominal', 'nausea', 'vomit'], diagnosis: 'Possible Gastro-intestinal Issue', specialty: 'Gastroenterologist' },
    { keywords: ['rash', 'skin', 'itch', 'hives', 'acne'], diagnosis: 'Possible Dermatological Condition', specialty: 'Dermatologist' },
    { keywords: ['back pain', 'spine', 'waist pain', 'neck pain'], diagnosis: 'Possible Musculoskeletal Issue', specialty: 'Orthopaedic Surgeon' },
    { keywords: ['period', 'menstrual', 'cramps', 'pregnancy', 'vaginal'], diagnosis: 'Possible Gynaecological Issue', specialty: 'Gynaecologist' },
    { keywords: ['child', 'baby', 'infant', 'toddler', 'kid'], diagnosis: 'Consult a Paediatrician for Children\'s Health', specialty: 'Paediatrician' },
  ];

  let diagnosis = 'Possible General Illness — Please consult a doctor';
  let specialty = 'General Practitioner';

  for (const rule of rules) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      diagnosis = rule.diagnosis;
      specialty = rule.specialty;
      break;
    }
  }

  // Find best matching doctor by specialty
  const matchedDoctor = doctors.find(d => d.doctorProfile?.specialty === specialty)
    || doctors.find(d => d.doctorProfile?.specialty === 'General Practitioner')
    || doctors[0];

  return {
    diagnosis,
    doctor: matchedDoctor ? {
      id: matchedDoctor.id,
      name: matchedDoctor.name,
      specialty: matchedDoctor.doctorProfile?.specialty || specialty
    } : null
  };
}

router.post('/analyze', authMiddleware(['PATIENT']), async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Symptoms text required' });

    // Identify doctors on platform for intelligent suggestion
    const doctors = await prisma.user.findMany({
      where: { role: 'DOCTOR' },
      select: { id: true, name: true, doctorProfile: { select: { specialty: true } } }
    });

    const filteredDoctors = doctors.filter(d => d.doctorProfile);

    if (filteredDoctors.length === 0) {
      return res.json({
        diagnosis: 'Unable to suggest a doctor as no doctors are registered yet.',
        doctor: null
      });
    }

    const docListText = filteredDoctors.map(d => `${d.name} (${d.doctorProfile.specialty}, ID: ${d.id})`).join(', ');

    // Try Gemini AI first
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `
          You are an AI diagnostic assistant for MediConnect. 
          A patient reported these symptoms: "${text}".
          
          Respond ONLY in raw JSON with NO markdown, NO extra explanation. Format exactly:
          {"diagnosis":"Short possible diagnosis","specialty":"Suggested doctor specialty","doctorName":"Name of best matching doctor from: ${docListText}","doctorId":"ID of that doctor"}
          
          Pick the closest matching doctor from the list. If none matches, use the General Practitioner.
        `;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        let output = result.response.text().trim();
        
        console.log('Gemini raw output:', output);
        
        // Strip markdown code fences
        output = output.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Extract JSON from response if it has extra text around it
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (jsonMatch) output = jsonMatch[0];

        const aiResult = JSON.parse(output);

        // Persist the log
        await prisma.symptomLog.create({
          data: {
            userId: req.user.id,
            symptoms: text,
            aiDiagnosis: aiResult.diagnosis,
            suggestedSpecialty: aiResult.specialty
          }
        }).catch(e => console.error('Log save failed (non-fatal):', e.message));

        return res.json({
          diagnosis: aiResult.diagnosis,
          doctor: aiResult.doctorId ? {
            id: aiResult.doctorId,
            name: aiResult.doctorName,
            specialty: aiResult.specialty
          } : null,
          source: 'ai'
        });
      } catch (geminiError) {
        console.warn('Gemini API unavailable, using fallback:', geminiError.message);
        // Fall through to rule-based fallback
      }
    }

    // Rule-based fallback
    const fallback = fallbackDiagnosis(text, filteredDoctors);

    // Persist the log for fallback too
    await prisma.symptomLog.create({
      data: {
        userId: req.user.id,
        symptoms: text,
        aiDiagnosis: fallback.diagnosis,
        suggestedSpecialty: fallback.doctor?.specialty || 'General Practitioner'
      }
    }).catch(e => console.error('Log save failed (non-fatal):', e.message));

    return res.json({ ...fallback, source: 'fallback' });

  } catch (error) {
    console.error('Symptoms route error:', error?.message || error);
    res.status(500).json({ error: 'Analysis failed: ' + (error?.message || 'Unknown error') });
  }
});

module.exports = router;
