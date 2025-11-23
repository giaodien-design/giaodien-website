'use client';

import { useState } from "react";
import { Header } from "@/components/Header";
import { AppGridContainer } from "@/components/AppGridContainer";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'app' | 'flow'>('app');

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop: Header fixed on left, Body scrollable on right */}
      <div className="hidden sm:flex w-full">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-y-auto min-w-0 w-full">
          <AppGridContainer activeTab={activeTab} onTabChange={setActiveTab} />
          <Footer />
        </div>
      </div>

      {/* Mobile/Tablet: Header on top, Body below */}
      <div className="flex sm:hidden flex-col w-full">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-y-auto">
          <AppGridContainer activeTab={activeTab} onTabChange={setActiveTab} />
          <Footer />
        </div>
      </div>
    </div>
  );
}

