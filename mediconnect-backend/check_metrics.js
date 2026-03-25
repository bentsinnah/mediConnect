const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const metrics = await prisma.healthMetric.findMany({
    include: { user: { select: { id: true, name: true, role: true } } }
  });
  console.log("Total Health Metrics:", metrics.length);
  metrics.forEach(m => {
    console.log(`- ${m.user.name} (${m.user.id}) | ${m.type}: ${m.value} [PatientID column on Metric? NO, it's just userId: ${m.userId}]`);
  });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, role: true }
  });
  console.log("\nUsers:");
  users.forEach(u => console.log(`- ${u.name} | ${u.role} | ID: ${u.id}`));
}

check().catch(console.error).finally(() => prisma.$disconnect());
