const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function check() {
  const metrics = await prisma.healthMetric.findMany();
  fs.writeFileSync('metrics.json', JSON.stringify(metrics, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
