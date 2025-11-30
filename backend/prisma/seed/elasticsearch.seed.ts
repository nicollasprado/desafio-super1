import { PrismaClient } from '@prisma/client';
import { Client } from '@elastic/elasticsearch';

export async function seedElasticsearch(prisma: PrismaClient) {
  console.log('🔍 Seeding Elasticsearch...');

  const esClient = new Client({
    node: process.env.ES_NODE || 'http://localhost:9200',
  });

  try {
    // Limpar índices existentes
    console.log('🧹 Cleaning Elasticsearch indices...');

    const providerServicesExists = await esClient.indices.exists({
      index: 'provider-services',
    });
    if (providerServicesExists) {
      await esClient.indices.delete({ index: 'provider-services' });
    }

    const contractedServicesExists = await esClient.indices.exists({
      index: 'contracted-services',
    });
    if (contractedServicesExists) {
      await esClient.indices.delete({ index: 'contracted-services' });
    }

    console.log('✅ Elasticsearch indices cleaned\n');

    // Recriar os índices (serão criados automaticamente no primeiro insert)
    // Buscar todos os provider services com suas relações
    const providerServices = await prisma.providerService.findMany({
      include: {
        service: true,
        provider: true,
        variants: true,
        schedules: true,
      },
    });

    // Indexar provider services
    for (const ps of providerServices) {
      await esClient.index({
        index: 'provider-services',
        id: ps.id,
        document: {
          id: ps.id,
          description: ps.description,
          imagesUrls: ps.imagesUrls,
          variants: ps.variants.map((v) => ({
            id: v.id,
            name: v.name,
            price: v.price,
            durationMinutes: v.durationMinutes,
          })),
          schedules: ps.schedules.map((s) => ({
            id: s.id,
            weekday: s.weekday,
            start: s.start,
            end: s.end,
          })),
          service: {
            id: ps.service.id,
            name: ps.service.name,
          },
          provider: {
            id: ps.provider.id,
            firstName: ps.provider.firstName,
            lastName: ps.provider.lastName,
            avatarUrl: ps.provider.avatarUrl,
          },
        },
      });
    }

    console.log(`✅ Indexed ${providerServices.length} provider services`);

    // Buscar todos os contracted services com suas relações
    const contractedServices = await prisma.contractedService.findMany({
      include: {
        contractor: true,
        variant: {
          include: {
            providerService: {
              include: {
                service: true,
                provider: true,
              },
            },
          },
        },
      },
    });

    // Indexar contracted services
    for (const cs of contractedServices) {
      await esClient.index({
        index: 'contracted-services',
        id: cs.id,
        document: {
          id: cs.id,
          start: cs.start,
          end: cs.end,
          status: cs.status,
          totalPrice: cs.totalPrice,
          variant: {
            id: cs.variant.id,
            name: cs.variant.name,
            price: cs.variant.price,
            durationMinutes: cs.variant.durationMinutes,
            providerService: {
              id: cs.variant.providerService.id,
              description: cs.variant.providerService.description,
              service: {
                id: cs.variant.providerService.service.id,
                name: cs.variant.providerService.service.name,
              },
              provider: {
                id: cs.variant.providerService.provider.id,
                firstName: cs.variant.providerService.provider.firstName,
                lastName: cs.variant.providerService.provider.lastName,
                avatarUrl: cs.variant.providerService.provider.avatarUrl,
              },
            },
          },
          contractor: {
            id: cs.contractor.id,
            firstName: cs.contractor.firstName,
            lastName: cs.contractor.lastName,
            avatarUrl: cs.contractor.avatarUrl,
          },
        },
      });
    }

    console.log(`✅ Indexed ${contractedServices.length} contracted services`);
  } catch (error) {
    console.error('❌ Error seeding Elasticsearch:', error);
    throw error;
  }
}
