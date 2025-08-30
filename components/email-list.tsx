"use client"

import { Paperclip } from "lucide-react"
import { useAssessmentAssistant } from "@/contexts/assessment-assistant-context"

interface EmailListProps {
  selectedEmail: string | null
  onEmailSelect: (emailId: string) => void
  activeTab: string
}

const emails = {
  sent: [],
  draft: [],
}

export function EmailList({ selectedEmail, onEmailSelect, activeTab }: EmailListProps) {
  const { onboardingEmailSent, emailRead, inboxEmails } = useAssessmentAssistant()
  
  // Get emails based on active tab
  const currentEmails = activeTab === "inbox" 
    ? inboxEmails 
    : emails[activeTab as keyof typeof emails] || []

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
