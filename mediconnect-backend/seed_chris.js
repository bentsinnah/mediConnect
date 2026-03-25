const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const patientId = 'cmn5a69iz0000uy0475u48xy7'; // Chris Junior
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const data = [
    { userId: patientId, type: 'TEMPERATURE', value: 36.5, recordedAt: twoDaysAgo },
    { userId: patientId, type: 'TEMPERATURE', value: 36.8, recordedAt: yesterday },
    { userId: patientId, type: 'TEMPERATURE', value: 37.1, recordedAt: today },

    { userId: patientId, type: 'BP_SYSTOLIC', value: 118, recordedAt: twoDaysAgo },
    { userId: patientId, type: 'BP_DIASTOLIC', value: 78, recordedAt: twoDaysAgo },
    { userId: patientId, type: 'BP_SYSTOLIC', value: 120, recordedAt: yesterday },
    { userId: patientId, type: 'BP_DIASTOLIC', value: 80, recordedAt: yesterday },
    { userId: patientId, type: 'BP_SYSTOLIC', value: 122, recordedAt: today },
    { userId: patientId, type: 'BP_DIASTOLIC', value: 82, recordedAt: today },

    { userId: patientId, type: 'WEIGHT', value: 70.5, recordedAt: twoDaysAgo },
    { userId: patientId, type: 'WEIGHT', value: 70.2, recordedAt: yesterday },
    { userId: patientId, type: 'WEIGHT', value: 70.0, recordedAt: today },

    { userId: patientId, type: 'WATER', value: 6, recordedAt: twoDaysAgo },
    { userId: patientId, type: 'WATER', value: 7, recordedAt: yesterday },
    { userId: patientId, type: 'WATER', value: 8, recordedAt: today },

    { userId: patientId, type: 'SLEEP', value: 6, recordedAt: twoDaysAgo },
    { userId: patientId, type: 'SLEEP', value: 8, recordedAt: yesterday },
    { userId: patientId, type: 'SLEEP', value: 7, recordedAt: today },
  ];

  for (const d of data) {
    await prisma.healthMetric.create({ data: d });
  }

  console.log("Seeded health metrics for Chris Junior!");
}

seed().catch(console.error).finally(() => prisma.$disconnect());
