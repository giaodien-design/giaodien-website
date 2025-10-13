import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'
import { SearchWithSuggestions } from './SearchWithSuggestions'

export function Header() {
  const t = useTranslations('header');
  const tCommon = useTranslations('common');
  
  return (
    <>
      <header className="flex items-center gap-2 md:gap-3 justify-center px-4 md:px-10 lg:px-20 py-3 bg-white border-b">
        <div className="flex-1 flex items-start">
          <div className="h-5 w-[97px] md:h-6 md:w-[117px] relative">
            <Image 
              src="/images/gdd-logo.svg" 
              alt={tCommon('logoAlt')}
              fill
              className="object-contain"
            />
          </div>
        </div>
        
        <div className="hidden md:flex items-center">
          <SearchWithSuggestions />
        </div>
        
        <div className="flex-1 flex items-center justify-end gap-2 md:gap-2.5">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          <div className="transition-transform duration-200 ease-in-out hover:translate-y-[1px] active:translate-y-[1px]">
            <Button 
              variant="outline" 
              className="w-[120px] px-3 md:px-4 py-2 rounded-lg text-sm font-medium bg-indigo-50 border-t border-l border-r border-b-2 border-indigo-600 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 hover:border-indigo-700 hover:border-b active:bg-indigo-100 active:text-indigo-700 active:border-b transition-colors duration-200 ease-in-out touch-manipulation"
            >
              {t('login')}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-2 bg-white border-b">
        <SearchWithSuggestions />
      </div>
    </>
  )
}
