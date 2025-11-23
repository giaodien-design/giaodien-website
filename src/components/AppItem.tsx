'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface AppItemProps {
  id: string;
  name: string;
  description: string;
  thumbnailUrl?: string | null;
  logoUrl?: string | null;
}

export function AppItem({ id, name, description, thumbnailUrl, logoUrl }: AppItemProps) {
  const t = useTranslations('common');
  
  return (
    <Link href={`/app/${id}`} className="flex flex-col w-full h-full group">
      {/* Card Container */}
      <div className="flex flex-col gap-4 items-center justify-center px-6 py-8 w-full h-full border-border border-r-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 md:[&:nth-child(3n)]:border-r-0 border-t-0 [&:nth-child(n+2)]:border-t sm:[&:nth-child(n+2)]:border-t-0 sm:[&:nth-child(2n+3)]:border-t md:[&:nth-child(n+3)]:border-t-0 md:[&:nth-child(n+4)]:border-t border-b">
        {/* Image Container */}
        <div className="bg-secondary flex items-center justify-center py-8 md:py-12 rounded-[20px] w-full">
          <div className="aspect-[249/540] w-1/2 relative rounded-[20px]">
            <Image
              src="/images/sample-img.png"
              alt={name}
              fill
              className="object-cover object-center rounded-[20px]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
        
        {/* Content: Thumbnail + Text */}
        <div className="flex gap-3 items-start w-full">
          {/* App Thumbnail */}
          <div className="relative w-10 h-10 rounded-[4px] shrink-0">
            <Image
              src="/images/sample-app-thumbnail.png"
              alt={name}
              fill
              className="object-cover object-center rounded-[4px]"
            />
          </div>
          
          {/* Text Content */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h3 className="text-foreground text-base font-normal leading-[1.5] w-full">
              {name}
            </h3>
            <p className="text-muted-foreground text-sm font-normal leading-[1.5] tracking-[0.07px] w-full">
              {description || ''}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
