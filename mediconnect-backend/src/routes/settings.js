const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware(), async (req, res) => {
  try {
    if (req.user.role !== 'DOCTOR') return res.status(403).json({ error: 'Only doctors have clinic settings' });

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        availabilitySlots: true
      }
    });

    if (!doctorProfile) return res.status(404).json({ error: 'Profile not found' });

    res.json(doctorProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.patch('/', authMiddleware(), async (req, res) => {
  try {
    if (req.user.role !== 'DOCTOR') return res.status(403).json({ error: 'Access denied' });

    const { 
      isAvailable, 
      consultationType, 
      virtualConsult, // legacy but keep for safety
      slots,
      fee,
      clinicAddress,
      languages,
      about
    } = req.body;
    
    let doctorProfile = await prisma.doctorProfile.findUnique({ where: { userId: req.user.id } });
    if (!doctorProfile) return res.status(404).json({ error: 'Profile not found' });

    // Handle string to Int for fee, array for languages
    let updateData = {};
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (consultationType !== undefined) updateData.consultationType = consultationType;
    if (virtualConsult !== undefined && consultationType === undefined) updateData.virtualConsult = virtualConsult;
    if (fee !== undefined) updateData.fee = typeof fee === 'string' ? parseInt(fee, 10) : fee;
    if (clinicAddress !== undefined) updateData.clinicAddress = clinicAddress;
    if (languages !== undefined) {
      if (Array.isArray(languages)) updateData.languages = languages;
      else if (typeof languages === 'string') updateData.languages = languages.split(',').map(l => l.trim()).filter(Boolean);
    }
    if (about !== undefined) updateData.about = about;

    doctorProfile = await prisma.doctorProfile.update({
      where: { userId: req.user.id },
      data: updateData
    });

    if (slots && Array.isArray(slots)) {
      // Clear old slots and recreate
      await prisma.availabilitySlot.deleteMany({
        where: { doctorProfileId: doctorProfile.id }
      });
      await prisma.availabilitySlot.createMany({
        data: slots.map(slot => ({
          doctorProfileId: doctorProfile.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: slot.isActive !== false
        }))
      });
    }

    const updatedProfile = await prisma.doctorProfile.findUnique({
      where: { userId: req.user.id },
      include: { availabilitySlots: true }
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

module.exports = router;
