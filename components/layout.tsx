"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { UserProfileDropdown } from "./user-profile-dropdown"
import { AssessmentAssistant, AssessmentAssistantButton } from "./assessment-assistant"
import { WorkHourBanner } from "./work-hour-banner"
import { AssessmentReminderBanner } from "./assessment-reminder-banner"
// Removed Switch and Label imports as they are now in UserProfileDropdown
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const [isAssistantOpen, setIsAssistantOpen] = useState(false) // Default to closed
  const [showWorkHourBanner, setShowWorkHourBanner] = useState(false) // Default to hidden
  const [showAssessmentReminderBanner, setShowAssessmentReminderBanner] = useState(false) // Default to hidden
  const [hasNewAiAssistantMessage, setHasNewAiAssistantMessage] = useState(false) // State for the red dot
  const [aiAssistantTriggerMessage, setAiAssistantTriggerMessage] = useState<{ text: string; type: "reminder" } | null>(
    null,
  ) // State for AI Assistant messages

  // Persist assistant open state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("assessment-assistant-open")
      if (saved === "true") {
        setIsAssistantOpen(true)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("assessment-assistant-open", isAssistantOpen.toString())
    }
  }, [isAssistantOpen])

  // Persist work hour banner state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("work-hour-banner-visible")
      if (saved === "true") {
        setShowWorkHourBanner(true)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("work-hour-banner-visible", showWorkHourBanner.toString())
    }
  }, [showWorkHourBanner])

  // Persist assessment reminder banner state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("assessment-reminder-banner-visible")
      if (saved === "true") {
        setShowAssessmentReminderBanner(true)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("assessment-reminder-banner-visible", showAssessmentReminderBanner.toString())
    }
  }, [showAssessmentReminderBanner])

  // Persist new AI Assistant message indicator state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ai-assistant-new-message-indicator")
      if (saved === "true") {
        setHasNewAiAssistantMessage(true)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ai-assistant-new-message-indicator", hasNewAiAssistantMessage.toString())
    }
  }, [hasNewAiAssistantMessage])

  // Callback for AssessmentAssistant to notify Layout about new messages
  const handleNewAiAssistantMessage = useCallback(() => {
    setHasNewAiAssistantMessage(true)
  }, [])

  // Callback for AssessmentAssistant to notify Layout when chat is opened
  const handleAiAssistantChatOpened = useCallback(() => {
    setHasNewAiAssistantMessage(false)
  }, [])

  // Effect to clear aiAssistantTriggerMessage after it's been "sent"
  useEffect(() => {
    if (aiAssistantTriggerMessage) {
      // Clear the message after a short delay to allow AssessmentAssistant to process it
      const timer = setTimeout(() => {
        setAiAssistantTriggerMessage(null)
      }, 100) // Small delay
      return () => clearTimeout(timer)
    }
  }, [aiAssistantTriggerMessage])

  const toggleAssistant = () => {
    setIsAssistantOpen(!isAssistantOpen)
  }

  const toggleWorkHourBanner = (checked: boolean) => {
    setShowWorkHourBanner(checked)
    if (checked) {
      setHasNewAiAssistantMessage(true) // Direct trigger for the dot from banner toggle
      setAiAssistantTriggerMessage({
        text: "Halo! Saya melihat jam kerja Anda akan segera berakhir. Pastikan Anda menyelesaikan tugas dan melakukan check out tepat waktu.",
        type: "reminder",
      })
    } else {
      if (!showAssessmentReminderBanner) {
        setHasNewAiAssistantMessage(false)
      }
      setAiAssistantTriggerMessage(null) // Clear message if banner is off
    }
  }

  const toggleAssessmentReminderBanner = (checked: boolean) => {
    setShowAssessmentReminderBanner(checked)
    if (checked) {
      setHasNewAiAssistantMessage(true) // Direct trigger for the dot from banner toggle
      setAiAssistantTriggerMessage({
        text: "Perhatian! Sesi penilaian Anda akan berakhir dalam waktu kurang dari 30 menit. Mohon fokus untuk menyelesaikan semua tugas yang tersisa.",
        type: "reminder",
      })
    } else {
      if (!showWorkHourBanner) {
        setHasNewAiAssistantMessage(false)
      }
      setAiAssistantTriggerMessage(null) // Clear message if banner is off
    }
  }

  const handleCheckOut = () => {
    setShowWorkHourBanner(false)
    router.push("/check-in")
  }

  const handleCloseAssessmentReminder = () => {
    setShowAssessmentReminderBanner(false)
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className={`transition-all duration-300 ease-in-out ${isAssistantOpen ? "ml-20 mr-80" : "ml-20"}`}>
        {/* Header with UserProfileDropdown and Assessment Assistant Button */}
        <div className="bg-gray-50 p-6">
          <div className="flex justify-end items-center gap-4 mb-8">
            {/* Removed banner toggles from here */}
            <AssessmentAssistantButton onClick={toggleAssistant} hasNewMessage={hasNewAiAssistantMessage} />
            <UserProfileDropdown
              showWorkHourBanner={showWorkHourBanner}
              onToggleWorkHourBanner={toggleWorkHourBanner}
              showAssessmentReminderBanner={showAssessmentReminderBanner}
              onToggleAssessmentReminderBanner={toggleAssessmentReminderBanner}
            />
          </div>
        </div>

        {/* Banners Container */}
        {(showWorkHourBanner || showAssessmentReminderBanner) && (
          <div className="bg-gray-50 px-6 pt-4 pb-6 space-y-4">
            {showWorkHourBanner && <WorkHourBanner onCheckOut={handleCheckOut} />}
            {showAssessmentReminderBanner && <AssessmentReminderBanner onClose={handleCloseAssessmentReminder} />}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-gray-50">{children}</div>
      </main>

      {/* Assessment Assistant Panel */}
      <AssessmentAssistant
        isOpen={isAssistantOpen}
        onToggle={toggleAssistant}
        externalMessage={aiAssistantTriggerMessage}
        onNewMessageReceived={handleNewAiAssistantMessage}
        onChatOpened={handleAiAssistantChatOpened}
      />
    </div>
  )
}
