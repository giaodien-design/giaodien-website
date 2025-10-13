# URL Routing Guide with i18n

## 🌐 How URL Routing Works

With i18n implemented, your URLs now include a locale prefix for each language.

## URL Structure

```
Before i18n:
  /                 → Home page
  /test             → Test page

After i18n:
  /                 → Redirects to /vi or /en (based on browser)
  /vi               → Vietnamese home page
  /en               → English home page
  /vi/test          → Vietnamese test page
  /en/test          → English test page
```

## Examples

### Home Page
```
Vietnamese: http://localhost:3000/vi
English:    http://localhost:3000/en
```

### Test Page
```
Vietnamese: http://localhost:3000/vi/test
English:    http://localhost:3000/en/test
```

### Future Pages
```
About Page:
  Vietnamese: http://localhost:3000/vi/about
  English:    http://localhost:3000/en/about

Contact Page:
  Vietnamese: http://localhost:3000/vi/contact
  English:    http://localhost:3000/en/contact
```

## Automatic Redirect

When users visit the root URL (`/`), they are automatically redirected to their preferred language:

1. User visits: `http://localhost:3000/`
2. Middleware detects browser language
3. If browser is set to Vietnamese → redirect to `/vi`
4. If browser is set to English → redirect to `/en`
5. Default (if not detected) → redirect to `/vi` (Vietnamese)

## Language Switching

When users click the language switcher:
- Current page: `/vi/about`
- After switching to English: `/en/about`
- The same page path is preserved, only the locale changes

## SEO Benefits

Each language has its own URL, which means:
- ✅ Search engines can index each language separately
- ✅ Users can bookmark language-specific pages
- ✅ Language-specific URLs can be shared
- ✅ Better ranking in local search results

## Implementation Notes

- All pages must be under the `[locale]` folder
- The middleware handles locale detection and routing
- Navigation between pages preserves the current locale
- Use the custom Link, router, and pathname from `@/i18n/routing`

## Quick Reference

```typescript
// ❌ DON'T use Next.js native navigation
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ✅ DO use i18n-aware navigation
import { Link, useRouter } from '@/i18n/routing'
```

This ensures that all navigation respects the current locale!

