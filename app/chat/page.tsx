"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { ChatList } from "@/components/chat-list"
import { ChatEmptyState } from "@/components/chat-empty-state"
import { ActiveChat } from "@/components/active-chat"
import { ContactSelection } from "@/components/contact-selection"

// Define the Chat interface to match existing chat data structure
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

// Initial hardcoded chats (moved from chat-list.tsx)
const initialChats: Chat[] = [
  {
    id: "ezra-kaell-s24",
    name: "Ezra Kaell",
    avatar: "EK",
    lastMessage: "Poin yang sangat penting. Saya akan coba ajukan...",
    time: "10:00 AM",
    isGroup: false,
    role: "AVP of Earth Operation",
    simulationContext: "Peluang Sponsorship S24",
  },
  {
    id: "ezra-kaell-amboja",
    name: "Ezra Kaell",
    avatar: "EK",
    lastMessage: "Baik, saya akan pastikan semua detail dikomunikasikan...",
    time: "11:30 AM",
    isGroup: false,
    role: "AVP of Earth Operation",
    simulationContext: "Branding Amboja",
  },
  {
    id: "nero-atlas-project-x",
    name: "Nero Atlas",
    avatar: "NA",
    lastMessage: "Mari kita diskusikan progres proyek.",
    time: "09:00 AM",
    isGroup: false,
    role: "Production Manager of Food Processing ",
    simulationContext: "Project X Implementation",
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
  const handleSelectAndCloseContactSelection = (
    contact: { name: string; email: string; avatar: string; role?: string; simulationContext?: string | null } | null,
  ) => {
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
            role: contact.role || "New Contact", // Default role for new contacts
            simulationContext: contact.simulationContext || null,
          }
          setChats((prevChats) => [newChat, ...prevChats]) // Add to beginning of array
          setSelectedChat(newChatId)
        }
      }
    }, 300)
  }

  return (
    <Layout>
        <div className="h-[calc(100vh-120px)] flex relative px-6 pb-6">
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
            onAddNewChat={handleAddNewChat}
          />

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
