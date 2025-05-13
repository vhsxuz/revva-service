import { PrismaClient } from '@prisma/client';
import { generateSeedData } from './seedData.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    await generateSeedData(prisma);
    console.log('✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();