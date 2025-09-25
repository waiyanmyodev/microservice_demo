import { PrismaClient } from '@prisma/post-client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Post service database seeding...');

  const adminUserId = '4f62fd3b-4950-4c0a-ab3e-6963f094abb7';

  // Create sample posts
  const samplePosts = [
    {
      title: 'Welcome to Our Microservices Platform',
      content: 'This is a welcome post for new users. Here you can find information about our platform features and how to get started with our microservices architecture.',
      excerpt: 'Welcome post for new users with platform information',
      slug: 'welcome-to-our-microservices-platform',
      published: true,
      authorId: adminUserId,
      tags: ['welcome', 'microservices', 'platform'],
    },
    {
      title: 'Getting Started with NestJS Microservices',
      content: 'A comprehensive guide to help you get started with NestJS microservices. Learn about service communication, database patterns, and deployment strategies.',
      excerpt: 'Comprehensive NestJS microservices guide',
      slug: 'getting-started-with-nestjs-microservices',
      published: true,
      authorId: adminUserId,
      tags: ['guide', 'nestjs', 'tutorial'],
    },
    {
      title: 'Database Per Service Pattern',
      content: 'Learn about the database per service pattern in microservices architecture. This post covers benefits, challenges, and implementation strategies.',
      excerpt: 'Understanding database per service pattern',
      slug: 'database-per-service-pattern',
      published: true,
      authorId: adminUserId,
      tags: ['database', 'architecture', 'patterns'],
    },
    {
      title: 'Draft Post Example',
      content: 'This is an example of a draft post that hasnt been published yet. It demonstrates the draft functionality of our post management system.',
      excerpt: 'Example draft post for testing',
      slug: 'draft-post-example',
      published: false,
      authorId: adminUserId,
      tags: ['draft', 'example'],
    },
  ];

  for (const postData of samplePosts) {
    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: {
        ...postData,
        publishedAt: postData.published ? new Date() : null,
      },
    });

    // Create post event
    await prisma.postEvent.create({
      data: {
        postId: post.id,
        eventType: 'created',
        authorId: postData.authorId,
        eventData: {
          source: 'system_seed',
          published: postData.published,
        },
      },
    });

    if (postData.published) {
      await prisma.postEvent.create({
        data: {
          postId: post.id,
          eventType: 'published',
          authorId: postData.authorId,
          eventData: {
            publishedAt: post.publishedAt,
            source: 'system_seed',
          },
        },
      });
    }

    console.log(`📝 Created post: ${postData.title}`);
  }

  console.log('✅ Post service database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during post seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });