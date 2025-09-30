import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center px-6 py-4 bg-white border-b">
      <div className="flex items-center w-1/4">
        <img src="/images/gdd-logo.svg" alt="gd.w" className="h-6" />
      </div>
      
      <div className="flex-1 flex justify-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input 
            type="text"
            placeholder="Tìm kiếm" 
            className="pl-10 w-64 border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="flex items-center w-1/4 justify-end">
        <Button variant="outline">Đăng nhập</Button>
      </div>
    </header>
  )
}
