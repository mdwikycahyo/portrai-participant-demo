"use client"

import Link from "next/link"
import { MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

const notifications = [
  {
    title: "Chat",
    icon: MessageCircle,
    iconColor: "text-purple-600",
    message: "Tidak ada chat baru",
    actionText: "Lihat Chat",
    href: "/chat",
  },
  {
    title: "Email",
    icon: Mail,
    iconColor: "text-orange-600",
    message: "Tidak ada email baru",
    actionText: "Lihat Email",
    href: "/email",
  },
]

export function NotificationCenter() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Pusat Notifikasi</h2>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const Icon = notification.icon
          return (
            <div key={notification.title} className="bg-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${notification.iconColor}`} />
                  <span className="font-medium text-gray-900">{notification.title}</span>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={notification.href}>{notification.actionText}</Link>
                </Button>
              </div>
              <p className="text-gray-500 text-sm">{notification.message}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
