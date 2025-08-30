"use client"

import { Search, Edit, Inbox, Send, FileEdit } from "lucide-react"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAssessmentAssistant } from "@/contexts/assessment-assistant-context"

interface EmailSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "inbox", label: "Masuk", icon: Inbox },
  { id: "sent", label: "Terkirim", icon: Send },
  { id: "draft", label: "Draft", icon: FileEdit },
]

export function EmailSidebar({ activeTab, onTabChange }: EmailSidebarProps) {
  const router = useRouter();
  const { onboardingEmailSent, emailRead } = useAssessmentAssistant();

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Email</h1>

        {/* Compose Button */}
        <Button onClick={() => router.push('/email/compose')} className="w-full bg-gray-800 hover:bg-gray-700 text-white mb-4">
            <Edit className="w-4 h-4 mr-2" />
            Tulis
        </Button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Cari" className="pl-10" disabled />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="p-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const hasNewEmail = tab.id === "inbox" && onboardingEmailSent && !emailRead
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-600 border-l-4 border-l-blue-500"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
              {hasNewEmail && (
                <div className="w-2 h-2 bg-red-500 rounded-full ml-auto"></div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
