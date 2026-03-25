require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes will be imported here
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const consultationRoutes = require('./routes/consultations');
const clinicsRoutes = require('./routes/clinics');
const earningsRoutes = require('./routes/earnings');
const healthRoutes = require('./routes/health');
const medicalHistoryRoutes = require('./routes/medical-history');
const notificationsRoutes = require('./routes/notifications');
const profileRoutes = require('./routes/profile');
const symptomsRoutes = require('./routes/symptoms');
const settingsRoutes = require('./routes/settings');

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/clinics', clinicsRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/medical-history', medicalHistoryRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/symptoms', symptomsRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health-check', (req, res) => {
  res.json({ status: 'Backend is running correctly' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`MediConnect Backend running on http://localhost:${PORT}`);
});
