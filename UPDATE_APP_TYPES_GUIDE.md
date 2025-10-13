# Hướng dẫn Update AppTypes cho Apps

## ✅ Seed đã update tất cả apps!

Khi bạn chạy `npm run db:seed`, nó đã:
- ✅ Tạo/Update 6 sample apps
- ✅ Gán types cho tất cả apps
- ✅ Sử dụng `upsert` với `update` block để update existing apps

## 📊 Apps hiện tại trong DB:

| App | Types | Category |
|-----|-------|----------|
| Instagram | Giải trí, Đời sống | Social |
| Grab | Di chuyển | Transportation |
| MoMo | Tài chính | Finance |
| Shopee | Đời sống, Giải trí | E-commerce |
| Notion | Hiệu suất | Productivity |
| Zalo | Đời sống, Giải trí | Social |

## 🔧 3 Cách Update App Types

### Option 1: Re-run Seed (Recommended)
```bash
npm run db:seed
```
**Khi nào dùng**: Update toàn bộ apps một lần

**Ưu điểm**:
- ✅ Đơn giản nhất
- ✅ Update tất cả apps
- ✅ Idempotent (chạy nhiều lần vẫn OK)

**Seed file đã được config để**:
- `deleteMany: {}` - Xóa existing types
- `create: [...]` - Thêm types mới
- Works cho cả apps đã tồn tại

---

### Option 2: Prisma Studio (GUI)
```bash
npm run db:studio
```

**Steps:**
1. Mở Prisma Studio (browser sẽ tự mở)
2. Click vào **AppType** table
3. Click **Add record**
4. Chọn **appId** và **typeId**
5. Save

**Khi nào dùng**: Update 1-2 apps manually

---

### Option 3: Custom Script (For existing apps)

Tạo file `scripts/update-app-types.ts`:

```typescript
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

async function updateAppTypes() {
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
    }
  });

  console.log(`Found ${appsWithoutTypes.length} apps without types`);

  // Get all types
  const types = await prisma.type.findMany();
  const typeMap = new Map(types.map(t => [t.slug, t.id]));

  // Auto-assign types based on category
  for (const app of appsWithoutTypes) {
    const appTypes: string[] = [];

    // Map categories to types
    switch (app.category?.toLowerCase()) {
      case 'social':
        appTypes.push(typeMap.get('lifestyle')!, typeMap.get('entertainment')!);
        break;
      case 'finance':
        appTypes.push(typeMap.get('finance')!);
        break;
      case 'transportation':
        appTypes.push(typeMap.get('transportation')!);
        break;
      case 'productivity':
        appTypes.push(typeMap.get('productivity')!);
        break;
      case 'e-commerce':
        appTypes.push(typeMap.get('lifestyle')!, typeMap.get('entertainment')!);
        break;
      default:
        appTypes.push(typeMap.get('lifestyle')!);
    }

    // Create AppType records
    await prisma.appType.createMany({
      data: appTypes.filter(Boolean).map(typeId => ({
        appId: app.id,
        typeId: typeId,
      })),
      skipDuplicates: true,
    });

    console.log(`✓ Updated ${app.name} with ${appTypes.length} types`);
  }

  console.log('✅ All apps updated!');
}

updateAppTypes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Run:**
```bash
npx tsx scripts/update-app-types.ts
```

**Khi nào dùng**: Có nhiều apps cũ cần update

---

### Option 4: SQL Query (Advanced)

```sql
-- Xem apps không có types
SELECT a.id, a.name, a.category
FROM "App" a
LEFT JOIN "AppType" at ON a.id = at."appId"
WHERE at.id IS NULL;

-- Manually insert AppType
INSERT INTO "AppType" ("id", "appId", "typeId", "createdAt")
VALUES (
  gen_random_uuid(),
  'app-id-here',
  'type-id-here',
  NOW()
);
```

**Khi nào dùng**: Khi bạn quen SQL và muốn control chính xác

---

## 🎯 Recommended Workflow

### For Sample/Test Data:
```bash
npm run db:seed
```

### For Production Data:
1. Tạo script update-app-types.ts
2. Review logic mapping category → types
3. Test trên dev database trước
4. Run trên production

---

## 🧪 Verify Apps Have Types

### Check in Prisma Studio:
```bash
npm run db:studio
```
Then:
1. Click **AppType** table
2. See all app-type relationships

### Check in Code:
```typescript
const apps = await prisma.app.findMany({
  include: {
    appTypes: {
      include: {
        type: true
      }
    }
  }
});

console.log(apps[0].appTypes); // Should have types array
```

### Via API:
```bash
# Test the filter
curl http://localhost:3002/vi
# Click tabs → Should filter apps
```

---

## 📝 Example: Manual Update

If you have an existing app and want to add types:

```typescript
// Option A: Using upsert (like seed)
await prisma.app.update({
  where: { slug: 'your-app-slug' },
  data: {
    appTypes: {
      deleteMany: {}, // Clear existing
      create: [
        { typeId: 'type-id-1' },
        { typeId: 'type-id-2' },
      ]
    }
  }
});

// Option B: Just add new types (keep existing)
await prisma.app.update({
  where: { slug: 'your-app-slug' },
  data: {
    appTypes: {
      create: [
        { typeId: 'new-type-id' }
      ]
    }
  }
});

// Option C: Remove specific type
await prisma.appType.delete({
  where: {
    appId_typeId: {
      appId: 'app-id',
      typeId: 'type-id'
    }
  }
});
```

---

## ✅ Current Status

After running seed:
- ✅ 6 apps created/updated
- ✅ All apps have types assigned
- ✅ Types table has 5 types
- ✅ AppType junction table populated
- ✅ Ready to test filter functionality!

---

**Quick Test:**
Visit http://localhost:3002/vi and click tabs → Apps should filter! 🎉


