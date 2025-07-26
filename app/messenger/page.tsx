"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { MessengerChannelList } from "@/components/messenger-channel-list"
import { ActiveMessengerChannel } from "@/components/active-messenger-channel"
import { MessengerEmptyState } from "@/components/messenger-empty-state"
import { ContactSelection } from "@/components/contact-selection"
import { messengerChannelsData, type Channel } from "@/lib/messenger-data"

interface ContactWithContext {
  name: string
  email: string
  avatar: string
  role: string
  simulationContext: string
}

export default function MessengerPage() {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)
  const [channels, setChannels] = useState<Channel[]>(messengerChannelsData)
  const [showContactSelection, setShowContactSelection] = useState(false)
  const [isContactAnimating, setIsContactAnimating] = useState(false)

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId)
  }

  const handleAddNewChannel = () => {
    setShowContactSelection(true)
    setTimeout(() => setIsContactAnimating(true), 50)
  }

  const generateUniqueChannelName = (baseName: string): string => {
    const existingNames = channels.map((channel) => channel.name)

    if (!existingNames.includes(baseName)) {
      return baseName
    }

    let counter = 2
    let uniqueName = `${baseName} (${counter})`

    while (existingNames.includes(uniqueName)) {
      counter++
      uniqueName = `${baseName} (${counter})`
    }

    return uniqueName
  }

  const handleSelectAndCloseContactSelection = (selectedContactWithContext: ContactWithContext | null) => {
    if (selectedContactWithContext) {
      const { simulationContext, ...selectedContact } = selectedContactWithContext

      // Generate unique channel name based on context
      const uniqueChannelName = generateUniqueChannelName(simulationContext)

      // Create new channel
      const newChannel: Channel = {
        id: `channel_${Date.now()}`,
        name: uniqueChannelName,
        participants: [
          {
            name: "You",
            avatar: "Y",
            role: "Manager",
            email: "you@company.com",
          },
          selectedContact,
        ],
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderName: "You",
            senderAvatar: "Y",
            content: `Mulai percakapan baru untuk konteks: ${simulationContext}`,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            isUser: true,
          },
        ],
        lastActivity: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }

      // Add new channel to the beginning of the list
      setChannels((prevChannels) => [newChannel, ...prevChannels])

      // Auto-select the new channel
      setSelectedChannelId(newChannel.id)
    }

    // Close contact selection panel
    setIsContactAnimating(false)
    setTimeout(() => setShowContactSelection(false), 300)
  }

  const selectedChannel = channels.find((channel) => channel.id === selectedChannelId)

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex -mt-8 px-6 pb-6">
        <MessengerChannelList
          channels={channels}
          selectedChannelId={selectedChannelId}
          onChannelSelect={handleChannelSelect}
        />

        <div className="flex-1 flex flex-col">
          {showContactSelection && (
            <ContactSelection onClose={handleSelectAndCloseContactSelection} isAnimating={isContactAnimating} />
          )}
          {!showContactSelection && selectedChannel ? (
            <ActiveMessengerChannel channel={selectedChannel} onNewConversation={handleAddNewChannel} />
          ) : (
            !showContactSelection && <MessengerEmptyState onNewConversation={handleAddNewChannel} />
          )}
        </div>
      </div>
    </Layout>
  )
}
