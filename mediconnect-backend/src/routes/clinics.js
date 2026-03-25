const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all unique clinics from doctor profiles
router.get('/', async (req, res) => {
  try {
    const doctors = await prisma.doctorProfile.findMany({
      select: {
        clinic: true,
        clinicAddress: true,
        distance: true
      },
      distinct: ['clinic']
    });

    const clinics = doctors.map(d => ({
      name: d.clinic,
      address: d.clinicAddress || 'Lagos, Nigeria',
      distance: d.distance
    }));

    res.json(clinics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clinics' });
  }
});

module.exports = router;
