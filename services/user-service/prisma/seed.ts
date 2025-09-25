import { PrismaClient } from '@prisma/user-client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting User service database seeding...');

  // Create admin user profile
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: '4f62fd3b-4950-4c0a-ab3e-6963f094abb7', // Use same ID as auth service
      email: 'admin@example.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      bio: 'System administrator and content manager',
      location: 'San Francisco, CA',
      website: 'https://admin.example.com',
      isActive: true,
    },
  });

  console.log('👤 Created admin user profile:', { id: adminUser.id, email: adminUser.email });

  // Create user events
  await prisma.userEvent.create({
    data: {
      userId: adminUser.id,
      eventType: 'created',
      eventData: {
        source: 'system_seed',
        createdBy: 'admin',
      },
    },
  });

  // Create test user profiles
  const testUsers = [];
  for (let i = 1; i <= 5; i++) {
    const userId = `test-user-${i}-uuid-${Date.now()}`;
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        id: userId,
        email: `user${i}@example.com`,
        username: `user${i}`,
        firstName: `Test User`,
        lastName: `${i}`,
        bio: `I am test user number ${i}. I love testing microservices!`,
        location: `Test City ${i}`,
        isActive: true,
      },
    });

    // Create user event
    await prisma.userEvent.create({
      data: {
        userId: user.id,
        eventType: 'created',
        eventData: {
          source: 'system_seed',
          userNumber: i,
        },
      },
    });

    testUsers.push(user);
  }

  console.log(`👥 Created ${testUsers.length} test user profiles`);
  console.log('✅ User service database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during user seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });