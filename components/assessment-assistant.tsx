"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bot, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Ada yang bisa saya bantu?",
    isBot: true,
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

interface AssessmentAssistantProps {
  isOpen: boolean
  onToggle: () => void
}

export function AssessmentAssistant({ isOpen, onToggle }: AssessmentAssistantProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("assessment-assistant-messages")
      return saved ? JSON.parse(saved) : initialMessages
    }
    return initialMessages
  })
  const [inputValue, setInputValue] = useState("")

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("assessment-assistant-messages", JSON.stringify(messages))
    }
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
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
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        isBot: true,
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
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
            onClick={onToggle}
            className="p-1 h-6 w-6 text-gray-300 hover:text-white hover:bg-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
            <div className="max-w-[80%]">
              {message.isBot && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              )}
              <div
                className={`p-3 rounded-lg ${message.isBot ? "bg-gray-700 text-gray-100" : "bg-blue-500 text-white"}`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-600 bg-gray-800 rounded-b-[12px]">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan Anda..."
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
          />
          <Button onClick={handleSendMessage} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white p-2">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AssessmentAssistantButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg text-gray-700 hover:text-gray-900"
    >
      <Bot className="w-5 h-5 text-blue-600" />
      <span className="text-sm font-medium">AI Assistant</span>
    </Button>
  )
}
