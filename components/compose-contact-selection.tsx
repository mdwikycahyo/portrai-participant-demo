"use client"

import { Search, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const contacts = {
  Superior: [
    { name: "Emily Carter", email: "Emily.Carter@yahoo.com", avatar: "EC" },
    { name: "Sarah Patel", email: "Sarah.Patel@gmail.com", avatar: "SP" },
    { name: "Marcus Lee", email: "Marcus.Lee@outlook.com", avatar: "ML" },
    { name: "Tommy Nguyen", email: "Tommy.Nguyen@email.com", avatar: "TN" },
  ],
  Peer: [
    { name: "Emily Carter", email: "Emily.Carter@yahoo.com", avatar: "EC" },
    { name: "Sarah Patel", email: "Sarah.Patel@gmail.com", avatar: "SP" },
  ],
  Subordinate: [{ name: "Emily Carter", email: "Emily.Carter@yahoo.com", avatar: "EC" }],
}

interface ComposeContactSelectionProps {
  selectedContact: string | null
  onContactSelect: (email: string) => void
  onClose: () => void
  isAnimating: boolean
}

export function ComposeContactSelection({
  selectedContact,
  onContactSelect,
  onClose,
  isAnimating,
}: ComposeContactSelectionProps) {
  return (
    <div
      className={`w-50 bg-white border-l border-gray-200 h-full transition-all duration-300 ease-in-out transform ${
        isAnimating ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Pilih Kontak</h2>
        <Button variant="ghost" onClick={onClose} className="p-2">
          <X className="w-4 h-4" />
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
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Kontak</h2>
          <Button variant="outline" size="sm" disabled>
            Semua <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-6">
          {Object.entries(contacts).map(([category, categoryContacts]) => (
            <div key={category}>
              <h3 className="font-medium text-gray-900 mb-3">{category}</h3>
              <div className="space-y-3">
                {categoryContacts.map((contact, index) => (
                  <div key={`${category}-${index}`} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                      {contact.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{"<contact_level>"}</span>
                        <span className="font-medium text-gray-900">{contact.name}</span>
                      </div>
                      <div className="text-sm text-gray-500">{"<contact_division>"}</div>
                      <div className="text-sm text-gray-600">{contact.email}</div>
                    </div>
                    <input
                      type="radio"
                      name="contact"
                      className="w-4 h-4"
                      checked={selectedContact === contact.email}
                      onChange={() => onContactSelect(contact.email)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
