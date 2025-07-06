"use client"

import { Users } from "lucide-react"

interface ChatListProps {
  selectedChat: string | null
  onChatSelect: (chatId: string) => void
}

const chats = [
  {
    id: "software-engineer",
    name: "Software Engineer",
    avatar: "SE",
    lastMessage: "Sed do eiusmod tempor incididunt",
    time: "12:00 PM",
    isGroup: false,
  },
  {
    id: "product-designer",
    name: "Product Designer",
    avatar: "PD",
    lastMessage: "Ut enim ad minim veniam",
    time: "1:30 PM",
    isGroup: false,
  },
  {
    id: "earth-manufacturing",
    name: "Earth Manufacturing",
    avatar: null,
    lastMessage: "Quis nostrud exercitation ullamco",
    time: "2:45 PM",
    isGroup: true,
  },
]

export function ChatList({ selectedChat, onChatSelect }: ChatListProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
      </div>

      <div className="overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedChat === chat.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600">
                {chat.isGroup ? (
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  chat.avatar
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-sm text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
