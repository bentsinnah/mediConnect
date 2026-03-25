export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  distance: string;
  fee: number;
  clinic: string;
  clinicAddress: string;
  languages: string[];
  about: string;
  avatar: string;
  availableSlots: {
    today: string[];
    tomorrow: string[];
    dayAfter: string[];
  };
  experience: number;
  patients: number;
}

export const doctors: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Bayo Ogundimu",
    specialty: "General Practitioner",
    rating: 4.8,
    reviews: 124,
    distance: "1.2km",
    fee: 5000,
    clinic: "Lagos Central Clinic",
    clinicAddress: "14 Broad Street, Lagos Island",
    languages: ["English", "Yoruba"],
    about: "Over 15 years of experience in general medicine. Specializes in primary care and preventive health. Trained at University of Lagos.",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=bayo&backgroundColor=b6e3f4",
    availableSlots: {
      today: ["9:00 AM", "10:30 AM", "2:00 PM", "4:00 PM"],
      tomorrow: ["8:00 AM", "11:00 AM", "3:00 PM"],
      dayAfter: ["9:00 AM", "1:00 PM", "5:00 PM"],
    },
    experience: 15,
    patients: 1200,
  },
  {
    id: "doc-2",
    name: "Dr. Fatima Bello",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 73,
    distance: "1.8km",
    fee: 10000,
    clinic: "SkinCare Plus Clinic",
    clinicAddress: "22 Victoria Island, Lagos",
    languages: ["English", "Hausa", "Yoruba"],
    about: "Expert in skin conditions common in tropical climates. 10 years of dermatology practice with focus on melanin-rich skin types.",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=fatima&backgroundColor=ffd5dc",
    availableSlots: {
      today: ["10:00 AM", "12:00 PM", "2:30 PM", "4:30 PM"],
      tomorrow: ["9:00 AM", "1:00 PM", "3:30 PM"],
      dayAfter: ["10:00 AM", "2:00 PM"],
    },
    experience: 10,
    patients: 850,
  },
  {
    id: "doc-3",
    name: "Dr. Aisha Lawanson",
    specialty: "Gynaecologist",
    rating: 4.7,
    reviews: 89,
    distance: "1.9km",
    fee: 12000,
    clinic: "Women's Health Centre",
    clinicAddress: "5 Awolowo Road, Ikoyi",
    languages: ["English", "Yoruba"],
    about: "Dedicated women's health specialist with 12 years experience. Provides compassionate care for all stages of women's reproductive health.",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=aisha&backgroundColor=c0f0d8",
    availableSlots: {
      today: ["11:30 AM", "2:00 PM", "4:00 PM"],
      tomorrow: ["9:30 AM", "12:00 PM", "3:00 PM"],
      dayAfter: ["10:00 AM", "1:00 PM", "4:30 PM"],
    },
    experience: 12,
    patients: 940,
  },
  {
    id: "doc-4",
    name: "Dr. Ngozi Okafor",
    specialty: "Paediatrician",
    rating: 4.8,
    reviews: 156,
    distance: "2.1km",
    fee: 8000,
    clinic: "Little Stars Children's Clinic",
    clinicAddress: "9 Murtala Mohammed Way, Yaba",
    languages: ["English", "Igbo"],
    about: "Passionate child health advocate with 8 years of pediatric experience. Known for her gentle approach and child-friendly consultations.",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=ngozi&backgroundColor=ffe4b5",
    availableSlots: {
      today: ["9:00 AM", "11:00 AM", "3:00 PM"],
      tomorrow: ["8:30 AM", "12:30 PM", "4:00 PM"],
      dayAfter: ["9:00 AM", "2:00 PM"],
    },
    experience: 8,
    patients: 1100,
  },
  {
    id: "doc-5",
    name: "Dr. Emeka Chukwu",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 48,
    distance: "3.2km",
    fee: 20000,
    clinic: "Heart & Vascular Institute",
    clinicAddress: "1 Kofo Abayomi Street, Victoria Island",
    languages: ["English", "Igbo"],
    about: "Consultant cardiologist trained in London with specialization in interventional cardiology and heart failure management.",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=emeka&backgroundColor=d4e6f1",
    availableSlots: {
      today: ["2:00 PM", "4:00 PM"],
      tomorrow: ["10:00 AM", "2:00 PM"],
      dayAfter: ["9:00 AM", "11:00 AM", "3:00 PM"],
    },
    experience: 18,
    patients: 620,
  },
  {
    id: "doc-6",
    name: "Dr. Tunde Adeyemi",
    specialty: "ENT Specialist",
    rating: 4.6,
    reviews: 61,
    distance: "2.5km",
    fee: 9000,
    clinic: "Ear Nose Throat Centre",
    clinicAddress: "3 Herbert Macaulay Way, Yaba",
    languages: ["English", "Yoruba"],
    about: "ENT specialist with expertise in voice disorders, sinusitis, and hearing aids. Over 7 years of practice in Lagos.",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=tunde&backgroundColor=e8d5f5",
    availableSlots: {
      today: ["9:30 AM", "11:30 AM", "1:30 PM", "3:30 PM"],
      tomorrow: ["9:00 AM", "12:00 PM", "4:00 PM"],
      dayAfter: ["10:00 AM", "2:30 PM"],
    },
    experience: 7,
    patients: 780,
  },
];

export const getDoctorById = (id: string) => doctors.find(d => d.id === id);

export const getClinics = () => {
  const clinicMap = new Map();
  
  doctors.forEach(doc => {
    if (!clinicMap.has(doc.clinic)) {
      clinicMap.set(doc.clinic, {
        name: doc.clinic,
        address: doc.clinicAddress,
        distance: doc.distance,
        rating: doc.rating, // Using doctor rating as a proxy
        doctorCount: 1
      });
    } else {
      const clinic = clinicMap.get(doc.clinic);
      clinic.doctorCount += 1;
    }
  });

  return Array.from(clinicMap.values());
};

export const getDoctorsByClinic = (clinicName: string) => 
  doctors.filter(d => d.clinic === clinicName);
