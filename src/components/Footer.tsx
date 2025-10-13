import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Footer() {
  const t = useTranslations('footer');
  
  return (
    <footer className="text-center py-6 md:py-8 px-4 md:px-6 bg-white border-t">
      <div className="space-y-4">
        {/* Language Switcher - Only on mobile and tablet */}
        <div className="lg:hidden flex justify-center">
          <LanguageSwitcher />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs md:text-sm text-gray-600">{t('link')}</p>
          <p className="text-xs md:text-sm text-gray-500">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
