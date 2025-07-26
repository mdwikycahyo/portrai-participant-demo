"use client"

import { Search, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { ContactSelectionProps } from "@/types/contact-selection"

const contacts = {
  Superior: [
    {
      name: "Emily Carter",
      email: "Emily.Carter@yahoo.com",
      avatar: "EC",
      role: "Assistant Vice President",
      availableContexts: ["Strategic Planning Q1", "Budget Review 2025", "Team Restructuring"],
    },
    {
      name: "Sarah Patel",
      email: "Sarah.Patel@gmail.com",
      avatar: "SP",
      role: "General Manager",
      availableContexts: ["Production Optimization", "Quality Control Initiative", "Supply Chain Review"],
    },
    {
      name: "Marcus Lee",
      email: "Marcus.Lee@outlook.com",
      avatar: "ML",
      role: "General Manager",
      availableContexts: ["Quality Standards Update", "Process Improvement", "Compliance Review"],
    },
    {
      name: "Tommy Nguyen",
      email: "Tommy.Nguyen@email.com",
      avatar: "TN",
      role: "Department Head",
      availableContexts: ["Supply Chain Optimization", "Vendor Management", "Logistics Planning"],
    },
  ],
  Peer: [
    {
      name: "Jessica Wong",
      email: "Jessica.Wong@yahoo.com",
      avatar: "JW",
      role: "Department Head",
      availableContexts: ["Operations Planning", "Resource Allocation", "Project Coordination"],
    },
    {
      name: "David Kim",
      email: "David.Kim@gmail.com",
      avatar: "DK",
      role: "Manager",
      availableContexts: ["Financial Analysis", "Budget Planning", "Cost Optimization"],
    },
  ],
  Subordinate: [
    {
      name: "Alex Rodriguez",
      email: "Alex.Rodriguez@yahoo.com",
      avatar: "AR",
      role: "Staff",
      availableContexts: ["Daily Operations", "Task Management", "Progress Reporting"],
    },
  ],
}

type ContactType = (typeof contacts.Superior)[0]

export function ContactSelection({ onClose, isAnimating }: ContactSelectionProps) {
  const [expandedContactId, setExpandedContactId] = useState<string | null>(null)
  const [selectedContact, setSelectedContact] = useState<ContactType | null>(null)
  const [selectedContext, setSelectedContext] = useState<string | null>(null)

  const handleContactToggle = (contact: ContactType) => {
    const contactId = `${contact.name}-${contact.email}`

    if (expandedContactId === contactId) {
      // Collapse if already expanded
      setExpandedContactId(null)
    } else {
      // Expand new contact and reset context selection
      setExpandedContactId(contactId)
      setSelectedContext(null)
      setSelectedContact(null)
    }
  }

  const handleContextSelect = (contact: ContactType, context: string) => {
    setSelectedContact(contact)
    setSelectedContext(context)
  }

  const handleStartChat = () => {
    if (selectedContact && selectedContext) {
      const contactWithContext = {
        ...selectedContact,
        simulationContext: selectedContext,
      }
      onClose(contactWithContext)
    }
  }

  const canStartChat = selectedContact !== null && selectedContext !== null

  return (
    <div
      className={`flex-1 flex flex-col bg-white transition-all duration-300 ease-in-out transform z-2 ${
        isAnimating ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => onClose(null)} className="p-2">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">Pilih Kontak</h2>
        </div>
        <Button
          onClick={handleStartChat}
          disabled={!canStartChat}
          className="bg-gray-800 hover:bg-gray-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
        >
          Mulai Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Cari Kontak" className="pl-10" disabled />
        </div>
      </div>

      {/* Contacts */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Kontak</h3>
          <Button variant="outline" size="sm" disabled>
            Semua <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-6">
          {Object.entries(contacts).map(([category, categoryContacts]) => (
            <div key={category}>
              <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
              <div className="space-y-3">
                {categoryContacts.map((contact, index) => {
                  const contactId = `${contact.name}-${contact.email}`
                  const isExpanded = expandedContactId === contactId

                  return (
                    <div key={`${category}-${index}`} className="border border-gray-200 rounded-lg">
                      {/* Contact Header */}
                      <div
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleContactToggle(contact)}
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                          {contact.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.role}</div>
                          <div className="text-sm text-gray-600">{contact.email}</div>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>

                      {/* Expanded Context Selection */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-3 bg-gray-50">
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Pilih Konteks Percakapan:</h5>
                          <div className="space-y-2">
                            {contact.availableContexts.map((context, contextIndex) => (
                              <div
                                key={contextIndex}
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-white cursor-pointer"
                                onClick={() => handleContextSelect(contact, context)}
                              >
                                <input
                                  type="radio"
                                  name="context"
                                  className="w-4 h-4"
                                  checked={selectedContact === contact && selectedContext === context}
                                  onChange={() => handleContextSelect(contact, context)}
                                />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-sm">{context}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
