"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, X, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { Channel } from "@/lib/messenger-data"
import { useAssessmentAssistant } from "@/contexts/assessment-assistant-context"

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
  const [messages, setMessages] = useState(channel.messages)
  const [isTyping, setIsTyping] = useState(false)
  const [hasLoadedInitialMessages, setHasLoadedInitialMessages] = useState(false)
  const [conversationStage, setConversationStage] = useState<'initial' | 'waiting_for_response' | 'responded' | 'mission_phase'>('initial')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { onboardingEmailSent, triggerOnboardingEmail, markMiaAsInteracted } = useAssessmentAssistant()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update messages when channel changes
  useEffect(() => {
    setMessages(channel.messages)
    setHasLoadedInitialMessages(false) // Reset when channel changes
    setConversationStage('initial') // Reset conversation stage
  }, [channel.messages])

  // Auto-load remaining messages for onboarding channel
  useEffect(() => {
    if (
      channel.id === "onboarding-channel" && 
      selectedParticipant?.name === "Mia Avira" && 
      !hasLoadedInitialMessages
    ) {
      // Double-check we only have the initial message to prevent duplicates
      const initialMessageCount = messages.filter(msg => !msg.isUser).length
      const hasWelcomeMessage = messages.some(msg => msg.content.includes("Selamat datang di Amboja"))
      const hasQuestionMessage = messages.some(msg => msg.content.includes("Bagaimana sejauh ini"))
      
      if (initialMessageCount === 1 && !hasWelcomeMessage && !hasQuestionMessage) {
        setHasLoadedInitialMessages(true)
      
      // Define the remaining messages with truly unique IDs
      const baseTimestamp = Date.now()
      const remainingMessages = [
        {
          id: `onboarding-auto-${baseTimestamp}-${Math.random().toString(36).substring(2)}-1`,
          senderName: "Mia Avira",
          senderAvatar: "MA",
          content: "Selamat datang di Amboja. Saya turut senang akhirnya Anda bergabung dengan tim kami hari ini.",
          isUser: false,
        },
        {
          id: `onboarding-auto-${baseTimestamp}-${Math.random().toString(36).substring(2)}-2`,
          senderName: "Mia Avira",
          senderAvatar: "MA",
          content: "Bagaimana sejauh ini? Apakah sesi perkenalan dengan AI Assistant kami cukup membantu?",
          isUser: false,
        }
      ]

      // Simulate typing for each message
      remainingMessages.forEach((message, index) => {
        setTimeout(() => {
          // Start typing
          setIsTyping(true)
          
          // After typing delay, add message
          setTimeout(() => {
            const messageWithTimestamp = {
              ...message,
              timestamp: new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
            }
            setMessages((prev) => [...prev, messageWithTimestamp])
            setIsTyping(false)
            
            // Update conversation stage when the question is asked
            if (index === 1) { // The second message in the array (index 1) is the question
              setConversationStage('waiting_for_response')
            }
          }, 2000) // 2 second typing delay
        }, index * 3000) // Stagger messages by 3 seconds
      })
      }
    }
  }, [channel.id, selectedParticipant?.name, hasLoadedInitialMessages])

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

      // Add user message
      setMessages((prev) => [...prev, userMessage])
      setMessageInput("")

      // Handle onboarding flow responses from Mia Avira
      if (channel.id === "onboarding-channel" && selectedParticipant?.name === "Mia Avira") {
        setConversationStage('responded')
        markMiaAsInteracted() // Mark that user has interacted with Mia
        handleMiaAviraResponse(userMessage.content)
      }
    }
  }

  const handleMiaAviraResponse = (userMessage: string) => {
    // Check if user responded positively and if this is their first response to Mia's question
    // Note: We add 1 because this function is called before the user message is added to the array
    const userResponses = messages.filter(msg => msg.isUser).length + 1
    const isFirstResponse = userResponses === 1 // This is the first user response
    const isPositiveResponse = /\b(ya|iya|baik|setuju|bagus|membantu|sangat|positif|terbantu)\b/i.test(userMessage.toLowerCase())
    
    if (isFirstResponse && isPositiveResponse) {
      // Send follow-up messages from Mia
      setTimeout(() => {
        const thanksMessage = {
          id: `msg-mia-thanks-${Date.now()}`,
          senderName: "Mia Avira",
          senderAvatar: "MA",
          content: "Baik, terima kasih atas jawaban anda.",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          isUser: false,
        }
        setMessages((prev) => [...prev, thanksMessage])

        // Second message about first mission
        setTimeout(() => {
          const missionIntroMessage = {
            id: `msg-mia-mission-intro-${Date.now()}`,
            senderName: "Mia Avira",
            senderAvatar: "MA",
            content: "Sebagai bagian dari onboarding, saya ingin memberikan Anda sebuah misi pertama. Ini akan membantu Anda terbiasa dengan alur kerja dan platform kita.",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            isUser: false,
          }
          setMessages((prev) => [...prev, missionIntroMessage])

          // Third message about email
          setTimeout(() => {
            const emailMessage = {
              id: `msg-mia-email-${Date.now()}`,
              senderName: "Mia Avira",
              senderAvatar: "MA",
              content: "Saya baru saja mengirimkan email dengan judul **'Misi Pertama Anda di Amboja'**. Bisa tolong cek dan kabari saya melalui fitur chat ini jika sudah Anda terima?",
              timestamp: new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              isUser: false,
            }
            setMessages((prev) => [...prev, emailMessage])
            
            // Trigger email sending after the email message is sent
            setTimeout(() => {
              triggerOnboardingEmail() // This will trigger the email to appear
              setConversationStage('mission_phase')
            }, 1000)
          }, 2000)
        }, 2000)
      }, 1500)
    } else if (isFirstResponse && !isPositiveResponse) {
      // Handle non-positive response
      setTimeout(() => {
        const clarificationMessage = {
          id: `msg-mia-clarification-${Date.now()}`,
          senderName: "Mia Avira",
          senderAvatar: "MA",
          content: "Terima kasih atas feedback Anda. Jika ada hal yang perlu diperbaiki dari AI Assistant kami, tim akan mengevaluasinya. Mari kita lanjutkan dengan proses onboarding.",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          isUser: false,
        }
        setMessages((prev) => [...prev, clarificationMessage])
        
        // Continue with mission introduction after acknowledgment
        setTimeout(() => {
          const missionIntroMessage = {
            id: `msg-mia-mission-intro-alt-${Date.now()}`,
            senderName: "Mia Avira",
            senderAvatar: "MA",
            content: "Sebagai bagian dari onboarding, saya ingin memberikan Anda sebuah misi pertama. Ini akan membantu Anda terbiasa dengan alur kerja dan platform kita.",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            isUser: false,
          }
          setMessages((prev) => [...prev, missionIntroMessage])

          // Email message
          setTimeout(() => {
            const emailMessage = {
              id: `msg-mia-email-alt-${Date.now()}`,
              senderName: "Mia Avira",
              senderAvatar: "MA",
              content: "Saya baru saja mengirimkan email dengan judul **'Misi Pertama Anda di Amboja'**. Bisa tolong cek dan kabari saya melalui fitur chat ini jika sudah Anda terima?",
              timestamp: new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              isUser: false,
            }
            setMessages((prev) => [...prev, emailMessage])
            
            // Trigger email sending
            setTimeout(() => {
              triggerOnboardingEmail()
              setConversationStage('mission_phase')
            }, 1000)
          }, 2000)
        }, 2000)
      }, 1500)
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

  // Check if message should have call button
  const shouldShowCallButton = (message: any) => {
    return (
      message.senderName === "Ezra Kaell" &&
      (message.content.includes("Bisa kita discuss proposal sponsorship ini via call saja?") ||
        message.content.includes("Bisa kita lanjutkan di sini atau coba call lagi")) &&
      channel.name === "Peluang Sponsorship S24"
    )
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
        <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
          {messages.length === 0 ? (
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

              {messages.map((message) => (
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
                          <p dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
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

              {/* Typing Indicator */}
              {isTyping && (
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                      MA
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">~Mia Avira</span>
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
