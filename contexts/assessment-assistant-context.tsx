"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"

interface Message {
  id: string
  text: string
  isBot: boolean
  type: "user" | "bot" | "reminder" | "tutorial"
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

const tutorialMessages = [
  "Halo Bapak Dwiky Cahyo, dan selamat datang di hari pertama Anda bersama Amboja!",
  "Saya adalah AI Assistant yang ditugaskan untuk membantu Anda dalam sesi Asesmen ini. Silakan bertanya apa pun kepada saya kapan pun Anda butuh bantuan.",
  "Di Amboja, kami percaya pada kekuatan kolaborasi, termasuk kolaborasi antara manusia dan AI.",
  "Dalam PortrAI, Anda didorong untuk memanfaatkan teknologi AI dalam menyelesaikan pekerjaan Anda.",
  "Serta, kami mengerti bahwa beradaptasi di lingkungan baru adalah sebuah tantangan. Oleh karena itu, kami ingin memastikan Anda mendapatkan dukungan penuh sejak awal.",
  "Kami percaya bahwa masa depan dunia kerja (Future of Work) adalah tentang bagaimana kita bisa beradaptasi dan memanfaatkan informasi dengan cepat dan tepat dengan bantuan teknologi.",
  "Sebagai langkah awal, apakah Anda ingin mengetahui lebih detail tentang Amboja dan nilai-nilai yang kami anut?"
]

interface AssessmentAssistantContextType {
  messages: Message[]
  isOpen: boolean
  hasNewMessage: boolean
  isTutorialActive: boolean
  tutorialStep: number
  isTyping: boolean
  addMessage: (message: Message) => void
  addUserMessage: (text: string) => void
  addBotResponse: (userMessage: string) => void
  addReminderMessage: (text: string) => void
  setIsOpen: (isOpen: boolean) => void
  setHasNewMessage: (hasNew: boolean) => void
  clearMessages: () => void
  getBotResponse: (userMessage: string) => string
  startTutorial: () => void
  handleTutorialResponse: (userMessage: string) => void
}

const AssessmentAssistantContext = createContext<AssessmentAssistantContextType | undefined>(undefined)

export function AssessmentAssistantProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [isTutorialActive, setIsTutorialActive] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

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

  const startTutorial = useCallback(() => {
    setIsTutorialActive(true)
    setTutorialStep(0)
    setHasNewMessage(true)
    
    // Clear existing messages except the initial one
    setMessages(initialMessages)
    
    // Start sending tutorial messages with delays
    tutorialMessages.forEach((message, index) => {
      setTimeout(() => {
        setIsTyping(true)
        
        // Simulate typing delay
        setTimeout(() => {
          const tutorialMessage: Message = {
            id: `tutorial-${index + 1}`,
            text: message,
            isBot: true,
            type: "tutorial",
            timestamp: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          }
          addMessage(tutorialMessage)
          setIsTyping(false)
          setTutorialStep(index + 1)
          
          // If this is the last message, allow user interaction
          if (index === tutorialMessages.length - 1) {
            setIsTutorialActive(false)
          }
        }, 1500) // Typing delay
      }, index * 3000) // Delay between messages
    })
  }, [addMessage])

  const handleTutorialResponse = useCallback((userMessage: string) => {
    const message = userMessage.toLowerCase()
    let response: string
    
    if (message.includes("ya") || message.includes("iya") || message.includes("baik") || message.includes("setuju")) {
      response = "Baik. Karena ini adalah hari pertama Anda, saya akan segera memberitahu tim HR untuk menghubungi Anda langsung melalui Email. Mereka akan menyapa Anda sebentar lagi untuk proses selanjutnya."
    } else {
      response = "Baik. Namun, karena ini adalah hari pertama Anda, saya akan segera memberitahu tim HR untuk menghubungi Anda langsung melalui Email. Mereka akan menyapa Anda sebentar lagi untuk proses selanjutnya."
    }
    
    // Send the response after a short delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: `tutorial-response-${Date.now()}`,
        text: response,
        isBot: true,
        type: "tutorial",
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }
      addMessage(responseMessage)
      setHasNewMessage(true)
    }, 1000)
  }, [addMessage])

  const value: AssessmentAssistantContextType = {
    messages,
    isOpen,
    hasNewMessage,
    isTutorialActive,
    tutorialStep,
    isTyping,
    addMessage,
    addUserMessage,
    addBotResponse,
    addReminderMessage,
    setIsOpen,
    setHasNewMessage,
    clearMessages,
    getBotResponse,
    startTutorial,
    handleTutorialResponse,
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
