const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/', authMiddleware(), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        doctorProfile: req.user.role === 'DOCTOR',
        patientProfile: req.user.role === 'PATIENT'
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update Profile
router.patch('/', authMiddleware(), async (req, res) => {
  try {
    const { name, phone, avatar, ...profileData } = req.body;

    // Only include fields that are explicitly passed to avoid overwriting with undefined
    const userUpdateData = {};
    if (name !== undefined) userUpdateData.name = name;
    if (phone !== undefined) userUpdateData.phone = phone;
    if (avatar !== undefined) userUpdateData.avatar = avatar;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: userUpdateData
    });

    // Remove undefined keys from profileData
    const cleanProfileData = Object.fromEntries(
      Object.entries(profileData).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(cleanProfileData).length > 0) {
      if (req.user.role === 'DOCTOR') {
        await prisma.doctorProfile.update({
          where: { userId: req.user.id },
          data: cleanProfileData
        });
      } else {
        await prisma.patientProfile.update({
          where: { userId: req.user.id },
          data: cleanProfileData
        });
      }
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('[Profile PATCH]', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update Password
router.patch('/password', authMiddleware(), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(400).json({ error: 'Incorrect current password' });
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

module.exports = router;
