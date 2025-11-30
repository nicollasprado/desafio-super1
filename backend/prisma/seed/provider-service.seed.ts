import { PrismaClient } from '@prisma/client';

export async function seedProviderServices(prisma: PrismaClient) {
  console.log('🌱 Seeding Provider Services...');

  const providerServices = await prisma.providerService.createMany({
    data: [
      {
        id: 'b3cce24b-7cb3-4977-a73d-7a9616b9fa6a',
        description:
          'Serviço profissional de pintura residencial e comercial. Trabalho com tintas de alta qualidade, acabamento impecável e pontualidade garantida. Atendo São Paulo e região.',
        providerId: '5d0de8ee-feda-47de-be91-cd14df10dc2b', // João Silva
        serviceId: 'f78836e1-3e3b-4c04-b253-28288fc9f83c', // Pintor
        imagesUrls: [
          'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800',
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
        ],
      },
      {
        id: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
        description:
          'Instalação e manutenção elétrica residencial e predial. Trabalho com normas de segurança, laudos técnicos e garantia de 1 ano. Atendimento emergencial 24h.',
        providerId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', // Maria Santos
        serviceId: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', // Eletricista
        imagesUrls: [
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
          'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
          'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
        ],
      },
      {
        id: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
        description:
          'Serviços de encanamento, desentupimento e instalação de louças. Trabalho com equipamentos modernos e garantia de serviço. Orçamento gratuito.',
        providerId: 'f6e5d4c3-b2a1-4d5e-9f8a-7b6c5d4e3f2a', // Pedro Oliveira
        serviceId: 'b2c3d4e5-f6a7-4b5c-8d9e-0f1a2b3c4d5e', // Encanador
        imagesUrls: [
          'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800',
          'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800',
          'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800',
        ],
      },
      {
        id: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
        description:
          'Construção, reforma e acabamento. Trabalho com alvenaria, reboco, massa corrida e cerâmica. Experiência de 15 anos no mercado.',
        providerId: 'c9d8e7f6-a5b4-4c3d-2e1f-0a9b8c7d6e5f', // Ana Costa
        serviceId: 'c3d4e5f6-a7b8-4c5d-9e0f-1a2b3c4d5e6f', // Pedreiro
        imagesUrls: [
          'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
          'https://images.unsplash.com/photo-1590496793907-4d425f2d3099?w=800',
        ],
      },
      {
        id: '4d5e6f7a-8b9c-4d0e-1f2a-3b4c5d6e7f8a',
        description:
          'Móveis planejados e sob medida. Armários, estantes, mesas e camas. Trabalho com diversos tipos de madeira e acabamentos. Projetos 3D inclusos.',
        providerId: 'b8c7d6e5-f4a3-4b2c-1d0e-9f8a7b6c5d4e', // Carlos Ferreira
        serviceId: 'd4e5f6a7-b8c9-4d5e-0f1a-2b3c4d5e6f7a', // Marceneiro
        imagesUrls: [
          'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800',
          'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800',
          'https://images.unsplash.com/photo-1522444195799-478538b28823?w=800',
        ],
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${providerServices.count} provider services`);
}
