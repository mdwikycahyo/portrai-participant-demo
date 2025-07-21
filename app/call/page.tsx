"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layout } from "@/components/layout"

// Mock contact data organized by hierarchy
const contactData = {
  superior: [
    {
      id: "1",
      name: "Emily Carter",
      level: "Assistant Vice President",
      division: "Human Resources",
      email: "Emily.Carter@yahoo.com",
      status: "online",
      initials: "EC",
      bgColor: "bg-purple-500",
    },
    {
      id: "2",
      name: "Sarah Patel",
      level: "General Manager",
      division: "Production",
      email: "Sarah.Patel@gmail.com",
      status: "away",
      initials: "SP",
      bgColor: "bg-purple-500",
    },
    {
      id: "3",
      name: "Marcus Lee",
      level: "General Manager",
      division: "Quality Control",
      email: "Marcus.Lee@outlook.com",
      status: "online",
      initials: "ML",
      bgColor: "bg-purple-500",
    },
    {
      id: "4",
      name: "Tommy Nguyen",
      level: "Department Head",
      division: "Supply Chain",
      email: "Tommy.Nguyen@email.com",
      status: "offline",
      initials: "TN",
      bgColor: "bg-purple-500",
    },
  ],
  peer: [
    {
      id: "5",
      name: "Jessica Wong",
      level: "Department Head",
      division: "Operations Planning",
      email: "Jessica.Wong@yahoo.com",
      status: "online",
      initials: "JW",
      bgColor: "bg-purple-500",
    },
    {
      id: "6",
      name: "David Kim",
      level: "Manager",
      division: "Finance",
      email: "David.Kim@company.com",
      status: "online",
      initials: "DK",
      bgColor: "bg-purple-500",
    },
  ],
}

export default function CallPage() {
  const router = useRouter()
  const [selectedContact, setSelectedContact] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("semua")

  const allContacts = [...contactData.superior, ...contactData.peer]

  const filteredContacts = allContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const handleContactSelect = (contactId: string) => {
    // Allow deselection by clicking the same contact
    if (selectedContact === contactId) {
      setSelectedContact("")
    } else {
      setSelectedContact(contactId)
    }
  }

  const handleStartCall = () => {
    if (!selectedContact) {
      return
    }
    // Navigate to active call page with contact ID
    router.push(`/call/active/${selectedContact}`)
  }

  const selectedContactData = allContacts.find((contact) => contact.id === selectedContact)

  const renderContactSection = (title: string, contacts: typeof contactData.superior) => {
    const sectionContacts = contacts.filter((contact) =>
      filteredContacts.some((filtered) => filtered.id === contact.id),
    )

    if (sectionContacts.length === 0) return null

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3 px-3">{title}</h3>
        <div className="space-y-2">
          {sectionContacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedContact === contact.id ? "bg-blue-50" : ""
              }`}
              onClick={() => handleContactSelect(contact.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                <Avatar className={`w-12 h-12 ${contact.bgColor}`}>
                  <AvatarFallback className="text-white font-medium">{contact.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">&lt;contact_level&gt;</span>
                    <span className="font-medium text-gray-900">{contact.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">&lt;contact_division&gt;</span>
                  </div>
                  <div className="text-sm text-gray-600">{contact.email}</div>
                </div>
              </div>
              <RadioGroupItem value={contact.id} checked={selectedContact === contact.id} className="ml-3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex -mt-8 px-6 pb-6">
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b bg-white">
            <h1 className="text-2xl font-semibold text-gray-900">Mulai Panggilan</h1>
            <p className="text-gray-600 mt-1">Pilih peserta untuk panggilan Anda</p>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex">
            {/* Left Panel - Contact Selection */}
            <div className="flex-1 bg-white border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Kontak</h2>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-24 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semua">Semua</SelectItem>
                      <SelectItem value="superior">Superior</SelectItem>
                      <SelectItem value="peer">Peer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari kontak"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Contact List - Scrollable Container */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <RadioGroup value={selectedContact} onValueChange={setSelectedContact}>
                    {renderContactSection("Superior", contactData.superior)}
                    {renderContactSection("Peer", contactData.peer)}
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Right Panel - Call Details */}
            <div className="w-80 bg-white p-6">
              <h2 className="text-lg font-medium mb-6">Detail Panggilan</h2>

              {/* Selected Participant */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Peserta Terpilih {selectedContactData ? "(1)" : "(0)"}
                </h3>
                {selectedContactData ? (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className={`w-10 h-10 ${selectedContactData.bgColor}`}>
                      <AvatarFallback className="text-white font-medium text-sm">
                        {selectedContactData.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{selectedContactData.name}</div>
                      <div className="text-xs text-gray-500">{selectedContactData.level}</div>
                      <div className="text-xs text-gray-500">{selectedContactData.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">Belum ada peserta yang dipilih</div>
                )}
              </div>

              {/* Start Call Button */}
              <Button
                onClick={handleStartCall}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                disabled={!selectedContact}
              >
                <Phone className="w-4 h-4 mr-2" />
                Mulai Panggilan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
