import { PrismaClient } from '@prisma/client';

export async function seedSchedules(prisma: PrismaClient) {
  console.log('🌱 Seeding Schedules...');

  // Helper para criar horários
  const createTime = (hours: number, minutes: number = 0): Date => {
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Horários do João Silva (Pintor) - Segunda a Sexta, 8h às 18h
  const joaoSchedules = [0, 1, 2, 3, 4].map((weekday, index) => ({
    id: `a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5${index}`,
    weekday,
    start: createTime(8, 0),
    end: createTime(18, 0),
    providerServiceId: 'b3cce24b-7cb3-4977-a73d-7a9616b9fa6a',
  }));

  // Horários da Maria Santos (Eletricista) - Segunda a Sábado, 7h às 17h
  const mariaSchedules = [0, 1, 2, 3, 4, 5].map((weekday, index) => ({
    id: `b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6${index}`,
    weekday,
    start: createTime(7, 0),
    end: createTime(17, 0),
    providerServiceId: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
  }));

  // Horários do Pedro Oliveira (Encanador) - Todos os dias, 24h (emergência)
  const pedroSchedules = [0, 1, 2, 3, 4, 5, 6].map((weekday, index) => ({
    id: `c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7${index}`,
    weekday,
    start: createTime(0, 0),
    end: createTime(23, 59),
    providerServiceId: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
  }));

  // Horários da Ana Costa (Pedreiro) - Segunda a Sexta, 7h às 16h
  const anaSchedules = [0, 1, 2, 3, 4].map((weekday, index) => ({
    id: `d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8${index}`,
    weekday,
    start: createTime(7, 0),
    end: createTime(16, 0),
    providerServiceId: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
  }));

  // Horários do Carlos Ferreira (Marceneiro) - Terça a Sábado, 9h às 19h
  const carlosSchedules = [1, 2, 3, 4, 5].map((weekday, index) => ({
    id: `e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9${index}`,
    weekday,
    start: createTime(9, 0),
    end: createTime(19, 0),
    providerServiceId: '4d5e6f7a-8b9c-4d0e-1f2a-3b4c5d6e7f8a',
  }));

  const allSchedules = [
    ...joaoSchedules,
    ...mariaSchedules,
    ...pedroSchedules,
    ...anaSchedules,
    ...carlosSchedules,
  ];

  const schedules = await prisma.schedule.createMany({
    data: allSchedules,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${schedules.count} schedules`);
}
