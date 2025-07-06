"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Folder, MessageCircle, Mail } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  { name: "Beranda", href: "/home", icon: Home },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Email", href: "/email", icon: Mail },
  { name: "Documents", href: "/documents", icon: Folder },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <div className="fixed left-1 top-1 bottom-1 h-[calc(100%-0.3rem*2)] w-20 bg-gray-800 flex flex-col items-center py-6 z-50 rounded-[12px]">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center p-2">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`
                      relative p-3 rounded-xl transition-all duration-200 group
                      ${isActive ? "bg-blue-500/20 backdrop-blur-sm border border-blue-400/30" : "hover:bg-gray-700"}
                    `}
                  >
                    <Icon
                      className={`
                        w-6 h-6 transition-colors
                        ${isActive ? "text-blue-400" : "text-white group-hover:text-gray-300"}
                      `}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </div>
    </TooltipProvider>
  )
}
