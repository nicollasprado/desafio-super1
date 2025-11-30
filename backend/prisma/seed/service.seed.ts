import { PrismaClient } from '@prisma/client';

export async function seedServices(prisma: PrismaClient) {
  console.log('🌱 Seeding Services...');

  const services = await prisma.service.createMany({
    data: [
      {
        id: 'f78836e1-3e3b-4c04-b253-28288fc9f83c',
        name: 'Pintor',
      },
      {
        id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
        name: 'Eletricista',
      },
      {
        id: 'b2c3d4e5-f6a7-4b5c-8d9e-0f1a2b3c4d5e',
        name: 'Encanador',
      },
      {
        id: 'c3d4e5f6-a7b8-4c5d-9e0f-1a2b3c4d5e6f',
        name: 'Pedreiro',
      },
      {
        id: 'd4e5f6a7-b8c9-4d5e-0f1a-2b3c4d5e6f7a',
        name: 'Marceneiro',
      },
      {
        id: 'e5f6a7b8-c9d0-4e5f-1a2b-3c4d5e6f7a8b',
        name: 'Jardineiro',
      },
      {
        id: 'f6a7b8c9-d0e1-4f5a-2b3c-4d5e6f7a8b9c',
        name: 'Limpeza',
      },
      {
        id: 'a7b8c9d0-e1f2-4a5b-3c4d-5e6f7a8b9c0d',
        name: 'Montador de Móveis',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${services.count} services`);
}
