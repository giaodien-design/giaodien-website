import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // ============================================
  // Seed ScreenTypes
  // ============================================
  const screenTypes = [
    { name: 'Login', slug: 'login' },
    { name: 'Register', slug: 'register' },
    { name: 'OTP', slug: 'otp' },
    { name: 'Home', slug: 'home' },
    { name: 'Profile', slug: 'profile' },
  ];

  console.log('Seeding ScreenTypes...');

  for (const screenType of screenTypes) {
    await prisma.screenType.upsert({
      where: { slug: screenType.slug },
      update: { name: screenType.name },
      create: screenType,
    });
    console.log(`✓ Upserted ScreenType: ${screenType.name}`);
  }

  console.log('\n✅ Finished seeding ScreenTypes!\n');

  // ============================================
  // Seed UIElements
  // ============================================
  const uiElements = [
    { name: 'Button', slug: 'button' },
    { name: 'Input', slug: 'input' },
    { name: 'Modal', slug: 'modal' },
    { name: 'Tab Bar', slug: 'tab-bar' },
    { name: 'Toggle', slug: 'toggle' },
  ];

  console.log('Seeding UIElements...');

  for (const uiElement of uiElements) {
    await prisma.uIElement.upsert({
      where: { slug: uiElement.slug },
      update: { name: uiElement.name },
      create: uiElement,
    });
    console.log(`✓ Upserted UIElement: ${uiElement.name}`);
  }

  console.log('\n✅ Finished seeding UIElements!\n');

  // ============================================
  // Seed User Flows
  // ============================================
  // Standard User Flows to seed
  const flows = [
    {
      name: 'Onboarding',
      slug: 'onboarding',
      sortOrder: 10,
      description: 'User onboarding and first-time experience flows'
    },
    {
      name: 'Authentication',
      slug: 'authentication',
      sortOrder: 20,
      description: 'Login, signup, and authentication screens'
    },
    {
      name: 'OTP Verification',
      slug: 'otp',
      sortOrder: 25,
      description: 'OTP and verification code entry screens'
    },
    {
      name: 'Home',
      slug: 'home',
      sortOrder: 30,
      description: 'Main home screen and dashboard views'
    },
    {
      name: 'Search',
      slug: 'search',
      sortOrder: 40,
      description: 'Search functionality and results screens'
    },
    {
      name: 'Order Tracking',
      slug: 'tracking',
      sortOrder: 70,
      description: 'Order status and tracking screens'
    },
    {
      name: 'Payment',
      slug: 'qr-scan',
      sortOrder: 80,
      description: 'Payment and QR code scanning screens'
    },
    {
      name: 'eKYC & Verification',
      slug: 'ekyc',
      sortOrder: 90,
      description: 'Electronic Know Your Customer and identity verification'
    },
    {
      name: 'Loyalty',
      slug: 'loyalty',
      sortOrder: 100,
      description: 'Loyalty programs and rewards screens'
    },
    {
      name: 'Profile',
      slug: 'profile',
      sortOrder: 110,
      description: 'User profile and settings screens'
    }
  ];

  console.log('Seeding standard User Flows...');

  // Loop through flows and upsert them
  for (const flow of flows) {
    // Check if flow exists by name
    const existingFlow = await prisma.flow.findFirst({
      where: { name: flow.name }
    });

    if (existingFlow) {
      // Update existing flow
      await prisma.flow.update({
        where: { id: existingFlow.id },
        data: {
          description: flow.description,
          sortOrder: flow.sortOrder
        }
      });
      console.log(`✓ Updated flow: ${flow.name}`);
    } else {
      // Create new flow
      await prisma.flow.create({
        data: {
          name: flow.name,
          description: flow.description,
          sortOrder: flow.sortOrder
        }
      });
      console.log(`✓ Created flow: ${flow.name}`);
    }
  }

  console.log('\n✅ Finished seeding User Flows!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
