"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, X, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
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
  onSendMessage: (channelId: string, message: any) => void
  onOnboardingTrigger: () => void
  isTyping: boolean
  typingUser?: string
  conversationStage: 'initial' | 'waiting_for_response' | 'responded' | 'mission_phase' | 'email_confirmed' | 'mission_briefing' | 'task_readiness_check' | 'task_list_delivered' | 'task_clarity_check' | 'ai_hint_given' | 'mission_started' | 'email_replied' | 'mia_completion'
  clearMiaCompletionNotifications: () => void
  clearAryaNotifications: () => void
  triggerMiaCompletionPhase2: () => void
  getMessagesForParticipant: (participant: Participant | null) => any[]
}

export function ActiveMessengerChannel({ 
  channel, 
  selectedParticipant, 
  onSendMessage, 
  onOnboardingTrigger, 
  isTyping, 
  typingUser,
  conversationStage,
  clearMiaCompletionNotifications,
  clearAryaNotifications,
  triggerMiaCompletionPhase2,
  getMessagesForParticipant
}: ActiveMessengerChannelProps) {
  const [isParticipantsPanelOpen, setIsParticipantsPanelOpen] = useState(false)
  const [messageInput, setMessageInput] = useState("")
  const [isAutoFilled, setIsAutoFilled] = useState(false)
  const [lastProcessedMessageId, setLastProcessedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Scroll to bottom function - only scrolls the messages container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [selectedParticipant, getMessagesForParticipant])

  // Enhanced scroll behavior - scroll when typing animation starts
  useEffect(() => {
    if (isTyping) {
      // Immediate scroll when typing starts
      scrollToBottom()
    }
  }, [isTyping])

  // Clear notifications when user is viewing messages from specific participants
  useEffect(() => {
    if (channel.id === "onboarding-channel" && selectedParticipant) {
      if (selectedParticipant.name === "Mia Avira") {
        clearMiaCompletionNotifications()
        // Note: triggerMiaCompletionPhase2() is called in handleSelectParticipant to avoid duplicates
      } else if (selectedParticipant.name === "Arya Prajida") {
        clearAryaNotifications()
      }
    }
  }, [channel.id, selectedParticipant, clearMiaCompletionNotifications, clearAryaNotifications])

  // Trigger onboarding when Mia is selected in onboarding channel
  useEffect(() => {
    if (
      channel.id === "onboarding-channel" && 
      selectedParticipant?.name === "Mia Avira"
    ) {
      // Check if we already have the welcome and question messages to prevent duplicates
      const currentMessages = getMessagesForParticipant(selectedParticipant)
      const hasWelcomeMessage = currentMessages.some(msg => msg.content.includes("Selamat datang di Amboja"))
      const hasQuestionMessage = currentMessages.some(msg => msg.content.includes("Bagaimana sejauh ini"))
      
      // Only trigger if we don't have these messages yet
      if (!hasWelcomeMessage && !hasQuestionMessage) {
        onOnboardingTrigger()
      }
    }
  }, [channel.id, selectedParticipant?.name, selectedParticipant, onOnboardingTrigger, getMessagesForParticipant])

  // Auto-fill functionality for Interactive Tutorial
  useEffect(() => {
    if (channel.id !== "onboarding-channel" || selectedParticipant?.name !== "Mia Avira") {
      return
    }

    // Get the latest message from Mia
    const latestMiaMessage = getMessagesForParticipant(selectedParticipant)
      .filter(msg => !msg.isUser && msg.senderName === "Mia Avira")
      .slice(-1)[0]

    if (!latestMiaMessage || latestMiaMessage.id === lastProcessedMessageId) {
      return
    }

    // Message detection patterns
    const shouldAutoFillFeedback = (message: string) => 
      /Bagaimana sejauh ini.*Apakah sesi perkenalan.*membantu/i.test(message)

    const shouldAutoFillEmailConfirmation = (message: string) => {
      const result = /Bisa tolong cek.*kabari.*fitur chat.*terima/i.test(message)
      console.log('Debug - Auto-fill email confirmation check:', message, result)
      return result
    }

    // Mission briefing auto-fill patterns
    const shouldAutoFillTaskReadiness = (message: string) => 
      /Apakah Anda siap untuk melihat rincian tugasnya/i.test(message)

    const shouldAutoFillTaskClarity = (message: string) => 
      /Bagaimana.*apakah keempat langkah.*cukup jelas/i.test(message)

    // Check if we should auto-fill based on the latest message
    if (shouldAutoFillFeedback(latestMiaMessage.content)) {
      const autoResponse = "Ya, sangat membantu. Saya merasa lebih siap untuk menggunakan platform ini."
      setMessageInput(autoResponse)
      setIsAutoFilled(true)
      setLastProcessedMessageId(latestMiaMessage.id)
    } else if (shouldAutoFillEmailConfirmation(latestMiaMessage.content)) {
      const autoResponse = "Ya, saya sudah menerima emailnya. Terima kasih."
      setMessageInput(autoResponse)
      setIsAutoFilled(true)
      setLastProcessedMessageId(latestMiaMessage.id)
    } else if (shouldAutoFillTaskReadiness(latestMiaMessage.content)) {
      const autoResponse = "Ya, saya siap."
      setMessageInput(autoResponse)
      setIsAutoFilled(true)
      setLastProcessedMessageId(latestMiaMessage.id)
    } else if (shouldAutoFillTaskClarity(latestMiaMessage.content)) {
      const autoResponse = "Cukup jelas."
      setMessageInput(autoResponse)
      setIsAutoFilled(true)
      setLastProcessedMessageId(latestMiaMessage.id)
    }
  }, [selectedParticipant, channel.id, selectedParticipant?.name, lastProcessedMessageId, getMessagesForParticipant])



  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const userMessage = {
        id: `msg-user-${Date.now()}`,
        senderName: "You",
        senderAvatar: "Y",
        content: messageInput.trim(),
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        isUser: true,
      }

      // Send message via parent callback
      onSendMessage(channel.id, userMessage)
      setMessageInput("")
      setIsAutoFilled(false) // Reset auto-fill state after sending
    }
  }



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleCallNowClick = () => {
    router.push("/call/active/1")
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

  // Determine input placeholder dynamically based on conversation stage
  const getInputPlaceholder = () => {
    if (!selectedParticipant) return "Ketik pesan Anda di sini..."
    
    // Special logic for Mia Avira onboarding conversation
    if (channel.id === "onboarding-channel" && selectedParticipant.name === "Mia Avira") {
      // Show special placeholder when auto-filled
      if (isAutoFilled) {
        return "Tekan Send untuk melanjutkan..."
      }
      
      switch (conversationStage) {
        case 'initial':
          return "Tunggu Mia menyelesaikan perkenalannya..."
        case 'waiting_for_response':
          return "Ceritakan pengalaman Anda dengan AI Assistant..."
        case 'responded':
          return "Tunggu respons dari Mia..."
        case 'mission_phase':
          return "Konfirmasi setelah Anda menerima email..."
        default:
          return `Ketik pesan Anda ke ${selectedParticipant.name}...`
      }
    }
    
    return `Ketik pesan Anda ke ${selectedParticipant.name}...`
  }
  
  const inputPlaceholder = getInputPlaceholder()

  // Get typing user info for display
  const getTypingUserInfo = () => {
    if (!typingUser) return { avatar: "MA", name: "Mia Avira", bgColor: "bg-purple-600" }
    
    switch (typingUser) {
      case "Arya Prajida":
        return { avatar: "AP", name: "Arya Prajida", bgColor: "bg-blue-600" }
      case "Mia Avira":
      default:
        return { avatar: "MA", name: "Mia Avira", bgColor: "bg-purple-600" }
    }
  }

  const typingUserInfo = getTypingUserInfo()

  // Get messages based on selected participant using the new separation logic
  const getFilteredMessages = () => {
    if (channel.id === "onboarding-channel") {
      // Use the message separation logic from parent
      return getMessagesForParticipant(selectedParticipant)
    }
    
    // For other channels, show all messages (current behavior)
    return channel.messages
  }

  const filteredMessages = getFilteredMessages()

  // Check if message should have call button
  const shouldShowCallButton = (message: any) => {
    return (
      message.senderName === "Ezra Kaell" &&
      (message.content.includes("Bisa kita discuss proposal sponsorship ini via call saja?") ||
        message.content.includes("Bisa kita lanjutkan di sini atau coba call lagi")) &&
      channel.name === "Peluang Sponsorship S24"
    )
  }

  // Check if message should have voice call bubble (for Arya Prajida)
  const shouldShowVoiceCallBubble = (message: any) => {
    return (
      message.senderName === "Arya Prajida" &&
      message.content.includes("Apakah Anda ada waktu sekitar 5-10 menit sekarang untuk kita terhubung lewat **Voice Call** singkat?") &&
      (channel.id === "president-director-channel" || channel.id === "onboarding-channel")
    )
  }

  const handleVoiceCallClick = () => {
    // Get Arya Prajida's contact ID or use a default
    const aryaContactId = "arya-prajida" // This could be dynamic based on participant data
    router.push(`/call/active/${aryaContactId}`)
  }

  // Check if message is system message
  const isSystemMessage = (message: any) => {
    return message.senderName === "System"
  }

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
        <div 
          ref={messagesContainerRef}
          className="flex-1 p-4 bg-gray-50 overflow-y-auto"
          style={{ scrollBehavior: 'smooth' }}
        >
          {filteredMessages.length === 0 ? (
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

              {filteredMessages.map((message) => (
                <div key={message.id} className="mb-4">
                  {isSystemMessage(message) ? (
                    /* System Message - Centered */
                    <div className="flex justify-center mb-4">
                      <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                        {message.content}
                      </span>
                    </div>
                  ) : (
                    /* Regular Chat Message */
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
                          <div 
                            className="whitespace-pre-line" 
                            dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} 
                          />
                          {shouldShowCallButton(message) && (
                            <div className="-mx-3 -mb-3 mt-3 border-t border-gray-200">
                              <button
                                onClick={handleCallNowClick}
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 hover:bg-blue-100 rounded-b-lg transition-colors duration-200"
                              >
                                <Phone className="w-4 h-4 text-blue-500" />
                                <span className="text-blue-500 font-medium">Call Now</span>
                              </button>
                            </div>
                          )}

                        </div>
                        <span className={`text-xs text-gray-500 mt-1 block ${message.isUser ? "text-right" : ""}`}>
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Voice Call Button Bubble - Appears after Arya's voice call message */}
              {filteredMessages.some(message => shouldShowVoiceCallBubble(message)) && (
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                      AP
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">~Arya Prajida</span>
                      </div>
                      <div className="p-3 rounded-lg shadow-sm max-w-md bg-green-500 text-white">
                        <button
                          onClick={handleVoiceCallClick}
                          className="flex items-center justify-center gap-2 w-full py-2 px-3 hover:bg-green-600 rounded transition-colors duration-200"
                        >
                          <Phone className="w-4 h-4 text-white" />
                          <span className="font-medium">Panggil Arya Prajida</span>
                        </button>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${typingUserInfo.bgColor} text-sm`}>
                      {typingUserInfo.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">~{typingUserInfo.name}</span>
                      </div>
                      <div className="p-3 rounded-lg shadow-sm max-w-md bg-white text-gray-700">
                        <div className="flex items-center gap-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">Mia sedang mengetik...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Invisible div for auto-scroll */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Input
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value)
                // Reset auto-fill state when user manually edits
                if (isAutoFilled && e.target.value !== messageInput) {
                  setIsAutoFilled(false)
                }
              }}
              onKeyPress={handleKeyPress}
              placeholder={inputPlaceholder}
              className={`flex-1 ${
                isAutoFilled 
                  ? 'border-green-500 bg-green-50 focus:border-green-600 focus:ring-green-200' 
                  : ''
              }`}
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              className={isAutoFilled ? 'bg-green-600 hover:bg-green-700' : ''}
            >
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
