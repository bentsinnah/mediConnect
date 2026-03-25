const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware(['PATIENT']), async (req, res) => {
  try {
    const history = await prisma.medicalHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medical history' });
  }
});

router.post('/', authMiddleware(['PATIENT']), async (req, res) => {
  try {
    const { type, name, severity, details, diagnosedAt } = req.body;
    
    const entry = await prisma.medicalHistory.create({
      data: {
        userId: req.user.id,
        type, // CONDITION | ALLERGY | MEDICATION
        name,
        severity,
        details,
        diagnosedAt
      }
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add medical history' });
  }
});

module.exports = router;
