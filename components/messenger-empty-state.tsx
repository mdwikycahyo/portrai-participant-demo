"use client"

import { Hash } from "lucide-react"

export function MessengerEmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <Hash className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a channel to start</h3>
        <p className="text-gray-500">Choose a channel from the sidebar to view messages</p>
      </div>
    </div>
  )
}
