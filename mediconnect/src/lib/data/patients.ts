export interface Patient {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  lastVisit: string;
  avatar: string;
  bloodGroup?: string;
  weight?: string;
  height?: string;
}

export const patients: Patient[] = [
  { 
    id: 'PT-1002', 
    name: 'Grace James', 
    gender: 'Female', 
    age: 34, 
    lastVisit: '2 days ago', 
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=grace&backgroundColor=ffd5dc',
    bloodGroup: 'O+',
    weight: '65kg',
    height: '165cm'
  },
  { 
    id: 'PT-1034', 
    name: 'Chinedu Okeke', 
    gender: 'Male', 
    age: 45, 
    lastVisit: '1 week ago', 
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=ade&backgroundColor=b6e3f4',
    bloodGroup: 'A+',
    weight: '82kg',
    height: '180cm'
  },
  { 
    id: 'PT-1056', 
    name: 'Amina Bello', 
    gender: 'Female', 
    age: 29, 
    lastVisit: '1 month ago', 
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=chioma&backgroundColor=c0f0d8',
    bloodGroup: 'B-',
    weight: '58kg',
    height: '160cm'
  },
];

export const getPatientById = (id: string) => patients.find(p => p.id === id);
