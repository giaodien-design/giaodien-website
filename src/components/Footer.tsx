import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer');
  
  return (
    <footer className="flex gap-4 items-center justify-center px-5 py-4 w-full">
      <p className="text-gd-cream/60 text-sm font-normal leading-normal whitespace-pre">
        {t('copyright')}
      </p>
    </footer>
  )
}
