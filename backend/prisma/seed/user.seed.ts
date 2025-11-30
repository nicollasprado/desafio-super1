import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  console.log('🌱 Seeding Users...');

  const hashedPassword = await bcrypt.hash('senha123', 10);

  const users = await prisma.user.createMany({
    data: [
      {
        id: '5d0de8ee-feda-47de-be91-cd14df10dc2b',
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao.silva@email.com',
        password: hashedPassword,
        phone: '11987654321',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
      },
      {
        id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@email.com',
        password: hashedPassword,
        phone: '11987654322',
        avatarUrl: 'https://i.pravatar.cc/150?img=47',
      },
      {
        id: 'f6e5d4c3-b2a1-4d5e-9f8a-7b6c5d4e3f2a',
        firstName: 'Pedro',
        lastName: 'Oliveira',
        email: 'pedro.oliveira@email.com',
        password: hashedPassword,
        phone: '11987654323',
        avatarUrl: 'https://i.pravatar.cc/150?img=33',
      },
      {
        id: 'c9d8e7f6-a5b4-4c3d-2e1f-0a9b8c7d6e5f',
        firstName: 'Ana',
        lastName: 'Costa',
        email: 'ana.costa@email.com',
        password: hashedPassword,
        phone: '11987654324',
        avatarUrl: 'https://i.pravatar.cc/150?img=25',
      },
      {
        id: 'b8c7d6e5-f4a3-4b2c-1d0e-9f8a7b6c5d4e',
        firstName: 'Carlos',
        lastName: 'Ferreira',
        email: 'carlos.ferreira@email.com',
        password: hashedPassword,
        phone: '11987654325',
        avatarUrl: 'https://i.pravatar.cc/150?img=68',
      },
      // Usuários adicionais apenas como clientes (para contracted services)
      {
        id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
        firstName: 'Lucas',
        lastName: 'Mendes',
        email: 'lucas.mendes@email.com',
        password: hashedPassword,
        phone: '11987654326',
        avatarUrl: 'https://i.pravatar.cc/150?img=51',
      },
      {
        id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
        firstName: 'Juliana',
        lastName: 'Rocha',
        email: 'juliana.rocha@email.com',
        password: hashedPassword,
        phone: '11987654327',
        avatarUrl: 'https://i.pravatar.cc/150?img=32',
      },
      {
        id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
        firstName: 'Rafael',
        lastName: 'Almeida',
        email: 'rafael.almeida@email.com',
        password: hashedPassword,
        phone: '11987654328',
        avatarUrl: 'https://i.pravatar.cc/150?img=15',
      },
      {
        id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
        firstName: 'Fernanda',
        lastName: 'Lima',
        email: 'fernanda.lima@email.com',
        password: hashedPassword,
        phone: '11987654329',
        avatarUrl: 'https://i.pravatar.cc/150?img=44',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created ${users.count} users`);
}
