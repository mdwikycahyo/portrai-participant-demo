"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PhoneOutgoing } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Layout } from "@/components/layout"
import { callHistoryData } from "@/lib/call-history-data"

export default function CallPage() {
  return (
    <Layout>
        <div className="h-[calc(100vh-120px)] flex px-6 pb-6">
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b bg-white">
              <h1 className="text-2xl font-semibold text-gray-900">Riwayat Panggilan</h1>
              <p className="text-gray-600 mt-1">Panggilan hari ini</p>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white">
              <div className="p-6">
                <div className="space-y-4">
                  {callHistoryData.map((call) => (
                    <div
                      key={call.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        {/* Outgoing Call Icon */}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                          <PhoneOutgoing className="w-4 h-4 text-green-600" />
                        </div>

                        {/* Avatar */}
                        <Avatar className="w-12 h-12 bg-gray-500">
                          <AvatarFallback className="text-white font-medium">{call.contactInitials}</AvatarFallback>
                        </Avatar>

                        {/* Contact Info */}
                        <div>
                          <div className="font-medium text-gray-900">{call.contactName}</div>
                          <div className="text-sm text-gray-500">{call.contactRole}</div>
                        </div>
                      </div>

                      {/* Call Details */}
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{call.duration}</div>
                        <div className="text-sm text-gray-500">{call.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
  )
}
