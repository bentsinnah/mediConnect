export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  date: string;
  time: string;
  duration?: string;
  clinic: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "in-person" | "voice";
  diagnosis?: string;
  consultationId?: string;
}

export const patientAppointments: Appointment[] = [
  {
    id: "apt-1",
    doctorId: "doc-1",
    doctorName: "Dr. Bayo Ogundimu",
    doctorSpecialty: "General Practitioner",
    doctorAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=bayo&backgroundColor=b6e3f4",
    patientId: "pat-1",
    patientName: "Grace James",
    date: "2026-03-23",
    time: "10:30 AM",
    clinic: "Lagos Central Clinic",
    status: "completed",
    type: "in-person",
    diagnosis: "Upper Respiratory Tract Infection",
    consultationId: "con-1",
  },
  {
    id: "apt-2",
    doctorId: "doc-2",
    doctorName: "Dr. Fatima Bello",
    doctorSpecialty: "Dermatologist",
    doctorAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=fatima&backgroundColor=ffd5dc",
    patientId: "pat-1",
    patientName: "Grace James",
    date: "2026-03-30",
    time: "10:00 AM",
    clinic: "SkinCare Plus Clinic",
    status: "upcoming",
    type: "in-person",
  },
  {
    id: "apt-3",
    doctorId: "doc-4",
    doctorName: "Dr. Ngozi Okafor",
    doctorSpecialty: "Paediatrician",
    doctorAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=ngozi&backgroundColor=ffe4b5",
    patientId: "pat-1",
    patientName: "Grace James",
    date: "2026-04-05",
    time: "9:00 AM",
    clinic: "Little Stars Children's Clinic",
    status: "upcoming",
    type: "in-person",
  },
  {
    id: "apt-4",
    doctorId: "doc-3",
    doctorName: "Dr. Aisha Lawanson",
    doctorSpecialty: "Gynaecologist",
    doctorAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=aisha&backgroundColor=c0f0d8",
    patientId: "pat-1",
    patientName: "Grace James",
    date: "2026-02-14",
    time: "2:00 PM",
    clinic: "Women's Health Centre",
    status: "completed",
    type: "in-person",
    diagnosis: "Routine Check-up",
    consultationId: "con-2",
  },
];

export const doctorAppointments: Appointment[] = [
  {
    id: "dapt-1",
    doctorId: "doc-1",
    doctorName: "Dr. Bayo Ogundimu",
    doctorSpecialty: "General Practitioner",
    doctorAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=bayo&backgroundColor=b6e3f4",
    patientId: "pat-1",
    patientName: "Grace James",
    patientAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=grace&backgroundColor=ffd5dc",
    date: "2026-03-24",
    time: "9:00 AM",
    clinic: "Lagos Central Clinic",
    status: "upcoming",
    type: "in-person",
    consultationId: "dapt-1",
  },
  {
    id: "dapt-2",
    doctorId: "doc-1",
    doctorName: "Dr. Bayo Ogundimu",
    doctorSpecialty: "General Practitioner",
    doctorAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=bayo&backgroundColor=b6e3f4",
    patientId: "pat-2",
    patientName: "Ade Okafor",
    patientAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=ade&backgroundColor=b6e3f4",
    date: "2026-03-24",
    time: "10:30 AM",
    clinic: "Lagos Central Clinic",
    status: "upcoming",
    type: "in-person",
    consultationId: "dapt-2",
  },
  {
    id: "dapt-3",
    doctorId: "doc-1",
    doctorName: "Dr. Bayo Ogundimu",
    doctorSpecialty: "General Practitioner",
    doctorAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=bayo&backgroundColor=b6e3f4",
    patientId: "pat-3",
    patientName: "Chioma Ezeh",
    patientAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=chioma&backgroundColor=c0f0d8",
    date: "2026-03-24",
    time: "2:00 PM",
    clinic: "Lagos Central Clinic",
    status: "completed",
    type: "in-person",
    diagnosis: "Hypertension Management",
    consultationId: "con-3",
  },
  {
    id: "dapt-4",
    doctorId: "doc-1",
    doctorName: "Dr. Bayo Ogundimu",
    doctorSpecialty: "General Practitioner",
    doctorAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=bayo&backgroundColor=b6e3f4",
    patientId: "pat-4",
    patientName: "Temi Adekoya",
    patientAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=temi&backgroundColor=ffe4b5",
    date: "2026-03-25",
    time: "9:00 AM",
    clinic: "Lagos Central Clinic",
    status: "upcoming",
    type: "in-person",
    consultationId: "dapt-4",
  },
  {
    id: "dapt-5",
    doctorId: "doc-1",
    doctorName: "Dr. Bayo Ogundimu",
    doctorSpecialty: "General Practitioner",
    doctorAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=bayo&backgroundColor=b6e3f4",
    patientId: "pat-5",
    patientName: "Bisi Ojo",
    patientAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=bisi&backgroundColor=ffd5dc",
    date: "2026-03-23",
    time: "11:00 AM",
    clinic: "Lagos Central Clinic",
    status: "cancelled",
    type: "in-person",
  },
];
