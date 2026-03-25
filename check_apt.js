const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const id = 'cmn5ca13u000buycwayhwhavt';
  const apt = await prisma.appointment.findUnique({ where: { id } });
  console.log('Appointment:', apt);
  process.exit(0);
}
check();
