import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

// Prisma için log seviyesi
const prismaLogLevels =
  env.NODE_ENV === 'development' ? (['warn', 'error'] as const) : (['error'] as const);

// Prisma veritabanı istemcisi örneği
export const prisma = new PrismaClient({
  log: [...prismaLogLevels],
});

// Veritabanı bağlantısını güvenli bir şekilde kapatır
export async function disconnectDb() {
  await prisma.$disconnect();
}
