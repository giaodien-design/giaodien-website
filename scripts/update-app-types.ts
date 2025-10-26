import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

async function updateAppTypes() {
  console.log("🔍 Finding apps without types...\n");

  // Get all apps without types
  const appsWithoutTypes = await prisma.app.findMany({
    where: {
      appTypes: {
        none: {}
      }
    },
    select: {
      id: true,
      name: true,
      category: true,
      slug: true,
    }
  });

  console.log(`📊 Found ${appsWithoutTypes.length} apps without types\n`);

  if (appsWithoutTypes.length === 0) {
    console.log("✅ All apps already have types assigned!");
    return;
  }

  // Get all types
  const types = await prisma.type.findMany();
  const typeMap = new Map(types.map(t => [t.slug, t.id]));

  console.log("📝 Available types:");
  types.forEach(t => console.log(`  - ${t.name} (${t.slug})`));
  console.log("");

  // Auto-assign types based on category
  for (const app of appsWithoutTypes) {
    const appTypes: string[] = [];

    // Map categories to types (you can customize this logic)
    const category = app.category?.toLowerCase();
    
    if (category?.includes('social')) {
      appTypes.push(typeMap.get('lifestyle')!, typeMap.get('entertainment')!);
    } else if (category?.includes('finance') || category?.includes('banking')) {
      appTypes.push(typeMap.get('finance')!);
    } else if (category?.includes('transport') || category?.includes('ride') || category?.includes('delivery')) {
      appTypes.push(typeMap.get('transportation')!);
    } else if (category?.includes('product') || category?.includes('work') || category?.includes('note')) {
      appTypes.push(typeMap.get('productivity')!);
    } else if (category?.includes('commerce') || category?.includes('shop')) {
      appTypes.push(typeMap.get('lifestyle')!, typeMap.get('entertainment')!);
    } else if (category?.includes('entertain') || category?.includes('media') || category?.includes('video')) {
      appTypes.push(typeMap.get('entertainment')!);
    } else {
      // Default: assign lifestyle
      appTypes.push(typeMap.get('lifestyle')!);
    }

    // Filter out undefined values
    const validTypes = appTypes.filter(Boolean);

    if (validTypes.length > 0) {
      // Create AppType records
      await prisma.appType.createMany({
        data: validTypes.map(typeId => ({
          appId: app.id,
          typeId: typeId,
        })),
        skipDuplicates: true,
      });

      console.log(`✓ Updated "${app.name}" (${app.category}) with ${validTypes.length} type(s)`);
    } else {
      console.log(`⚠ Skipped "${app.name}" - couldn't determine types`);
    }
  }

  console.log('\n✅ All apps updated!');
  
  // Show summary
  const totalApps = await prisma.app.count();
  const appsWithTypes = await prisma.app.count({
    where: {
      appTypes: {
        some: {}
      }
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`  Total apps: ${totalApps}`);
  console.log(`  Apps with types: ${appsWithTypes}`);
  console.log(`  Apps without types: ${totalApps - appsWithTypes}`);
}

updateAppTypes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());


