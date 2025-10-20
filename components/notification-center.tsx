"use client"

import Link from "next/link"
import { MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAssessmentAssistant } from "@/contexts/assessment-assistant-context"

export function NotificationCenter() {
  const { onboardingChannelTriggered, onboardingEmailSent, hasInteractedWithMia } = useAssessmentAssistant()
  
  // Dynamic notifications based on app state
  const notifications = [
    {
      title: "Messenger",
      icon: MessageCircle,
      iconColor: "text-purple-600",
      message: (onboardingChannelTriggered && !hasInteractedWithMia)
        ? "Pesan baru dari VP of Human Resources!" 
        : "Tidak ada message baru",
      actionText: "Lihat",
      href: "/messenger",
      hasNewContent: onboardingChannelTriggered && !hasInteractedWithMia,
    },
    {
      title: "Email",
      icon: Mail,
      iconColor: "text-orange-600",
      message: onboardingEmailSent 
        ? "Email baru: Misi Pertama Anda di Amboja" 
        : "Tidak ada email baru",
      actionText: "Lihat",
      href: "/email",
      hasNewContent: onboardingEmailSent,
    },
  ]

  return (
    <div data-onboarding="home:notification-center" className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Pusat Notifikasi</h2>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const Icon = notification.icon
          return (
            <div 
              key={notification.title} 
              className={`rounded-xl p-4 ${
                notification.hasNewContent 
                  ? "bg-blue-50 border-2 border-blue-200" 
                  : "bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${notification.iconColor}`} />
                  <span className="font-medium text-gray-900">{notification.title}</span>
                  {notification.hasNewContent && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
                <Button 
                  asChild 
                  variant={notification.hasNewContent ? "default" : "outline"} 
                  size="sm"
                  className={notification.hasNewContent ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <Link href={notification.href}>{notification.actionText}</Link>
                </Button>
              </div>
              <p className={`text-sm ${
                notification.hasNewContent ? "text-blue-700 font-medium" : "text-gray-500"
              }`}>
                {notification.message}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
