const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Helper to create a notification
async function createNotification(userId, title, body) {
  try {
    await prisma.notification.create({ data: { userId, title, body } });
  } catch (e) {
    console.error('Failed to create notification:', e.message);
  }
}

// Get appointments for the authenticated user
router.get('/', authMiddleware(), async (req, res) => {
  try {
    const isDoctor = req.user.role === 'DOCTOR';
    
    const appointments = await prisma.appointment.findMany({
      where: isDoctor ? { doctorId: req.user.id } : { patientId: req.user.id },
      include: {
        doctor: { select: { name: true, avatar: true } },
        patient: { select: { id: true, name: true, avatar: true, email: true } },
        consultation: { select: { id: true, diagnosis: true } }
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ]
    });

    const formatted = appointments.map(apt => ({
      id: apt.id,
      doctorId: apt.doctorId,
      patientId: apt.patientId,
      date: apt.date,
      time: apt.time,
      clinic: apt.clinic,
      status: apt.status,
      type: apt.type,
      duration: apt.duration,
      doctorName: apt.doctor.name,
      doctorAvatar: apt.doctor.avatar,
      patientName: apt.patient.name,
      patientAvatar: apt.patient.avatar,
      patientEmail: apt.patient.email,
      consultationId: apt.consultation?.id,
      diagnosis: apt.consultation?.diagnosis,
      patient: apt.patient
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Book new appointment (Patient only)
router.post('/', authMiddleware(['PATIENT']), async (req, res) => {
  try {
    const { doctorId, date, time, clinic, type } = req.body;
    
    // Check if slot is taken
    const existing = await prisma.appointment.findFirst({
      where: { doctorId, date, time, status: { not: 'cancelled' } }
    });

    if (existing) {
      return res.status(400).json({ error: 'Time slot already booked' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: req.user.id,
        doctorId,
        date,
        time,
        clinic,
        type: type || 'in_person',
        status: 'upcoming',
        duration: '30 mins'
      }
    });

    // Get patient and doctor names for notifications
    const [patient, doctor] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.user.id }, select: { name: true } }),
      prisma.user.findUnique({ where: { id: doctorId }, select: { name: true } })
    ]);

    // Notify the DOCTOR of new appointment
    await createNotification(
      doctorId,
      '📅 New Appointment Booked',
      `${patient.name} has booked an appointment with you on ${date} at ${time}.`
    );

    // Notify the PATIENT of booking confirmation
    await createNotification(
      req.user.id,
      '✅ Appointment Confirmed',
      `Your appointment with ${doctor?.name || 'your doctor'} is confirmed for ${date} at ${time} — ${clinic}.`
    );

    res.status(201).json(appointment);
  } catch (error) {
    console.error("POST /appointments error:", error);
    res.status(500).json({ error: 'Failed to book: ' + error.message });
  }
});

// Get single appointment by ID
router.get('/:id', authMiddleware(), async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: {
        doctor: true,
        patient: { select: { name: true, avatar: true, email: true } },
        consultation: true
      }
    });

    if (!appointment) {
      console.log(`Appointment ${req.params.id} not found`);
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(`GET /appointments/${req.params.id} error:`, error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// Update appointment status (Cancel / Complete / Decline)
router.patch('/:id/status', authMiddleware(), async (req, res) => {
  try {
    const { status, reason } = req.body;
    const allowedStatuses = ['cancelled', 'completed', 'upcoming', 'declined'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const existing = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: {
        doctor: { select: { name: true } },
        patient: { select: { name: true } }
      }
    });

    if (!existing) return res.status(404).json({ error: 'Appointment not found' });

    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status }
    });

    // Send notifications based on who cancelled/declined
    const isDoctor = req.user.role === 'DOCTOR';
    const cancelDate = `${existing.date} at ${existing.time}`;

    if (status === 'cancelled') {
      if (isDoctor) {
        // Doctor cancelled → notify patient
        await createNotification(
          existing.patientId,
          '❌ Appointment Cancelled',
          `Dr. ${existing.doctor.name} has cancelled your appointment on ${cancelDate}.${reason ? ' Reason: ' + reason : ''}`
        );
      } else {
        // Patient cancelled → notify doctor
        await createNotification(
          existing.doctorId,
          '❌ Appointment Cancelled',
          `${existing.patient.name} has cancelled their appointment on ${cancelDate}.${reason ? ' Reason: ' + reason : ''}`
        );
      }
    } else if (status === 'declined') {
      // Doctor declined → notify patient
      await createNotification(
        existing.patientId,
        '⚠️ Appointment Declined',
        `Your appointment request on ${cancelDate} was declined by Dr. ${existing.doctor.name}.${reason ? ' Reason: ' + reason : ''}`
      );
    }

    res.json(appointment);
  } catch (error) {
    console.error('PATCH /appointments/:id/status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
