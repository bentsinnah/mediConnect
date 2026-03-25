const express = require('express');
const prisma = require('../lib/prisma');
const router = express.Router();

// Get all doctors with optional filters
router.get('/', async (req, res) => {
  try {
    const { q, clinic, specialty } = req.query;
    
    const where = {
      user: { role: 'DOCTOR' },
    };

    if (q) {
      where.user.name = { contains: q, mode: 'insensitive' };
    }
    if (clinic) {
      where.clinic = clinic;
    }
    if (specialty && specialty !== 'All') {
      where.specialty = specialty;
    }

    const doctors = await prisma.doctorProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        availabilitySlots: { where: { isActive: true } }
      }
    });

    // Transform response to match frontend expectations
    const formatted = doctors.map(d => {
      const today = new Date().getDay();
      const tomorrow = (today + 1) % 7;
      const dayAfter = (today + 2) % 7;

      const slots = { today: [], tomorrow: [], dayAfter: [] };
      d.availabilitySlots.forEach(s => {
        if (s.dayOfWeek === today) slots.today.push(s.startTime);
        else if (s.dayOfWeek === tomorrow) slots.tomorrow.push(s.startTime);
        else if (s.dayOfWeek === dayAfter) slots.dayAfter.push(s.startTime);
      });

      return {
        id: d.userId,
        name: d.user.name,
        specialty: d.specialty,
        clinic: d.clinic,
        rating: d.rating,
        reviews: d.reviews,
        fee: d.fee,
        avatar: d.user.avatar,
        distance: d.distance,
        languages: d.languages,
        availableSlots: slots
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Get single doctor details
router.get('/:id', async (req, res) => {
  try {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId: req.params.id },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        availabilitySlots: { where: { isActive: true } }
      }
    });

    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
});

module.exports = router;
