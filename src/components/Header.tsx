"use client";
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'
import { SearchWithSuggestions } from './SearchWithSuggestions'
import { Input } from "@/components/ui/input";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center gap-3 justify-center px-4 md:px-10 lg:px-20 py-3 bg-white">
      <div className="flex-1 flex items-start">
        <div className="h-5 w-[97px] md:h-6 md:w-[117px] relative">
          <Image 
            src="/images/gdd-logo.svg" 
            alt="gdd logo" 
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <div className="hidden md:flex items-center">
        <Input 
          type="text"
          placeholder="Tìm kiếm" 
          className="w-48 lg:w-80 h-9 rounded-md border-neutral-200 px-3 py-1 text-base text-neutral-500 placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      
      <div className="flex-1 flex items-center justify-end gap-2.5">
        <Button 
          variant="outline" 
          className="px-3 md:px-4 py-2 rounded-lg shadow-sm text-xs md:text-sm font-medium bg-white border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900"
        >
          Đăng nhập
        </Button>
      </div>
    </header>
  )
}
