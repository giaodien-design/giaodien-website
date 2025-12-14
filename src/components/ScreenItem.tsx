'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ScreenItemProps {
  imageUrl: string;
  title: string;
}

export function ScreenItem({ imageUrl, title }: ScreenItemProps) {
  const t = useTranslations('appDetail');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    if (isCopying) return;
    setIsCopying(true);

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
    } catch (error) {
      console.error('Failed to copy image:', error);
    } finally {
      setIsCopying(false);
    }
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'screen'}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Thumbnail Container */}
      <div className="p-0.5 w-full">
        <div className="relative w-full aspect-[430/932]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized={imageUrl.startsWith('http')}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full border-t border-gd-cream/[0.12]">
        <button
          onClick={handleCopy}
          disabled={isCopying}
          className="flex-1 h-[57px] flex items-center justify-center border-r border-gd-cream/[0.12] text-gd-cream text-sm font-normal leading-normal hover:bg-gd-cream hover:text-gd-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <p className="text-gd-cream group-hover:text-gd-dark text-sm font-normal leading-normal">{t('copy')}</p>
        </button>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 h-[57px] flex items-center justify-center text-gd-cream text-sm font-normal leading-normal hover:bg-gd-cream hover:text-gd-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <p className="text-gd-cream group-hover:text-gd-dark text-sm font-normal leading-normal">{t('download')}</p>
        </button>
      </div>
    </div>
  );
}
