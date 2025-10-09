import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export function Header() {
  return (
    <header className="flex items-center gap-3 justify-center px-20 py-3 bg-white">
      <div className="flex-1 flex items-start">
        <div className="h-6 w-[117px] relative">
          <Image 
            src="/images/gdd-logo.svg" 
            alt="gdd logo" 
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <Input 
          type="text"
          placeholder="Tìm kiếm" 
          className="w-80 h-9 rounded-md border-neutral-200 px-3 py-1 text-base text-neutral-500 placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      
      <div className="flex-1 flex items-center justify-end gap-2.5">
        <Button 
          variant="outline" 
          className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium bg-white border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900"
        >
          Đăng nhập
        </Button>
      </div>
    </header>
  )
}
