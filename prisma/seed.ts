import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Create types first
  console.log('Creating types...');

  const transportation = await prisma.type.upsert({
    where: { slug: 'transportation' },
    update: {},
    create: {
      name: 'Di chuyển',
      slug: 'transportation',
      description: 'Apps related to transportation and mobility'
    }
  });

  const finance = await prisma.type.upsert({
    where: { slug: 'finance' },
    update: {},
    create: {
      name: 'Tài chính',
      slug: 'finance',
      description: 'Financial and banking apps'
    }
  });

  const entertainment = await prisma.type.upsert({
    where: { slug: 'entertainment' },
    update: {},
    create: {
      name: 'Giải trí',
      slug: 'entertainment',
      description: 'Entertainment and media apps'
    }
  });

  const lifestyle = await prisma.type.upsert({
    where: { slug: 'lifestyle' },
    update: {},
    create: {
      name: 'Đời sống',
      slug: 'lifestyle',
      description: 'Lifestyle and daily living apps'
    }
  });

  const productivity = await prisma.type.upsert({
    where: { slug: 'productivity' },
    update: {},
    create: {
      name: 'Hiệu suất',
      slug: 'productivity',
      description: 'Productivity and work apps'
    }
  });

  console.log('Types created successfully');

  // Create sample apps with types
  const instagram = await prisma.app.upsert({
    where: { slug: 'instagram' },
    update: {
      // Update existing Instagram with types if it doesn't have them
      appTypes: {
        deleteMany: {}, // Clear existing
        create: [{ typeId: entertainment.id }, { typeId: lifestyle.id }]
      }
    },
    create: {
      name: 'Instagram',
      description: 'Photo and video sharing social networking service',
      slug: 'instagram',
      category: 'Social',
      platform: 'IOS',
      brandColor: '#E4405F',
      screens: {
        create: [
          {
            title: 'Feed Screen',
            imageUrl: 'https://example.com/instagram-feed.png',
            screenType: 'Home',
            tags: ['feed', 'infinite-scroll', 'stories']
          },
          {
            title: 'Profile Screen',
            imageUrl: 'https://example.com/instagram-profile.png',
            screenType: 'Profile',
            tags: ['profile', 'grid', 'bio']
          }
        ]
      },
      appTypes: {
        create: [{ typeId: entertainment.id }, { typeId: lifestyle.id }]
      }
    }
  });

  // Create more sample apps for testing
  const grab = await prisma.app.upsert({
    where: { slug: 'grab' },
    update: {
      appTypes: {
        deleteMany: {},
        create: [{ typeId: transportation.id }]
      }
    },
    create: {
      name: 'Grab',
      description: 'Ride-hailing and delivery service',
      slug: 'grab',
      category: 'Transportation',
      platform: 'IOS',
      brandColor: '#00B14F',
      appTypes: {
        create: [{ typeId: transportation.id }]
      }
    }
  });

  const momo = await prisma.app.upsert({
    where: { slug: 'momo' },
    update: {
      appTypes: {
        deleteMany: {},
        create: [{ typeId: finance.id }]
      }
    },
    create: {
      name: 'MoMo',
      description: 'Mobile payment and digital wallet',
      slug: 'momo',
      category: 'Finance',
      platform: 'IOS',
      brandColor: '#D82D8B',
      appTypes: {
        create: [{ typeId: finance.id }]
      }
    }
  });

  const shopee = await prisma.app.upsert({
    where: { slug: 'shopee' },
    update: {
      appTypes: {
        deleteMany: {},
        create: [{ typeId: lifestyle.id }, { typeId: entertainment.id }]
      }
    },
    create: {
      name: 'Shopee',
      description: 'Online shopping platform',
      slug: 'shopee',
      category: 'E-commerce',
      platform: 'IOS',
      brandColor: '#EE4D2D',
      appTypes: {
        create: [{ typeId: lifestyle.id }, { typeId: entertainment.id }]
      }
    }
  });

  const notion = await prisma.app.upsert({
    where: { slug: 'notion' },
    update: {
      appTypes: {
        deleteMany: {},
        create: [{ typeId: productivity.id }]
      }
    },
    create: {
      name: 'Notion',
      description: 'All-in-one workspace for notes and collaboration',
      slug: 'notion',
      category: 'Productivity',
      platform: 'IOS',
      brandColor: '#000000',
      appTypes: {
        create: [{ typeId: productivity.id }]
      }
    }
  });

  const zalo = await prisma.app.upsert({
    where: { slug: 'zalo' },
    update: {
      appTypes: {
        deleteMany: {},
        create: [{ typeId: lifestyle.id }, { typeId: entertainment.id }]
      }
    },
    create: {
      name: 'Zalo',
      description: 'Messaging and social networking app',
      slug: 'zalo',
      category: 'Social',
      platform: 'IOS',
      brandColor: '#0068FF',
      appTypes: {
        create: [{ typeId: lifestyle.id }, { typeId: entertainment.id }]
      }
    }
  });

  console.log({
    created: { instagram, grab, momo, shopee, notion, zalo },
    types: { transportation, finance, entertainment, lifestyle, productivity }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
