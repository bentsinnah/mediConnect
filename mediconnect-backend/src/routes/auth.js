const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { sendMail } = require('../lib/mailer');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mediconnect-jwt-super-secret-2026';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Generate a cryptographically simple 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── REGISTER ───────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, specialty, clinic } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields (name, email, password, role) are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        emailVerificationToken: otp,
        isVerified: false,
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${name.replace(/\s+/g, '')}&backgroundColor=b6e3f4`
      }
    });

    // Create role profile
    if (user.role === 'DOCTOR') {
      await prisma.doctorProfile.create({
        data: {
          userId: user.id,
          specialty: specialty || 'General Practitioner',
          clinic: clinic || 'MediConnect Hub',
        }
      });
    } else {
      await prisma.patientProfile.create({ data: { userId: user.id } });
    }

    // Send verification email
    try {
      await sendMail({
        to: email,
        subject: '🏥 MediConnect — Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin:0 auto; padding: 32px; border-radius: 12px; border: 1px solid #E5E7EB;">
            <h2 style="color:#1a56db; margin-bottom:8px;">Welcome to MediConnect, ${name.split(' ')[0]}! 👋</h2>
            <p style="color:#374151; font-size:15px; margin-bottom:24px;">
              To get started, please verify your email address using the code below.
            </p>
            <div style="background:#F0FDF4; border:2px dashed #22C55E; border-radius:12px; padding:24px; text-align:center; margin-bottom:24px;">
              <p style="margin:0; font-size:13px; color:#6B7280; letter-spacing:1px; text-transform:uppercase; font-weight:600;">Your Verification Code</p>
              <p style="margin:8px 0 0; font-size:42px; font-weight:800; color:#16A34A; letter-spacing:8px;">${otp}</p>
            </div>
            <p style="color:#6B7280; font-size:13px;">This code expires in <strong>30 minutes</strong>. If you did not sign up for MediConnect, please ignore this email.</p>
            <hr style="border:none; border-top:1px solid #E5E7EB; margin:24px 0;" />
            <p style="color:#9CA3AF; font-size:12px; text-align:center;">© 2026 MediConnect. Connecting Patients & Doctors.</p>
          </div>
        `
      });
    } catch (mailErr) {
      console.error('[Register] Failed to send verification email:', mailErr.message);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, isVerified: false },
      message: 'Account created. Please verify your email.'
    });
  } catch (error) {
    console.error('[Register] Error:', error);
    res.status(500).json({ error: 'Failed to register. Please try again.' });
  }
});

// ─── VERIFY EMAIL ────────────────────────────────────────────────────────────
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required.' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    if (user.isVerified) return res.json({ message: 'Email already verified.' });
    if (user.emailVerificationToken !== otp) return res.status(400).json({ error: 'Invalid verification code. Please check your email and try again.' });

    await prisma.user.update({
      where: { email },
      data: { isVerified: true, emailVerificationToken: null }
    });

    res.json({ success: true, message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('[Verify Email] Error:', error);
    res.status(500).json({ error: 'Failed to verify email.' });
  }
});

// ─── RESEND VERIFICATION ─────────────────────────────────────────────────────
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    if (user.isVerified) return res.json({ message: 'Email is already verified.' });

    const otp = generateOTP();
    await prisma.user.update({ where: { email }, data: { emailVerificationToken: otp } });

    try {
      await sendMail({
        to: email,
        subject: '🏥 MediConnect — New Verification Code',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;border-radius:12px;border:1px solid #E5E7EB;">
            <h2 style="color:#1a56db;">New Verification Code</h2>
            <p style="color:#374151;font-size:15px;">Here is your new verification code:</p>
            <div style="background:#F0FDF4;border:2px dashed #22C55E;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
              <p style="margin:0;font-size:42px;font-weight:800;color:#16A34A;letter-spacing:8px;">${otp}</p>
            </div>
            <p style="color:#6B7280;font-size:13px;">Expires in 30 minutes.</p>
          </div>
        `
      });
    } catch (e) {
      console.error('[Resend] Mail failed:', e.message);
    }

    res.json({ success: true, message: 'New verification code sent to your email.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resend verification.' });
  }
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('[Login] Error:', error);
    res.status(500).json({ error: 'Failed to login. Please try again.' });
  }
});

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const user = await prisma.user.findUnique({ where: { email } });
    // Don't reveal if the user exists or not (security best practice)
    if (!user) return res.json({ message: 'If that email is registered, you will receive a reset link shortly.' });

    // For now we send a simple "contact support" email
    try {
      await sendMail({
        to: email,
        subject: '🔐 MediConnect — Password Reset Request',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;border-radius:12px;border:1px solid #E5E7EB;">
            <h2 style="color:#1a56db;">Password Reset</h2>
            <p style="color:#374151;font-size:15px;">We received a request to reset your MediConnect password.</p>
            <p style="color:#374151;font-size:15px;">If you did not make this request, please ignore this email.</p>
            <p style="color:#374151;font-size:15px;">To reset your password, please contact MediConnect support at <strong>support@mediconnect.app</strong>.</p>
            <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0;" />
            <p style="color:#9CA3AF;font-size:12px;text-align:center;">© 2026 MediConnect</p>
          </div>
        `
      });
    } catch (e) {
      console.error('[ForgotPassword] Mail failed:', e.message);
    }

    res.json({ success: true, message: 'If that email is registered, you will receive a reset link shortly.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request.' });
  }
});

module.exports = router;
