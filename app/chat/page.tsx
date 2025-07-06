"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { ChatList } from "@/components/chat-list"
import { ChatEmptyState } from "@/components/chat-empty-state"
import { ActiveChat } from "@/components/active-chat"
import { ContactSelection } from "@/components/contact-selection"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [showContactSelection, setShowContactSelection] = useState(false)
  const [isContactAnimating, setIsContactAnimating] = useState(false)

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId)
    setShowContactSelection(false)
  }

  const handleAddNewChat = () => {
    setIsContactAnimating(true)
    setShowContactSelection(true)
  }

  const handleCloseContactSelection = () => {
    setIsContactAnimating(false)
    setTimeout(() => setShowContactSelection(false), 300)
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex relative -mt-8 px-6 pb-6">
        {/* Add New Chat Button */}
        <div className="absolute top-4 right-12 z-10">
          <Button onClick={handleAddNewChat} className="bg-gray-800 hover:bg-gray-700 text-white">
            Tambah Chat Baru
          </Button>
        </div>

        <ChatList selectedChat={selectedChat} onChatSelect={handleChatSelect} />

        <div className="flex-1 flex flex-col">
          {/* Main Content */}
          {showContactSelection ? (
            <ContactSelection onClose={handleCloseContactSelection} isAnimating={isContactAnimating} />
          ) : selectedChat ? (
            <ActiveChat chatId={selectedChat} />
          ) : (
            <ChatEmptyState />
          )}
        </div>
      </div>
    </Layout>
  )
}
