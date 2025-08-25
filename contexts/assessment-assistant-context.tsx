"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"

interface Message {
  id: string
  text: string
  isBot: boolean
  type: "user" | "bot" | "reminder"
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Ada yang bisa saya bantu?",
    isBot: true,
    type: "bot",
    timestamp: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  },
]

const botResponses = {
  default: "Maaf, saya belum memahami pertanyaan Anda. Bisakah Anda menjelaskan lebih detail?",
  greeting: "Halo! Saya Assessment Assistant. Saya di sini untuk membantu Anda menggunakan platform ini.",
  navigation: "Anda dapat menggunakan sidebar di sebelah kiri untuk navigasi ke Beranda, Chat, Email, atau Documents.",
  email:
    "Di halaman Email, Anda dapat membaca, membalas, dan meneruskan email. Gunakan tombol Tulis untuk menulis email baru.",
  documents:
    "Di halaman Documents, Anda dapat melihat folder dan file. Klik folder untuk melihat isinya, atau klik file untuk membacanya.",
  chat: "Di halaman Chat, Anda dapat berkomunikasi dengan rekan kerja. Pilih kontak dari daftar untuk memulai percakapan.",
  help: "Saya dapat membantu Anda dengan navigasi, penggunaan email, manajemen dokumen, dan fitur chat. Apa yang ingin Anda ketahui?",
}

interface AssessmentAssistantContextType {
  messages: Message[]
  isOpen: boolean
  hasNewMessage: boolean
  addMessage: (message: Message) => void
  addUserMessage: (text: string) => void
  addBotResponse: (userMessage: string) => void
  addReminderMessage: (text: string) => void
  setIsOpen: (isOpen: boolean) => void
  setHasNewMessage: (hasNew: boolean) => void
  clearMessages: () => void
  getBotResponse: (userMessage: string) => string
}

const AssessmentAssistantContext = createContext<AssessmentAssistantContextType | undefined>(undefined)

export function AssessmentAssistantProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
  }, [])

  const addUserMessage = useCallback((text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      type: "user",
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }
    addMessage(userMessage)
  }, [addMessage])

  const addBotResponse = useCallback((userMessage: string) => {
    const botResponse = getBotResponse(userMessage)
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      isBot: true,
      type: "bot",
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }
    addMessage(botMessage)
    setHasNewMessage(true)
  }, [addMessage])

  const addReminderMessage = useCallback((text: string) => {
    const reminderMessage: Message = {
      id: (Date.now() + 2).toString(),
      text,
      isBot: true,
      type: "reminder",
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }
    addMessage(reminderMessage)
    setHasNewMessage(true)
  }, [addMessage])

  const clearMessages = useCallback(() => {
    setMessages(initialMessages)
  }, [])

  const getBotResponse = useCallback((userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("halo") || message.includes("hai") || message.includes("hello")) {
      return botResponses.greeting
    } else if (message.includes("navigasi") || message.includes("menu") || message.includes("sidebar")) {
      return botResponses.navigation
    } else if (message.includes("email") || message.includes("surat")) {
      return botResponses.email
    } else if (message.includes("dokumen") || message.includes("file") || message.includes("folder")) {
      return botResponses.documents
    } else if (message.includes("chat") || message.includes("pesan")) {
      return botResponses.chat
    } else if (message.includes("bantuan") || message.includes("help") || message.includes("tolong")) {
      return botResponses.help
    } else {
      return botResponses.default
    }
  }, [])

  const value: AssessmentAssistantContextType = {
    messages,
    isOpen,
    hasNewMessage,
    addMessage,
    addUserMessage,
    addBotResponse,
    addReminderMessage,
    setIsOpen,
    setHasNewMessage,
    clearMessages,
    getBotResponse,
  }

  return (
    <AssessmentAssistantContext.Provider value={value}>
      {children}
    </AssessmentAssistantContext.Provider>
  )
}

export function useAssessmentAssistant() {
  const context = useContext(AssessmentAssistantContext)
  if (context === undefined) {
    throw new Error("useAssessmentAssistant must be used within an AssessmentAssistantProvider")
  }
  return context
}
