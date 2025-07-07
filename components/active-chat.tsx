"use client"

import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Define the Chat interface (copied from app/chat/page.tsx for clarity)
interface Chat {
  id: string
  name: string
  avatar: string | null
  lastMessage: string
  time: string
  isGroup: boolean
}

interface ActiveChatProps {
  chatId: string
  chats: Chat[] // Now receives chats as a prop
}

// Extended chat data for existing chats (messages)
const detailedChatData = {
  "software-engineer": {
    name: "Software Engineer",
    avatar: "SE",
    status: "Online",
    messages: [
      {
        id: 1,
        sender: "Software Engineer",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris luctus aliquet rutrum. Integer quis facilisis ex.",
        time: "10:45 AM",
        isOwn: false,
      },
    ],
  },
  "product-designer": {
    name: "Product Designer",
    avatar: "PD",
    status: "Online",
    messages: [
      {
        id: 1,
        sender: "Product Designer",
        content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        time: "1:30 PM",
        isOwn: false,
      },
    ],
  },
  "earth-manufacturing": {
    name: "Earth Manufacturing",
    avatar: null,
    status: "Group Chat",
    messages: [
      {
        id: 1,
        sender: "John Doe",
        content: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        time: "2:45 PM",
        isOwn: false,
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
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{currentChatDetails.status}</span>
            </div>
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
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                {currentChatDetails.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">~{message.sender}</span>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm max-w-md">
                  <p className="text-gray-700">{message.content}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">{message.time}</span>
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
  )
}
