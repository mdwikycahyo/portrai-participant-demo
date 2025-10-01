"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { EmailSidebar } from "@/components/email-sidebar"
import { EmailList } from "@/components/email-list"
import { EmailEmptyState } from "@/components/email-empty-state"
import { EmailContent } from "@/components/email-content"

export default function EmailPage() {
  const [activeTab, setActiveTab] = useState("inbox")
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSelectedEmail(null)
  }

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmail(emailId)
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex px-6 pb-6">
        <EmailSidebar activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="flex-1 flex">
          <EmailList selectedEmail={selectedEmail} onEmailSelect={handleEmailSelect} activeTab={activeTab} />
          <div className="flex-1 bg-white">{selectedEmail ? <EmailContent emailId={selectedEmail} /> : <EmailEmptyState />}</div>
        </div>
      </div>
    </Layout>
  )
}
