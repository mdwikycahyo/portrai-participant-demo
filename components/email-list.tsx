"use client"

import { Paperclip } from "lucide-react"
import { useAssessmentAssistant } from "@/contexts/assessment-assistant-context"

interface EmailListProps {
  selectedEmail: string | null
  onEmailSelect: (emailId: string) => void
  activeTab: string
}

const emails = {
  inbox: [
    {
      id: "first-mission",
      sender: "Mia Avira",
      avatar: "MA",
      subject: "Misi Pertama Anda di Amboja",
      preview:
        "Selamat datang di Amboja! Sebagai bagian dari proses onboarding, kami telah menyiapkan misi pertama yang akan membantu...",
      time: "12:30 PM",
      hasAttachment: true,
    },
    {
      id: "ux-researcher",
      sender: "Dwiky Cahyo",
      avatar: "DC",
      subject: "Kick-off Discussion",
      preview:
        "Kita tengah memasuki fase penting dalam perjalanan Amboja sebagai perusahaan teknologi yang berbasis pada keber...",
      time: "2:00 PM",
      hasAttachment: true,
    },
    {
      id: "ui-developer",
      sender: "UI Developer",
      avatar: "UD",
      subject: "Launch Planning Session",
      preview:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      time: "4:15 PM",
      hasAttachment: true,
    },
    {
      id: "product-manager",
      sender: "Product Manager",
      avatar: "PM",
      subject: "Project Commencement Brief...",
      preview:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In egestas orci ac quam...",
      time: "11:45 AM",
      hasAttachment: true,
    },
    {
      id: "frontend-engineer",
      sender: "Front-end Engineer",
      avatar: "FE",
      subject: "Initial Project Overview",
      preview:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, tot...",
      time: "9:30 AM",
      hasAttachment: true,
    },
  ],
  sent: [],
  draft: [],
}

export function EmailList({ selectedEmail, onEmailSelect, activeTab }: EmailListProps) {
  const { onboardingEmailSent, emailRead } = useAssessmentAssistant()
  const currentEmails = emails[activeTab as keyof typeof emails] || []

  if (currentEmails.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>Tidak ada email di {activeTab === "inbox" ? "masuk" : activeTab === "sent" ? "terkirim" : "draft"}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-50">
      {currentEmails.map((email) => (
        <div
          key={email.id}
          onClick={() => onEmailSelect(email.id)}
          className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-white transition-colors ${
            selectedEmail === email.id ? "bg-white border-l-4 border-l-blue-500" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 flex-shrink-0">
              {email.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">{email.sender}</h3>
                  {email.id === "first-mission" && onboardingEmailSent && !emailRead && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{email.time}</span>
                  {email.hasAttachment && <Paperclip className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
              <h4 className="font-medium text-gray-800 mb-1 truncate">{email.subject}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{email.preview}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
