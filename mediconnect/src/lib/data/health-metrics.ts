export const healthMetrics = {
  temperature: {
    unit: "°C",
    data: [
      { day: "Mon", value: 37.1 },
      { day: "Tue", value: 37.0 },
      { day: "Wed", value: 37.3 },
      { day: "Thu", value: 37.8 },
      { day: "Fri", value: 37.5 },
      { day: "Sat", value: 37.2 },
      { day: "Sun", value: 36.9 },
    ],
  },
  bloodPressure: {
    unit: "mmHg",
    data: [
      { day: "Mon", systolic: 118, diastolic: 76 },
      { day: "Tue", systolic: 120, diastolic: 78 },
      { day: "Wed", systolic: 119, diastolic: 77 },
      { day: "Thu", systolic: 122, diastolic: 79 },
      { day: "Fri", systolic: 118, diastolic: 76 },
      { day: "Sat", systolic: 121, diastolic: 78 },
      { day: "Sun", systolic: 120, diastolic: 77 },
    ],
  },
  weight: {
    unit: "kg",
    data: [
      { day: "Mon", value: 74.2 },
      { day: "Tue", value: 74.0 },
      { day: "Wed", value: 74.3 },
      { day: "Thu", value: 73.9 },
      { day: "Fri", value: 74.1 },
      { day: "Sat", value: 73.8 },
      { day: "Sun", value: 73.7 },
    ],
  },
  water: {
    current: 3,
    goal: 8,
    unit: "glasses",
  },
  sleep: {
    last: 7,
    unit: "hrs",
    options: [5, 6, 7, 8],
    selected: 7,
  },
};

export const healthTips = [
  "Drink at least 8 glasses of water daily",
  "Walk for 30 minutes every day",
  "Include fruits and vegetables in every meal",
  "Get 7-8 hours of sleep each night",
  "Practice deep breathing exercises for 5 minutes daily",
  "Limit screen time 1 hour before bed",
  "Wash your hands regularly to prevent infections",
  "Schedule an annual check-up with your doctor",
];
