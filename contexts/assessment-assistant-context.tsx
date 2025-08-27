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
  "Halo Bapak Dwiky Cahyo, ini adalah hari pertama Anda bekerja bersama Amboja! Saya adalah AI Assistant yang akan menjadi rekan kerja virtual untuk memandu Anda dalam sesi Prework ini.",
  "Ini adalah langkah awal dari perjalanan Anda. Apakah Anda sudah siap untuk memulai?"
]

const tutorialContinuationMessages = [
  "Di Amboja, kami percaya pada kekuatan kolaborasi, termasuk kolaborasi antara manusia dan AI.",
  "Anda dianjurkan untuk memanfaatkan teknologi AI dalam menyelesaikan pekerjaan Anda dengan lebih efektif.",
  "Konsep ini cukup jelas ya, Bapak?"
]

interface AssessmentAssistantContextType {
  messages: Message[]
  isOpen: boolean
  hasNewMessage: boolean
  isTutorialActive: boolean
  tutorialStep: number
  isTyping: boolean
  conversationPhase: 'initial' | 'readiness_check' | 'collaboration_intro' | 'clarity_check' | 'completion'
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
  const [conversationPhase, setConversationPhase] = useState<'initial' | 'readiness_check' | 'collaboration_intro' | 'clarity_check' | 'completion'>('initial')

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
    setConversationPhase('initial')
    
    // Clear existing messages except the initial one
    setMessages(initialMessages)
    
    // Send the first tutorial message immediately
    setTimeout(() => {
      setIsTyping(true)
      
      setTimeout(() => {
        const tutorialMessage: Message = {
          id: `tutorial-1`,
          text: tutorialMessages[0],
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
        setTutorialStep(1)
        
        // Send the second message (readiness question) after a delay
        setTimeout(() => {
          setIsTyping(true)
          
          setTimeout(() => {
            const readinessMessage: Message = {
              id: `tutorial-2`,
              text: tutorialMessages[1],
              isBot: true,
              type: "tutorial",
              timestamp: new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
            }
            addMessage(readinessMessage)
            setIsTyping(false)
            setTutorialStep(2)
            setConversationPhase('readiness_check')
            setIsTutorialActive(false) // Allow user to respond
          }, 1500)
        }, 2000)
      }, 1500)
    }, 500)
  }, [addMessage])

  const handleTutorialResponse = useCallback((userMessage: string) => {
    const message = userMessage.toLowerCase()
    const isPositiveResponse = message.includes("ya") || message.includes("iya") || message.includes("baik") || message.includes("setuju") || message.includes("siap")
    
    if (conversationPhase === 'readiness_check' && isPositiveResponse) {
      // Continue to collaboration introduction
      setConversationPhase('collaboration_intro')
      setIsTutorialActive(true)
      
      // Send the collaboration messages
      tutorialContinuationMessages.forEach((messageText, index) => {
        setTimeout(() => {
          setIsTyping(true)
          
          setTimeout(() => {
            const tutorialMessage: Message = {
              id: `tutorial-continuation-${index + 1}`,
              text: messageText,
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
            setTutorialStep(3 + index)
            
            // If this is the last message (clarity check), allow user interaction
            if (index === tutorialContinuationMessages.length - 1) {
              setConversationPhase('clarity_check')
              setIsTutorialActive(false)
            }
          }, 1500)
        }, (index + 1) * 3000)
      })
    } else if (conversationPhase === 'clarity_check' && isPositiveResponse) {
      // Final completion message
      setConversationPhase('completion')
      
      setTimeout(() => {
        setIsTyping(true)
        
        setTimeout(() => {
          const finalMessage: Message = {
            id: `tutorial-final`,
            text: "Baik. Kalau begitu, sebagai langkah selanjutnya, saya akan langsung informasikan tim HR untuk menghubungi Anda melalui Chat. Mereka akan segera menyapa Anda untuk memulai proses onboarding.",
            isBot: true,
            type: "tutorial",
            timestamp: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          }
          addMessage(finalMessage)
          setIsTyping(false)
          setHasNewMessage(true)
        }, 1500)
      }, 1000)
    }
  }, [conversationPhase, addMessage])

  const value: AssessmentAssistantContextType = {
    messages,
    isOpen,
    hasNewMessage,
    isTutorialActive,
    tutorialStep,
    isTyping,
    conversationPhase,
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
