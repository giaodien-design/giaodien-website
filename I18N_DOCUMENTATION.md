# i18n (Internationalization) Documentation

This project uses `next-intl` for internationalization support. This document explains the implementation and how to use it.

## 🌍 Supported Languages

- **Vietnamese (vi)** - Default language
- **English (en)**

## 📁 Project Structure

```
/Users/khangtna/giaodien-website/
├── messages/                      # Translation files
│   ├── vi.json                   # Vietnamese translations
│   └── en.json                   # English translations
├── src/
│   ├── app/
│   │   └── [locale]/             # Locale-based routing
│   │       ├── layout.tsx        # Locale-aware layout
│   │       ├── page.tsx          # Home page
│   │       └── test/
│   │           └── page.tsx      # Test page for translations
│   ├── components/
│   │   ├── LanguageSwitcher.tsx  # Language switcher component
│   │   ├── Header.tsx            # Translated header
│   │   ├── HeroSection.tsx       # Translated hero section
│   │   ├── CategoryNavigation.tsx # Translated categories
│   │   ├── MobileAppGrid.tsx     # Translated app grid
│   │   └── Footer.tsx            # Translated footer
│   ├── i18n/
│   │   ├── request.ts            # i18n request configuration
│   │   └── routing.ts            # Routing configuration
│   └── middleware.ts             # Locale detection middleware
└── next.config.ts                # Next.js config with i18n plugin
```

## 🚀 How It Works

### 1. Middleware
The middleware (`src/middleware.ts`) automatically:
- Detects the user's preferred language from browser settings
- Redirects to the appropriate locale route
- Handles locale switching

### 2. Routing
All pages are under `[locale]` dynamic segment:
- `/` → redirects to `/vi` or `/en` based on browser preference
- `/vi` → Vietnamese version
- `/en` → English version
- `/vi/test` → Vietnamese test page
- `/en/test` → English test page

### 3. Translation Files
Translation files are located in the `messages/` directory:
- `messages/vi.json` - Vietnamese translations
- `messages/en.json` - English translations

### 4. Language Switcher
The `LanguageSwitcher` component allows users to manually switch between languages. It's integrated into the Header component.

## 📝 How to Use Translations

### In Client Components

Use the `useTranslations` hook:

```tsx
'use client'

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('namespace');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### In Server Components

Use the `getTranslations` function:

```tsx
import { getTranslations } from 'next-intl/server';

export async function MyServerComponent() {
  const t = await getTranslations('namespace');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### In Metadata

```tsx
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}
```

## 📚 Translation Structure

The translation files follow this structure:

```json
{
  "header": {
    "search": "Search",
    "login": "Login"
  },
  "hero": {
    "title": "Title text",
    "subtitle": "Subtitle text"
  },
  "categories": {
    "primaryTabs": {
      "app": "Application",
      "screen": "Screen type"
    },
    "secondaryTabs": {
      "transportation": "Transportation",
      "finance": "Finance",
      "entertainment": "Entertainment",
      "lifestyle": "Lifestyle",
      "productivity": "Productivity"
    }
  },
  "apps": {
    "noData": "No app data available",
    "mobileApp": "Mobile application",
    "screenshot": "screenshot"
  },
  "footer": {
    "link": "Link",
    "copyright": "copyright @giaodien.website"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "noResults": "No results"
  },
  "metadata": {
    "title": "Page title",
    "description": "Page description"
  }
}
```

## ➕ Adding New Translations

1. **Add the translation key to both language files:**

```json
// messages/vi.json
{
  "newSection": {
    "newKey": "Văn bản tiếng Việt"
  }
}

// messages/en.json
{
  "newSection": {
    "newKey": "English text"
  }
}
```

2. **Use the translation in your component:**

```tsx
const t = useTranslations('newSection');
return <p>{t('newKey')}</p>;
```

## 🌐 Adding a New Language

1. **Add the locale to routing configuration** (`src/i18n/routing.ts`):

```typescript
export const routing = defineRouting({
  locales: ['vi', 'en', 'fr'], // Add new locale here
  defaultLocale: 'vi',
});
```

2. **Update middleware matcher** (`src/middleware.ts`):

```typescript
export const config = {
  matcher: ['/', '/(vi|en|fr)/:path*'] // Add new locale here
};
```

3. **Create new translation file** (`messages/fr.json`):

```json
{
  "header": {
    "search": "Rechercher",
    "login": "Connexion"
  },
  // ... other translations
}
```

4. **Update LanguageSwitcher component** (`src/components/LanguageSwitcher.tsx`):

```typescript
const languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }, // Add new language
];
```

## 🔗 Navigation with i18n

Use the custom navigation utilities from `@/i18n/routing` instead of Next.js native ones:

```tsx
import { Link, useRouter, usePathname } from '@/i18n/routing';

// Link component
<Link href="/about">About</Link>

// Router
const router = useRouter();
router.push('/about');

// Pathname (returns pathname without locale)
const pathname = usePathname();
```

## ⚙️ Configuration Files

### next.config.ts
The Next.js config includes the next-intl plugin:

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
```

### src/i18n/request.ts
Configures how messages are loaded:

```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

### src/i18n/routing.ts
Defines routing behavior:

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localeDetection: true,
});
```

## 🧪 Testing

Visit `/vi/test` or `/en/test` to see a test page that displays all translations.

## 📖 Best Practices

1. **Always use translation keys** - Never hardcode text in components
2. **Organize translations logically** - Use namespaces (e.g., 'header', 'footer', 'common')
3. **Keep translations in sync** - Ensure all language files have the same keys
4. **Use TypeScript** - The setup provides type-safe translations
5. **Test in all languages** - Always verify translations work correctly
6. **Use semantic keys** - Name keys based on meaning, not appearance (e.g., 'confirmButton' not 'greenButton')

## 🔍 Troubleshooting

### Translations not showing
- Check that the translation key exists in all language files
- Verify the namespace is correct
- Check the console for any errors

### Language not switching
- Clear browser cache
- Check that the locale is included in the routing configuration
- Verify the middleware is working correctly

### Build errors
- Ensure all translation files are valid JSON
- Check that all referenced namespaces exist
- Verify import paths are correct

## 📚 Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU Message Format](https://formatjs.io/docs/core-concepts/icu-syntax/)

## 🎯 Summary

The i18n implementation in this project provides:
- ✅ Automatic locale detection
- ✅ URL-based routing (`/vi`, `/en`)
- ✅ Language switcher UI
- ✅ Type-safe translations
- ✅ Support for both client and server components
- ✅ Metadata localization
- ✅ Easy to add new languages
- ✅ Production-ready configuration

