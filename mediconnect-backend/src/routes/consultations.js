const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all consultations for current user
router.get('/', authMiddleware(), async (req, res) => {
  try {
    const consultations = await prisma.consultation.findMany({
      where: {
        appointment: {
          OR: [
            { patientId: req.user.id },
            { doctorId: req.user.id }
          ]
        }
      },
      include: {
        appointment: {
          include: {
            doctor: { select: { name: true, avatar: true } },
            patient: { select: { id: true, name: true, avatar: true } }
          }
        },
        doctorProfile: { select: { specialty: true, clinic: true } },
        prescriptions: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(consultations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
});

// Get consultation by ID or Appointment ID
router.get('/:id', authMiddleware(), async (req, res) => {
  try {
    const consultation = await prisma.consultation.findFirst({
      where: {
        OR: [
          { id: req.params.id },
          { appointmentId: req.params.id }
        ]
      },
      include: {
        appointment: {
          include: {
            doctor: { select: { name: true, avatar: true } },
            patient: { select: { name: true, avatar: true } }
          }
        },
        doctorProfile: { select: { specialty: true } },
        prescriptions: true
      }
    });

    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

    // Format like the frontend expects
    const formatted = {
      id: consultation.id,
      appointmentId: consultation.appointmentId,
      doctorName: consultation.appointment.doctor.name,
      doctorSpecialty: consultation.doctorProfile?.specialty || 'General Practitioner',
      doctorAvatar: consultation.appointment.doctor.avatar,
      patientName: consultation.appointment.patient.name,
      date: consultation.appointment.date,
      time: consultation.appointment.time,
      clinic: consultation.appointment.clinic,
      diagnosis: consultation.diagnosis,
      notes: consultation.notes,
      followUpDate: consultation.followUpDate,
      medications: consultation.prescriptions.map(p => ({
        name: p.medicationName,
        dosage: p.dosage,
        frequency: p.frequency,
        duration: p.duration
      }))
    };

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch consultation' });
  }
});

// Create Consultation (Doctor only)
router.post('/', authMiddleware(['DOCTOR']), async (req, res) => {
  try {
    const { appointmentId, diagnosis, notes, followUpDate, medications } = req.body;
    
    const docProfile = await prisma.doctorProfile.findUnique({ where: { userId: req.user.id } });
    
    if (!docProfile) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    // 1. Mark appointment completed
    try {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'completed' }
      });
    } catch (err) {
      console.error("Failed to update appointment status:", err);
      return res.status(500).json({ error: 'Failed to update appointment status: ' + err.message });
    }

    // 2. Create consultation + prescriptions
    let consultation;
    try {
      consultation = await prisma.consultation.create({
        data: {
          appointmentId,
          doctorProfileId: docProfile.id,
          diagnosis,
          notes,
          followUpDate,
          prescriptions: {
            create: (medications || []).map(med => ({
              medicationName: med.medicationName || med.name || "Unknown",
              dosage: med.dosage || "As directed",
              frequency: med.frequency || "Daily",
              duration: med.duration || "N/A"
            }))
          }
        },
        include: { prescriptions: true }
      });
    } catch (err) {
      console.error("Failed to create consultation record:", err);
      return res.status(500).json({ error: 'Failed to create consultation record: ' + err.message });
    }

    // 3. Award 15,000 NGN to Doctor
    try {
      await prisma.transaction.create({
        data: {
          doctorProfileId: docProfile.id,
          amount: 15000,
          type: 'CREDIT',
          description: `Consultation - Earnings`
        }
      });
    } catch (err) {
      console.error("Failed to record transaction:", err);
      // Don't fail the whole request if just the transaction fails, but log it
    }

    // 4. Notify patient that consultation results are ready
    try {
      const appt = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { doctor: { select: { name: true } } }
      });
      if (appt) {
        await prisma.notification.create({
          data: {
            userId: appt.patientId,
            title: '📋 Consultation Results Ready',
            body: `Dr. ${appt.doctor.name} has completed your consultation. Your diagnosis: "${diagnosis}". View your results in the Appointments tab.`
          }
        });
      }
    } catch (err) {
      console.error("Failed to notify patient:", err);
    }

    res.status(201).json(consultation);
  } catch (error) {
    console.error("Top-level consultation error:", error);
    res.status(500).json({ error: 'Failed to save consultation: ' + error.message });
  }
});

module.exports = router;
