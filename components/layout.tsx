"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { UserProfileDropdown } from "./user-profile-dropdown"
import { AssessmentAssistant, AssessmentAssistantButton } from "./assessment-assistant"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false) // Default to closed

  // Persist assistant state
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

  const toggleAssistant = () => {
    setIsAssistantOpen(!isAssistantOpen)
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className={`transition-all duration-300 ease-in-out ${isAssistantOpen ? "ml-20 mr-80" : "ml-20"}`}>
        {/* Header with UserProfileDropdown and Assessment Assistant Button */}
        <div className="bg-gray-50 p-6">
          <div className="flex justify-end items-center gap-4 mb-8">
            <AssessmentAssistantButton onClick={toggleAssistant} />
            <UserProfileDropdown />
          </div>
        </div>
        {/* Main Content */}
        <div className="bg-gray-50">{children}</div>
      </main>

      {/* Assessment Assistant Panel */}
      <AssessmentAssistant isOpen={isAssistantOpen} onToggle={toggleAssistant} />
    </div>
  )
}
