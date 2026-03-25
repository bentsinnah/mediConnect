export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  patientName: string;
  date: string;
  time: string;
  clinic: string;
  diagnosis: string;
  notes: string;
  medications: Medication[];
  followUpDate?: string;
}

export const consultations: Consultation[] = [
  {
    id: "con-1",
    appointmentId: "apt-1",
    doctorName: "Dr. Bayo Ogundimu",
    doctorSpecialty: "General Practitioner",
    doctorAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=bayo&backgroundColor=b6e3f4",
    patientName: "Grace James",
    date: "2026-03-23",
    time: "10:30 AM",
    clinic: "Lagos Central Clinic",
    diagnosis: "Upper Respiratory Tract Infection",
    notes: "Patient presented with sore throat, mild fever, and nasal congestion for 3 days. Vitals are stable. Prescribed antibiotics and rest.",
    medications: [
      { name: "Amoxicillin 500mg", dosage: "1 capsule", frequency: "3 times daily", duration: "7 days" },
      { name: "Paracetamol 500mg", dosage: "2 tablets", frequency: "As needed (max 4 times daily)", duration: "5 days" },
      { name: "Vitamin C 1000mg", dosage: "1 tablet", frequency: "Once daily", duration: "14 days" },
    ],
    followUpDate: "2026-03-30",
  },
  {
    id: "con-2",
    appointmentId: "apt-4",
    doctorName: "Dr. Aisha Lawanson",
    doctorSpecialty: "Gynaecologist",
    doctorAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=aisha&backgroundColor=c0f0d8",
    patientName: "Grace James",
    date: "2026-02-14",
    time: "2:00 PM",
    clinic: "Women's Health Centre",
    diagnosis: "Routine Annual Check-up",
    notes: "All vitals within normal range. No abnormalities detected. Recommended continued vitamin D supplementation. Next routine check in 12 months.",
    medications: [
      { name: "Vitamin D3 2000IU", dosage: "1 capsule", frequency: "Once daily", duration: "90 days" },
      { name: "Folic Acid 400mcg", dosage: "1 tablet", frequency: "Once daily", duration: "90 days" },
    ],
    followUpDate: "2027-02-14",
  },
  {
    id: "con-3",
    appointmentId: "dapt-3",
    doctorName: "Dr. Bayo Ogundimu",
    doctorSpecialty: "General Practitioner",
    doctorAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=bayo&backgroundColor=b6e3f4",
    patientName: "Chioma Ezeh",
    date: "2026-03-24",
    time: "2:00 PM",
    clinic: "Lagos Central Clinic",
    diagnosis: "Hypertension Management",
    notes: "BP reading 145/92. Patient has been on medication for 6 months. Advised lifestyle changes and dietary modifications. Will monitor progress.",
    medications: [
      { name: "Amlodipine 5mg", dosage: "1 tablet", frequency: "Once daily", duration: "30 days" },
      { name: "Losartan 50mg", dosage: "1 tablet", frequency: "Once daily", duration: "30 days" },
    ],
    followUpDate: "2026-04-24",
  },
];

export const getConsultationById = (id: string) => consultations.find(c => c.id === id);
