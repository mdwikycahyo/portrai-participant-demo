"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Bot, X, Send, Bell, RotateCcw, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAssessmentAssistant } from "@/contexts/assessment-assistant-context"
import { useToast } from "@/hooks/use-toast"

interface AssessmentAssistantProps {
  isOpen: boolean
  onToggle: () => void
  externalMessage?: { text: string; type: "reminder" } | null
  onNewMessageReceived?: () => void
  onChatOpened?: () => void
}

export function AssessmentAssistant({
  isOpen,
  onToggle,
  externalMessage,
  onNewMessageReceived,
  onChatOpened,
}: AssessmentAssistantProps) {
  const {
    messages,
    addUserMessage,
    addBotResponse,
    addReminderMessage,
    setHasNewMessage,
    isTutorialActive,
    tutorialStep,
    isTyping,
    conversationPhase,
    tutorialPendingStart,
    handleTutorialResponse,
    resetTutorialProgress,
    startDeferredTutorialMessages,
    documentEditorPage,
    documentEditorTitle,
  } = useAssessmentAssistant()
  
  const [inputValue, setInputValue] = useState("")
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Create a ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Function to scroll to bottom smoothly
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    })
  }

  // Scroll to bottom when component opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the component is fully rendered
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  // Scroll to bottom when typing animation starts
  useEffect(() => {
    if (isOpen && isTyping) {
      scrollToBottom()
    }
  }, [isTyping, isOpen])

  // Handle external messages (from Layout, e.g., banner triggers)
  useEffect(() => {
    if (externalMessage && externalMessage.text) {
      addReminderMessage(externalMessage.text)
      if (onNewMessageReceived) {
        onNewMessageReceived()
      }
    }
  }, [externalMessage, onNewMessageReceived, addReminderMessage])

  // Notify parent when chat is opened
  useEffect(() => {
    if (isOpen && onChatOpened) {
      onChatOpened()
    }
  }, [isOpen, onChatOpened])

  // Trigger deferred tutorial messages when panel is opened for the first time
  useEffect(() => {
    if (isOpen && tutorialPendingStart) {
      startDeferredTutorialMessages()
    }
  }, [isOpen, tutorialPendingStart, startDeferredTutorialMessages])

  // Auto-fill input based on conversation phase and document editor conditions
  useEffect(() => {
    if (conversationPhase === 'readiness_check' && !isTutorialActive && !isTyping) {
      setInputValue("Ya, saya sudah siap untuk memulai")
    } else if (conversationPhase === 'clarity_check' && !isTutorialActive && !isTyping) {
      setInputValue("Ya, jelas")
    } else if (
      documentEditorPage === '/documents/editor' && 
      documentEditorTitle === 'Apa yang Saya Ketahui Tentang Amboja' && 
      !isTutorialActive && 
      !isTyping &&
      isOpen
    ) {
      setInputValue("Bisakah Anda rangkum profil perusahaan Amboja?")
    }
  }, [conversationPhase, isTutorialActive, isTyping, documentEditorPage, documentEditorTitle, isOpen])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addUserMessage(inputValue)
    const currentInput = inputValue
    setInputValue("")

    // Check if we're in a tutorial phase that expects user response
    if ((conversationPhase === 'readiness_check' || conversationPhase === 'clarity_check') && !isTutorialActive) {
      handleTutorialResponse(currentInput)
      return
    }

    // Normal bot response (for non-tutorial interactions)
    if (conversationPhase === 'completion' || conversationPhase === 'initial') {
      setTimeout(() => {
        addBotResponse(currentInput)
        if (onNewMessageReceived) {
          onNewMessageReceived()
        }
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  // Copy to clipboard functionality
  const handleCopyMessage = async (messageText: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(messageText)
      setCopiedMessageId(messageId)
      toast({
        title: "Copied to clipboard",
        description: "Message has been copied successfully",
      })
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null)
      }, 2000)
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy message to clipboard",
        variant: "destructive",
      })
    }
  }

  // Format message text for better readability
  const formatMessageText = (text: string) => {
    // Convert **text** to bold
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Preserve line breaks and add proper spacing
    formatted = formatted.replace(/\n/g, '<br/>')
    
    // Add extra spacing for better readability in bullet points
    formatted = formatted.replace(/^- /gm, '• ')
    
    return formatted
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-1 top-1 bottom-1 h-[calc(100%-0.3rem*2)] w-80 bg-gray-800 border border-gray-600 shadow-lg flex flex-col z-40 rounded-[12px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600 bg-gray-700 rounded-t-[12px]">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-gray-300" />
          <span className="font-medium text-white">Assessment Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTutorialProgress}
            className="p-1 h-6 w-6 text-gray-300 hover:text-white hover:bg-gray-600"
            title="Reset Tutorial Progress"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1 h-6 w-6 text-gray-300 hover:text-white hover:bg-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800"
      >
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
            <div className="max-w-[80%]">
              {message.isBot && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    {message.type === "reminder" ? (
                      <Bell className="w-4 h-4 text-yellow-300" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                </div>
              )}
              <div className="relative group">
                <div
                  className={`p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : message.type === "reminder"
                        ? "bg-indigo-800 text-white"
                        : "bg-green-800 text-white"
                  }`}
                >
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMessageText(message.text) 
                    }}
                  />
                </div>
              </div>
              
              {/* Copy button and timestamp row */}
              <div className="flex items-center justify-between mt-1">
                {message.isBot ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyMessage(message.text, message.id)}
                    className="h-6 w-6 p-1 opacity-60 hover:opacity-100 transition-opacity bg-transparent hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                    title="Copy message"
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                ) : (
                  <div /> // Empty div to maintain layout for user messages
                )}
                <p className="text-xs text-gray-400">{message.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-300" />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-700 text-gray-100">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-600 bg-gray-800 rounded-b-[12px]">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isTutorialActive || isTyping 
                ? "Mohon tunggu..." 
                : conversationPhase === 'readiness_check' 
                  ? "Tekan Send untuk melanjutkan..."
                  : conversationPhase === 'clarity_check'
                    ? "Tekan Send untuk melanjutkan..."
                    : "Ketik pesan atau ketik 'Help'..."
            }
            disabled={isTutorialActive || isTyping}
            className={`flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              (conversationPhase === 'readiness_check' || conversationPhase === 'clarity_check') && !isTutorialActive && !isTyping
                ? 'border-green-500 bg-green-900/20' 
                : ''
            }`}
          />
          <Button 
            onClick={handleSendMessage} 
            size="sm" 
            disabled={isTutorialActive || isTyping}
            className={`text-white p-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              (conversationPhase === 'readiness_check' || conversationPhase === 'clarity_check') && !isTutorialActive && !isTyping
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface AssessmentAssistantButtonProps {
  onClick: () => void
  hasNewMessage?: boolean
}

export function AssessmentAssistantButton({ onClick, hasNewMessage = false }: AssessmentAssistantButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      className="relative flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg text-gray-700 hover:text-gray-900"
    >
      <Bot className="w-5 h-5 text-blue-600" />
      <span className="text-sm font-medium">AI Assistant</span>
      {hasNewMessage && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
    </Button>
  )
}
