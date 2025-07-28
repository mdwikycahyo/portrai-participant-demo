"use client";

import { useState } from "react";
import { Layout } from "@/components/layout";
import { MessengerChannelList } from "@/components/messenger-channel-list";
import { ActiveMessengerChannel } from "@/components/active-messenger-channel";
import { MessengerEmptyState } from "@/components/messenger-empty-state";
import { ParticipantSelection } from "@/components/participant-selection";
import { ContactSelection } from "@/components/contact-selection";
import { messengerChannelsData, type Channel } from "@/lib/messenger-data";

interface ContactWithContext {
  name: string;
  email: string;
  avatar: string;
  role: string;
  simulationContext?: string | null;
}

type Participant = {
  name: string;
  avatar: string;
  role: string;
  email: string;
};

export default function MessengerPage() {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null
  );
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [channels, setChannels] = useState<Channel[]>(messengerChannelsData);
  const [showContactSelection, setShowContactSelection] = useState(false);
  const [isContactAnimating, setIsContactAnimating] = useState(false);

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
    setSelectedParticipant(null); // Reset participant selection when changing channels
  };

  const handleSelectParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
  };

  const handleAddNewChannel = () => {
    setShowContactSelection(true);
    setTimeout(() => setIsContactAnimating(true), 50);
  };

  const generateUniqueChannelName = (baseName: string): string => {
    const existingNames = channels.map((channel) => channel.name);

    if (!existingNames.includes(baseName)) {
      return baseName;
    }

    let counter = 2;
    let uniqueName = `${baseName} (${counter})`;

    while (existingNames.includes(uniqueName)) {
      counter++;
      uniqueName = `${baseName} (${counter})`;
    }

    return uniqueName;
  };

  const handleSelectAndCloseContactSelection = (
    selectedContactWithContext: ContactWithContext | null
  ) => {
    if (selectedContactWithContext) {
      const { simulationContext, ...selectedContact } =
        selectedContactWithContext;
      const contextToUse = simulationContext ?? "New Conversation";

      // Generate unique channel name based on context
      const uniqueChannelName = generateUniqueChannelName(contextToUse);

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
            content: `Mulai percakapan baru untuk konteks: ${contextToUse}`,
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
      };

      // Add new channel to the beginning of the list
      setChannels((prevChannels) => [newChannel, ...prevChannels]);

      // Auto-select the new channel and participant
      setSelectedChannelId(newChannel.id);
      setSelectedParticipant(selectedContact);
    }

    // Close contact selection panel
    setIsContactAnimating(false);
    setTimeout(() => setShowContactSelection(false), 300);
  };

  const selectedChannel = channels.find(
    (channel) => channel.id === selectedChannelId
  );

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex -mt-8 px-6 pb-6">
        {/* Left Panel: Channel List */}
        <MessengerChannelList
          channels={channels}
          selectedChannelId={selectedChannelId}
          onChannelSelect={handleChannelSelect}
          onAddNewChannel={handleAddNewChannel}
        />

        {/* Contact Selection Overlay */}
        {showContactSelection && (
          <ContactSelection
            onClose={handleSelectAndCloseContactSelection}
            isAnimating={isContactAnimating}
          />
        )}

        {/* Middle and Right Panels */}
        {!showContactSelection && selectedChannelId === null && (
          /* Default State: Merged Empty State spanning middle and right columns */
          <MessengerEmptyState />
        )}

        {!showContactSelection &&
          selectedChannelId !== null &&
          selectedChannel && (
            <>
              {/* Middle Panel: Participant Selection */}
              <ParticipantSelection
                channel={selectedChannel}
                selectedParticipant={selectedParticipant}
                onSelectParticipant={handleSelectParticipant}
              />

              {!selectedParticipant ? (
                <div className="p-4 bg-gray-50 flex-1 flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="w-6 h-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Klik kontak untuk chat
                    </h3>
                    <p className="text-gray-500">Tidak ada yang dipilih</p>
                  </div>
                </div>
              ) : (
                <ActiveMessengerChannel
                  channel={selectedChannel}
                  selectedParticipant={selectedParticipant}
                />
              )}
            </>
          )}
      </div>
    </Layout>
  );
}
