const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mediconnect-jwt-super-secret-2026';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, specialty, clinic } = req.body;
    
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        // Generate a random avatar
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${name.replace(/\s+/g, '')}&backgroundColor=b6e3f4`
      }
    });

    // Create corresponding profile
    if (user.role === 'DOCTOR') {
      await prisma.doctorProfile.create({
        data: {
          userId: user.id,
          specialty: specialty || 'General Practitioner',
          clinic: clinic || 'MediConnect Hub',
        }
      });
    } else {
      await prisma.patientProfile.create({
        data: {
          userId: user.id
        }
      });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Check pass
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;
