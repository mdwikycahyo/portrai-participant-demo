"use client"
import { useRouter } from "next/navigation"
import { ChevronDown, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function UserProfileDropdown() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          DC
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">Hi Dwiky Cahyo</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
