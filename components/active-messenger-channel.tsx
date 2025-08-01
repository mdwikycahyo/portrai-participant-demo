"use client"

import type React from "react"

import { useState } from "react"
import { Send, ChevronDown, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { Channel } from "@/lib/messenger-data"

type Participant = {
  name: string
  avatar: string
  role: string
  email: string
}

interface ActiveMessengerChannelProps {
  channel: Channel
  selectedParticipant: Participant | null
}

export function ActiveMessengerChannel({ channel, selectedParticipant }: ActiveMessengerChannelProps) {
  const [isParticipantsPanelOpen, setIsParticipantsPanelOpen] = useState(false)
  const [messageInput, setMessageInput] = useState("")

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput)
      setMessageInput("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  // Determine header content based on selectedParticipant
  const headerContent = selectedParticipant
    ? {
        title: selectedParticipant.name,
        subtitle: selectedParticipant.role,
        context: `Konteks: ${channel.name}`,
        avatar: selectedParticipant.avatar,
      }
    : {
        title: channel.name,
        subtitle: "Channel Chat",
        context: null,
        avatar: "#",
      }

  // Determine input placeholder
  const inputPlaceholder = selectedParticipant
    ? `Ketik pesan Anda ke ${selectedParticipant.name}...`
    : "Ketik pesan Anda di sini..."

  return (
    <div className="flex-1 flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                {headerContent.avatar}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{headerContent.title}</h2>
                <p className="text-sm text-gray-600">{headerContent.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
          {channel.messages.length === 0 ? (
            /* Empty Chat State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-500">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">Senin, 11 Jan</span>
              </div>

              {channel.messages.map((message) => (
                <div key={message.id} className="mb-4">
                  <div className={`flex items-start gap-3 ${message.isUser ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                      {message.senderAvatar}
                    </div>
                    <div className="flex-1">
                      <div className={`flex items-center gap-2 mb-1 ${message.isUser ? "justify-end" : ""}`}>
                        <span className="text-sm font-medium text-gray-900">~{message.senderName}</span>
                      </div>
                      <div
                        className={`p-3 rounded-lg shadow-sm max-w-md ${
                          message.isUser ? "bg-blue-500 text-white ml-auto" : "bg-white text-gray-700"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                      <span className={`text-xs text-gray-500 mt-1 block ${message.isUser ? "text-right" : ""}`}>
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={inputPlaceholder}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Collapsible Participants Panel */}
      {isParticipantsPanelOpen && (
        <div className="w-80 bg-white border-l border-gray-200">
          {/* Panel Header */}
          <div className="p-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Participants</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsParticipantsPanelOpen(false)} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Separator />

          {/* Participants List */}
          <div className="p-4">
            <div className="space-y-3">
              {channel.participants.map((participant, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                    {participant.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{participant.name}</div>
                    <div className="text-sm text-gray-500">{participant.role}</div>
                    <div className="text-sm text-gray-600">{participant.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
