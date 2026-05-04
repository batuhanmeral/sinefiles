import { PrismaClient, Role, ListType, Visibility } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sinefiles.dev' },
    update: {},
    create: {
      email: 'admin@sinefiles.dev',
      username: 'admin',
      passwordHash: adminPassword,
      displayName: 'Admin',
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  const userPassword = await bcrypt.hash('user1234', 10);
  const demo = await prisma.user.upsert({
    where: { email: 'demo@sinefiles.dev' },
    update: {},
    create: {
      email: 'demo@sinefiles.dev',
      username: 'demo',
      passwordHash: userPassword,
      displayName: 'Demo Kullanıcı',
      emailVerified: true,
    },
  });

  for (const type of [ListType.WATCHED, ListType.WATCHLIST, ListType.FAVORITES] as const) {
    await prisma.list.upsert({
      where: { id: `${demo.id}-${type}` },
      update: {},
      create: {
        id: `${demo.id}-${type}`,
        userId: demo.id,
        type,
        title: type,
        visibility: Visibility.PRIVATE,
      },
    });
  }

  console.warn(`Seed tamam · admin: ${admin.email} · demo: ${demo.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
