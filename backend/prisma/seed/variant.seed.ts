import { PrismaClient } from '@prisma/client';

export async function seedVariants(prisma: PrismaClient) {
  console.log('🌱 Seeding Variants...');

  const variants = await prisma.variant.createMany({
    data: [
      // Variantes do Pintor (João Silva)
      {
        id: '4c0d7209-0438-433d-b74a-b595c82654e6',
        name: 'Básico',
        price: 2000, // R$ 20,00
        durationMinutes: 60,
        providerServiceId: 'b3cce24b-7cb3-4977-a73d-7a9616b9fa6a',
      },
      {
        id: 'd6f9a4f1-87a2-43e4-a2f8-0e0aea86695e',
        name: 'Premium',
        price: 3000, // R$ 30,00
        durationMinutes: 90,
        providerServiceId: 'b3cce24b-7cb3-4977-a73d-7a9616b9fa6a',
      },
      {
        id: '5a6b7c8d-9e0f-4a1b-2c3d-4e5f6a7b8c9d',
        name: 'Completo',
        price: 5000, // R$ 50,00
        durationMinutes: 120,
        providerServiceId: 'b3cce24b-7cb3-4977-a73d-7a9616b9fa6a',
      },

      // Variantes do Eletricista (Maria Santos)
      {
        id: '6b7c8d9e-0f1a-4b2c-3d4e-5f6a7b8c9d0e',
        name: 'Manutenção',
        price: 15000, // R$ 150,00
        durationMinutes: 60,
        providerServiceId: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
      },
      {
        id: '7c8d9e0f-1a2b-4c3d-4e5f-6a7b8c9d0e1f',
        name: 'Instalação',
        price: 25000, // R$ 250,00
        durationMinutes: 120,
        providerServiceId: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
      },

      // Variantes do Encanador (Pedro Oliveira)
      {
        id: '8d9e0f1a-2b3c-4d4e-5f6a-7b8c9d0e1f2a',
        name: 'Desentupimento',
        price: 12000, // R$ 120,00
        durationMinutes: 45,
        providerServiceId: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
      },
      {
        id: '9e0f1a2b-3c4d-4e5f-6a7b-8c9d0e1f2a3b',
        name: 'Instalação Completa',
        price: 35000, // R$ 350,00
        durationMinutes: 180,
        providerServiceId: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
      },

      // Variantes do Pedreiro (Ana Costa)
      {
        id: '0f1a2b3c-4d5e-4f6a-7b8c-9d0e1f2a3b4c',
        name: 'Reforma Pequena',
        price: 50000, // R$ 500,00
        durationMinutes: 240,
        providerServiceId: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
      },
      {
        id: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5e',
        name: 'Reforma Completa',
        price: 150000, // R$ 1.500,00
        durationMinutes: 480,
        providerServiceId: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
      },

      // Variantes do Marceneiro (Carlos Ferreira)
      {
        id: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6f',
        name: 'Móvel Simples',
        price: 80000, // R$ 800,00
        durationMinutes: 180,
        providerServiceId: '4d5e6f7a-8b9c-4d0e-1f2a-3b4c5d6e7f8a',
      },
      {
        id: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e70',
        name: 'Móvel Planejado',
        price: 200000, // R$ 2.000,00
        durationMinutes: 360,
        providerServiceId: '4d5e6f7a-8b9c-4d0e-1f2a-3b4c5d6e7f8a',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${variants.count} variants`);
}
