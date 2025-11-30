import { PrismaClient } from '@prisma/client';
import { SERVICE_STATUS } from './constants';

export async function seedContractedServices(prisma: PrismaClient) {
  console.log('🌱 Seeding Contracted Services...');

  // Helper para criar datas
  const createDateTime = (
    daysFromNow: number,
    hours: number,
    minutes: number = 0,
  ): Date => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const contractedServices = await prisma.contractedService.createMany({
    data: [
      // Lucas Mendes comprando pintura básica do João Silva - Agendado para daqui 3 dias
      {
        id: 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
        status: SERVICE_STATUS.SCHEDULED,
        totalPrice: 2000, // R$ 20,00
        contractorId: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', // Lucas Mendes
        variantId: '4c0d7209-0438-433d-b74a-b595c82654e6', // Pintura Básica
        start: createDateTime(3, 10, 0),
        end: createDateTime(3, 11, 0),
      },

      // Juliana Rocha comprando eletricista - Aguardando confirmação
      {
        id: 'a2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d',
        status: SERVICE_STATUS.WAITING_CONFIRMATION,
        totalPrice: 15000, // R$ 150,00
        contractorId: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', // Juliana Rocha
        variantId: '6b7c8d9e-0f1a-4b2c-3d4e-5f6a7b8c9d0e', // Manutenção Elétrica
        start: createDateTime(5, 14, 0),
        end: createDateTime(5, 15, 0),
      },

      // Rafael Almeida comprando encanamento - Em andamento
      {
        id: 'b3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e',
        status: SERVICE_STATUS.ONGOING,
        totalPrice: 12000, // R$ 120,00
        contractorId: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', // Rafael Almeida
        variantId: '8d9e0f1a-2b3c-4d4e-5f6a-7b8c9d0e1f2a', // Desentupimento
        start: createDateTime(0, 9, 0),
        end: createDateTime(0, 9, 45),
      },

      // Fernanda Lima comprando marcenaria - Finalizado
      {
        id: 'c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f',
        status: SERVICE_STATUS.FINISHED,
        totalPrice: 80000, // R$ 800,00
        contractorId: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', // Fernanda Lima
        variantId: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6f', // Móvel Simples
        start: createDateTime(-5, 10, 0),
        end: createDateTime(-5, 13, 0),
      },

      // Lucas Mendes comprando pedreiro - Pagamento pendente
      {
        id: 'd5e6f7a8-b9c0-4d1e-2f3a-4b5c6d7e8f9a',
        status: SERVICE_STATUS.PAYMENT_PENDING,
        totalPrice: 50000, // R$ 500,00
        contractorId: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', // Lucas Mendes
        variantId: '0f1a2b3c-4d5e-4f6a-7b8c-9d0e1f2a3b4c', // Reforma Pequena
        start: createDateTime(7, 8, 0),
        end: createDateTime(7, 12, 0),
      },

      // Rafael Almeida comprando pintura premium - Agendado
      {
        id: 'e6f7a8b9-c0d1-4e2f-3a4b-5c6d7e8f9a0b',
        status: SERVICE_STATUS.SCHEDULED,
        totalPrice: 3000, // R$ 30,00
        contractorId: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', // Rafael Almeida
        variantId: 'd6f9a4f1-87a2-43e4-a2f8-0e0aea86695e', // Pintura Premium
        start: createDateTime(2, 14, 0),
        end: createDateTime(2, 15, 30),
      },

      // Juliana Rocha comprando instalação elétrica completa - Agendado
      {
        id: 'f7a8b9c0-d1e2-4f3a-4b5c-6d7e8f9a0b1c',
        status: SERVICE_STATUS.SCHEDULED,
        totalPrice: 25000, // R$ 250,00
        contractorId: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', // Juliana Rocha
        variantId: '7c8d9e0f-1a2b-4c3d-4e5f-6a7b8c9d0e1f', // Instalação Elétrica
        start: createDateTime(4, 9, 0),
        end: createDateTime(4, 11, 0),
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${contractedServices.count} contracted services`);
}
