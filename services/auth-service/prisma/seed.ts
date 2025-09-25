import { PrismaClient } from '@prisma/auth-client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Auth service database seeding...');

  // Create admin user for authentication
  const hashedPassword = await bcrypt.hash('password123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
    },
  });

  console.log('👤 Created admin user for auth:', { id: adminUser.id, email: adminUser.email });

  // Create test users for authentication
  const testUsers = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        username: `user${i}`,
        password: hashedPassword,
        firstName: `User`,
        lastName: `${i}`,
        isActive: true,
      },
    });
    testUsers.push(user);
  }

  console.log(`👥 Created ${testUsers.length} test users for auth`);
  console.log('✅ Auth service database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during auth seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });