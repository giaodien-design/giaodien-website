'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { X } from 'lucide-react';

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export function SearchPopup({ isOpen, onClose, searchInputRef }: SearchPopupProps) {
  const t = useTranslations('header');
  const tCategories = useTranslations('categories');
  
  // Fixed app recommendations data (8 apps)
  const appRecommendations = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `App ${i + 1}`,
  }));

  // Fixed flow recommendations data (6 flows)
  const flowRecommendations = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: 'Onboarding',
  }));

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay with backdrop blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Search Popup */}
      <div className="fixed inset-0 z-50 flex flex-col pointer-events-none">
        <div className="w-full h-full mx-auto pointer-events-auto bg-background flex flex-col overflow-hidden">
          {/* Search Field - Sticky */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0 sticky top-0 bg-background z-10">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t('searchPlaceholder')}
              className="flex-1 bg-transparent text-foreground text-[14px] font-normal leading-[1.5] tracking-[0.07px] outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-[10px] hover:bg-accent transition-colors shrink-0"
              aria-label={t('close')}
            >
              <X className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">

          {/* App Recommendations Section */}
          <div className="border-b border-border">
            <div>
              <p className="text-foreground text-base font-normal leading-[1.5] pt-6 pb-3 px-6 border-b border-border">
                {tCategories('primaryTabs.app')}
              </p>
              
              {/* App Icons Grid - 8 per row desktop, 4 per row mobile */}
              <div className="grid grid-cols-4 md:grid-cols-8 gap-0">
                {appRecommendations.map((app, index) => (
                  <div 
                    key={app.id}
                    className="flex flex-col items-center justify-center p-6 border-r border-b border-border [&:nth-child(4n)]:border-r-0 md:[&:nth-child(4n)]:!border-r md:[&:nth-child(8n)]:!border-r-0"
                  >
                    <div className="aspect-square w-full max-w-[73.5px] md:max-w-[124.5px] relative rounded-[4px] overflow-hidden">
                      <Image
                        src="/images/sample-app-thumbnail.png"
                        alt={app.name}
                        fill
                        className="object-cover rounded-[4px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flow Recommendations Section */}
          <div>
            <div>
              <p className="text-foreground text-base font-normal leading-[1.5] pt-6 pb-3 px-6 border-b border-border">
                {tCategories('primaryTabs.flow')}
              </p>
              
              {/* Flow Grid - 6 per row desktop, 2 per row mobile */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-0">
                {flowRecommendations.map((flow) => (
                  <div 
                    key={flow.id}
                    className="flex flex-col items-start justify-start p-3 border-r border-b border-border [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:!border-r md:[&:nth-child(4n)]:!border-r md:[&:nth-child(6n)]:!border-r-0"
                  >
                    <div className="aspect-square w-full bg-secondary rounded-[20px] flex items-start p-4">
                      <p className="text-foreground text-base font-normal leading-[1.5]">
                        {flow.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
