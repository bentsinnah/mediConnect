const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get patient health dashboard data
router.get('/', authMiddleware(['PATIENT']), async (req, res) => {
  try {
    const metrics = await prisma.healthMetric.findMany({
      where: { userId: req.user.id },
      orderBy: { recordedAt: 'asc' }
    });

    // Formatting for Recharts
    const dashboard = {
      temperature: { unit: "°C", data: [] },
      bloodPressure: { unit: "mmHg", data: [] },
      weight: { unit: "kg", data: [] },
      water: { current: 0, goal: 8, unit: "glasses" },
      sleep: { last: 0, unit: "hrs", options: [5, 6, 7, 8], selected: 7 }
    };

    metrics.forEach(m => {
      const dayName = new Date(m.recordedAt).toLocaleString('en-us', {  weekday: 'short' });
      if (m.type === 'TEMPERATURE') dashboard.temperature.data.push({ day: dayName, value: m.value });
      if (m.type === 'WEIGHT') dashboard.weight.data.push({ day: dayName, value: m.value });
      if (m.type === 'WATER') dashboard.water.current += m.value;
      if (m.type === 'SLEEP') dashboard.sleep.last = m.value;
    });

    // Grouping BP systolic/diastolic by day is a bit more complex, simplified for demo:
    const bpGroups = {};
    metrics.filter(m => m.type.startsWith('BP_')).forEach(m => {
      const dayName = new Date(m.recordedAt).toLocaleString('en-us', {  weekday: 'short' });
      if (!bpGroups[dayName]) bpGroups[dayName] = {};
      if (m.type === 'BP_SYSTOLIC') bpGroups[dayName].systolic = m.value;
      if (m.type === 'BP_DIASTOLIC') bpGroups[dayName].diastolic = m.value;
    });
    
    dashboard.bloodPressure.data = Object.keys(bpGroups).map(day => ({
      day, ...bpGroups[day]
    }));

    res.json({ ...dashboard, rawMetrics: metrics });
  } catch (error) {
    console.error("GET /health error:", error);
    res.status(500).json({ error: 'Failed to fetch health metrics' });
  }
});

// Get AI Generated Health Tips based on recent metrics
router.get('/tips', authMiddleware(['PATIENT']), async (req, res) => {
  const staticTips = [
    "Drink at least 8 glasses of water daily.",
    "Aim for 7-9 hours of quality sleep each night.",
    "Incorporate 30 minutes of moderate exercise into your routine.",
    "Eat a balanced diet rich in vegetables, fruits, and lean proteins.",
    "Take short breaks to stretch if you work at a desk."
  ];

  try {
    const metrics = await prisma.healthMetric.findMany({
      where: { userId: req.user.id },
      orderBy: { recordedAt: 'desc' },
      take: 20
    });

    if (!metrics || metrics.length === 0 || !process.env.GEMINI_API_KEY) {
      return res.json(staticTips);
    }

    const summary = metrics.slice(0, 10).map(m => `${m.type}: ${m.value}`).join(', ');

    const prompt = `
      You are a specialized medical AI assistant for MediConnect.
      A patient has the following recent recorded health metrics:
      ${summary}
      
      Based on these exact metrics, generate 5 short, personalized, actionable, and encouraging health tips.
      If their water intake is low, encourage drinking water. If BP is high, suggest reducing sodium, etc. If everything is good, encourage maintaining the healthy habits. Do NOT give medical advice that requires a doctor.
      
      Respond ONLY in raw JSON format as an array of exactly 5 strings NO markdown blocks.
      Example JSON: ["Drink more water since you only drank 4 glasses yesterday.", "Great job maintaining 8 hours of sleep!", "Your blood pressure is slightly elevated, consider reducing sodium."]
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();
    
    output = output.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = output.match(/\[[\s\S]*\]/);
    if (jsonMatch) output = jsonMatch[0];

    let aiTips = JSON.parse(output);
    if (!Array.isArray(aiTips) || aiTips.length === 0) aiTips = staticTips;

    res.json(aiTips);
  } catch (error) {
    console.error("AI Tips error:", error);
    res.json(staticTips);
  }
});

// Log a new metric
router.post('/', authMiddleware(), async (req, res) => {
  try {
    const { type, value, label, patientId } = req.body;
    
    // If caller is DOCTOR and provided patientId, save to patient. Otherwise save to self.
    const targetUserId = (req.user.role === 'DOCTOR' && patientId) ? patientId : req.user.id;

    const metric = await prisma.healthMetric.create({
      data: {
        userId: targetUserId,
        type,
        value: parseFloat(value),
        label
      }
    });

    // If a doctor updated a patient's record, notify the patient
    if (req.user.role === 'DOCTOR' && targetUserId !== req.user.id) {
      try {
        await prisma.notification.create({
          data: {
            userId: targetUserId,
            title: '🩺 Vitals Updated',
            body: `Your vitals (${type.replace('_', ' ')}) were updated by Dr. ${req.user.name}.`
          }
        });
      } catch (err) {
        console.error("Failed to notify patient of health update:", err);
      }
    }

    res.status(201).json(metric);
  } catch (error) {
    console.error("POST /health error:", error);
    res.status(500).json({ error: 'Failed to log metric' });
  }
});

module.exports = router;
