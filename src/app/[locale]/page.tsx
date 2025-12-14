'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { AppGridContainer } from '@/components/AppGridContainer';
import { Footer } from '@/components/Footer';
import { PrimaryTab } from '@/components/PrimaryTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'app' | 'flow'>('app');

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      {/* Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Body: Secondary Tabs -> App/Flow Grid */}
      <main className="flex-1 flex flex-col">
        <AppGridContainer activeTab={activeTab} onTabChange={setActiveTab} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile: Primary Tabs Floating at Bottom */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 sm:hidden">
        <PrimaryTab activeTab={activeTab} onTabChange={setActiveTab} direction="horizontal" isMobileFloating={true} />
      </div>
    </div>
  );
}
