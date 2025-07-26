"use client"

import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip" // Import Tooltip components

// Define the Chat interface (copied from app/chat/page.tsx for clarity)
interface Chat {
  id: string
  name: string
  avatar: string | null
  lastMessage: string
  time: string
  isGroup: boolean
  role?: string // Add role
  simulationContext?: string | null // Add simulation context
}

interface ActiveChatProps {
  chatId: string
  chats: Chat[] // Now receives chats as a prop
}

// Extended chat data for existing chats (messages)
const detailedChatData = {
  "ezra-kaell-s24": {
    name: "Ezra Kaell",
    avatar: "EK",
    status: "Online",
    role: "AVP of Earth Operation",
    simulationContext: "Peluang Sponsorship S24",
    messages: [
      {
        id: 1,
        sender: "Ezra Kaell",
        content:
          "Poin yang sangat penting. Saya akan coba ajukan alternatif yang minim biaya, misalnya memakai aset internal dan fasilitator dari tim kita sendiri. Saya juga akan menyusun jadwal yang menghindari jam-jam sibuk, jadi tidak menambah tekanan kerja.",
        time: "10:45 AM",
        isOwn: false,
      },
    ],
  },
  "ezra-kaell-amboja": {
    name: "Ezra Kaell",
    avatar: "EK",
    status: "Online",
    role: "AVP of Earth Operation",
    simulationContext: "Branding Amboja",
    messages: [
      {
        id: 1,
        sender: "Ezra Kaell",
        content: "Baik, saya akan pastikan semua detail dikomunikasikan dengan baik kepada seluruh tim.",
        time: "11:30 AM",
        isOwn: false,
      },
    ],
  },
  "nero-atlas-project-x": {
    name: "Nero Atlas",
    avatar: "NA",
    status: "Online",
    role: "Production Manager of Food Processing ",
    simulationContext: "Project X Implementation",
    messages: [
      {
        id: 1,
        sender: "Nero Atlas",
        content: "Halo, mari kita diskusikan progres proyek X dan langkah selanjutnya.",
        time: "09:05 AM",
        isOwn: false,
      },
      {
        id: 2,
        sender: "You",
        content: "Tentu, saya siap. Ada beberapa poin yang ingin saya sampaikan terkait alokasi sumber daya.",
        time: "09:10 AM",
        isOwn: true,
      },
    ],
  },
}

export function ActiveChat({ chatId, chats }: ActiveChatProps) {
  // Find the chat from the provided chats array
  const chat = chats.find((c) => c.id === chatId)

  if (!chat) return null

  // Get detailed messages if available, otherwise provide a default for new chats
  const currentChatDetails = detailedChatData[chatId as keyof typeof detailedChatData] || {
    name: chat.name,
    avatar: chat.avatar,
    status: "Online", // Default status for new chats
    role: chat.role || "Contact", // Default role for new chats
    simulationContext: chat.simulationContext || null,
    messages: [
      {
        id: 0,
        sender: chat.name,
        content: "Mulai percakapan baru...",
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        isOwn: false,
      },
    ],
  }

  return (
    <TooltipProvider>
      {" "}
      {/* Wrap with TooltipProvider */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600">
              {currentChatDetails.avatar || (
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{currentChatDetails.name}</h2>
              {currentChatDetails.role && <p className="text-sm text-gray-600">{currentChatDetails.role}</p>}
              {currentChatDetails.simulationContext && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 mt-1">
                      Konteks: <strong className="ml-1">{currentChatDetails.simulationContext}</strong>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Konteks: {currentChatDetails.simulationContext}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 bg-gray-50">
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">Senin, 11 Jan</span>
          </div>

          {currentChatDetails.messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className={`flex items-start gap-3 ${message.isOwn ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                  {message.isOwn ? "You" : currentChatDetails.avatar}
                </div>
                <div className="flex-1">
                  <div className={`flex items-center gap-2 mb-1 ${message.isOwn ? "justify-end" : ""}`}>
                    <span className="text-sm font-medium text-gray-900">~{message.sender}</span>
                  </div>
                  <div
                    className={`p-3 rounded-lg shadow-sm max-w-md ${message.isOwn ? "bg-blue-500 text-white ml-auto" : "bg-white text-gray-700"}`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <span className={`text-xs text-gray-500 mt-1 block ${message.isOwn ? "text-right" : ""}`}>
                    {message.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Input placeholder="Ketik pesan Anda di sini..." className="flex-1" disabled />
            <Button size="icon" disabled>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
