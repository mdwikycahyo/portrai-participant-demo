"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { ChatList } from "@/components/chat-list"
import { ChatEmptyState } from "@/components/chat-empty-state"
import { ActiveChat } from "@/components/active-chat"
import { ContactSelection } from "@/components/contact-selection"
import { Button } from "@/components/ui/button"

// Define the Chat interface to match existing chat data structure
interface Chat {
  id: string
  name: string
  avatar: string | null
  lastMessage: string
  time: string
  isGroup: boolean
}

// Initial hardcoded chats (moved from chat-list.tsx)
const initialChats: Chat[] = [
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

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(initialChats) // Manage chats in state
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [showContactSelection, setShowContactSelection] = useState(false)
  const [isContactAnimating, setIsContactAnimating] = useState(false)

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId)
    setShowContactSelection(false)
  }

  const handleAddNewChat = () => {
    setShowContactSelection(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsContactAnimating(true)
      })
    })
  }

  // This function now handles both closing and selecting a contact
  const handleSelectAndCloseContactSelection = (contact: { name: string; email: string; avatar: string } | null) => {
    setIsContactAnimating(false)
    setTimeout(() => {
      setShowContactSelection(false)
      if (contact) {
        // Check if chat with this contact already exists
        const existingChat = chats.find((chat) => chat.name === contact.name && !chat.isGroup)
        if (existingChat) {
          setSelectedChat(existingChat.id)
        } else {
          // Create a new chat entry and add it to the beginning of the list
          const newChatId = `chat-${Date.now()}` // Simple unique ID
          const newChat: Chat = {
            id: newChatId,
            name: contact.name,
            avatar: contact.avatar,
            lastMessage: "Mulai percakapan baru...",
            time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            isGroup: false,
          }
          setChats((prevChats) => [newChat, ...prevChats]) // Add to beginning of array
          setSelectedChat(newChatId)
        }
      }
    }, 300)
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex relative -mt-8 px-6 pb-6">
        {/* Add New Chat Button */}
        <div className="absolute top-4 right-12 z-1">
          <Button onClick={handleAddNewChat} className="bg-gray-800 hover:bg-gray-700 text-white">
            Tambah Chat Baru
          </Button>
        </div>

        <ChatList chats={chats} selectedChat={selectedChat} onChatSelect={handleChatSelect} />

        <div className="flex-1 flex flex-col">
          {/* Main Content */}
          {showContactSelection && (
            <ContactSelection onClose={handleSelectAndCloseContactSelection} isAnimating={isContactAnimating} />
          )}
          {!showContactSelection && selectedChat ? (
            <ActiveChat chatId={selectedChat} chats={chats} /> // Pass the chats array
          ) : (
            !showContactSelection && <ChatEmptyState />
          )}
        </div>
      </div>
    </Layout>
  )
}
