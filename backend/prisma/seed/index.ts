import 'dotenv/config';
import { seedUsers } from './user.seed';
import { seedServices } from './service.seed';
import { seedProviderServices } from './provider-service.seed';
import { seedVariants } from './variant.seed';
import { seedSchedules } from './schedule.seed';
import { seedContractedServices } from './contracted-service.seed';
import { seedElasticsearch } from './elasticsearch.seed';
import prisma from 'src/infra/lib/prisma';

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Limpar dados existentes (respeita ordem de foreign keys)
    console.log('🧹 Cleaning existing data...');
    await prisma.contractedService.deleteMany({});
    await prisma.schedule.deleteMany({});
    await prisma.variant.deleteMany({});
    await prisma.providerService.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Data cleaned\n');

    // Seed na ordem correta respeitando as dependências
    await seedUsers(prisma);
    await seedServices(prisma);
    await seedProviderServices(prisma);
    await seedVariants(prisma);
    await seedSchedules(prisma);
    await seedContractedServices(prisma);

    // Indexar no Elasticsearch
    await seedElasticsearch(prisma);

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
