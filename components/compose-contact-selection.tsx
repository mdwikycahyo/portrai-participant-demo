"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight } from "lucide-react"

interface Contact {
  id: string
  name: string
  email: string
  avatar: string
  level: string
  division: string
  category: string
}

const contactsData: Contact[] = [
  {
    id: "1",
    name: "Budi Santoso",
    email: "budi.santoso@example.com",
    avatar: "BS",
    level: "Manajer",
    division: "Pemasaran",
    category: "Tim Saya",
  },
  {
    id: "2",
    name: "Siti Aminah",
    email: "siti.aminah@example.com",
    avatar: "SA",
    level: "Staf",
    division: "Keuangan",
    category: "Tim Saya",
  },
  {
    id: "3",
    name: "Joko Susilo",
    email: "joko.susilo@example.com",
    avatar: "JS",
    level: "Direktur",
    division: "Operasional",
    category: "Manajemen",
  },
  {
    id: "4",
    name: "Dewi Lestari",
    email: "dewi.lestari@example.com",
    avatar: "DL",
    level: "Manajer",
    division: "HRD",
    category: "Manajemen",
  },
  {
    id: "5",
    name: "Agus Salim",
    email: "agus.salim@example.com",
    avatar: "AS",
    level: "Staf",
    division: "IT",
    category: "Lainnya",
  },
  {
    id: "6",
    name: "Rina Wijaya",
    email: "rina.wijaya@example.com",
    avatar: "RW",
    level: "Staf",
    division: "Pemasaran",
    category: "Lainnya",
  },
]

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
  const [searchTerm, setSearchTerm] = useState("")

  const filteredContacts = contactsData.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.division.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const groupedContacts = filteredContacts.reduce(
    (acc, contact) => {
      ;(acc[contact.category] = acc[contact.category] || []).push(contact)
      return acc
    },
    {} as Record<string, Contact[]>,
  )

  return (
    <div
      className={`w-[320px] bg-white border-l border-gray-200 h-full transition-all duration-300 ease-in-out transform ${
        isAnimating ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose} className="p-2">
              <ChevronRight className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900">Pilih Kontak</h2>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari Kontak"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
        {Object.entries(groupedContacts).map(([category, categoryContacts]) => (
          <div key={category} className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">{category}</h3>
            <div className="space-y-3">
              {categoryContacts.map((contact, index) => (
                <div key={`${category}-${index}`} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                    {contact.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{contact.level}</span>
                      <span className="font-medium text-gray-900 truncate">{contact.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">{contact.division}</div>
                    <div className="text-sm text-gray-600">{contact.email}</div>
                  </div>
                  <input
                    type="radio"
                    name="contact"
                    value={contact.email}
                    checked={selectedContact === contact.email}
                    onChange={() => onContactSelect(contact.email)}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
