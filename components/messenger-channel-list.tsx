"use client"

import { Hash } from "lucide-react"
import type { Channel } from "@/lib/messenger-data"

interface MessengerChannelListProps {
  channels: Channel[]
  selectedChannelId: string | null
  onChannelSelect: (channelId: string) => void
}

export function MessengerChannelList({ channels, selectedChannelId, onChannelSelect }: MessengerChannelListProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Messenger</h1>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {channels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => onChannelSelect(channel.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedChannelId === channel.id ? "bg-gray-100 border border-gray-300" : "hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                <Hash className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">{channel.name}</h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{channel.lastActivity}</span>
                </div>
                <p className="text-sm text-gray-600">{channel.participants.length} participants</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
