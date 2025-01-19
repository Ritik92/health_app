const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
export async function getMedicines() {
  try {
    const medicines = await prisma.medicine.findMany();
    return medicines;
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    await prisma.$disconnect();
  }
}

