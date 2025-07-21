"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Mic, MicOff, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Layout } from "@/components/layout"

// Mock contact data (same as in call page)
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

export default function ActiveCallPage() {
  const router = useRouter()
  const params = useParams()
  const contactId = params.contactId as string

  const [isMuted, setIsMuted] = useState(false)
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string }>>([])
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)

  const allContacts = [...contactData.superior, ...contactData.peer]
  const contact = allContacts.find((c) => c.id === contactId)

  // Generate conversation data with actual contact name
  const getConversationData = (contactName: string) => [
    {
      speaker: contactName,
      text: "Poin yang sangat penting. Saya akan coba ajukan alternatif yang minim biaya, misalnya memakai aset internal dan fasilitator dari tim kita sendiri. Saya juga akan menyusun jadwal yang menghindari jam-jam sibuk, jadi tidak menambah tekanan kerja.",
    },
    {
      speaker: "Head of Procurement & IT",
      text: "Saya oke saja, selama koordinasinya jelas.",
    },
    {
      speaker: contactName,
      text: "Baik, saya akan pastikan semua detail dikomunikasikan dengan baik kepada seluruh tim.",
    },
    {
      speaker: "Head of Procurement & IT",
      text: "Untuk timeline implementasi, apakah kita bisa mulai minggu depan?",
    },
    {
      speaker: contactName,
      text: "Saya rasa itu feasible. Mari kita buat action plan yang detail terlebih dahulu.",
    },
    {
      speaker: "Head of Procurement & IT",
      text: "Setuju. Kita juga perlu mempertimbangkan resource allocation untuk project ini.",
    },
    {
      speaker: contactName,
      text: "Betul sekali. Saya akan prepare draft budget dan resource planning untuk meeting selanjutnya.",
    },
    {
      speaker: "Head of Procurement & IT",
      text: "Bagaimana dengan approval dari management? Apakah sudah ada green light?",
    },
    {
      speaker: contactName,
      text: "Untuk approval awal sudah ada, tapi untuk budget detail masih perlu presentasi ke board.",
    },
  ]

  const conversationData = contact ? getConversationData(contact.name) : []

  // Simulate real-time transcript
  useEffect(() => {
    if (!contact || currentMessageIndex >= conversationData.length) return

    const currentMessage = conversationData[currentMessageIndex]
    const interval = setInterval(() => {
      if (currentCharIndex < currentMessage.text.length) {
        setCurrentCharIndex((prev) => prev + 1)
      } else {
        // Move to next message
        setTranscript((prev) => [
          ...prev,
          {
            speaker: currentMessage.speaker,
            text: currentMessage.text,
          },
        ])
        setCurrentMessageIndex((prev) => prev + 1)
        setCurrentCharIndex(0)
      }
    }, 50) // Adjust speed of typing effect

    return () => clearInterval(interval)
  }, [contact, currentMessageIndex, currentCharIndex, conversationData])

  const handleEndCall = () => {
    router.push("/call")
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  if (!contact) {
    return (
      <Layout>
        <div className="h-[calc(100vh-120px)] flex -mt-8 px-6 pb-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Kontak tidak ditemukan</h1>
            <Button onClick={() => router.push("/call")}>Kembali ke Panggilan</Button>
          </div>
        </div>
      </Layout>
    )
  }

  const currentMessage = conversationData[currentMessageIndex]
  const currentDisplayText = currentMessage ? currentMessage.text.slice(0, currentCharIndex) : ""

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex -mt-8 px-6 pb-6">
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b bg-white">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Call with {contact.name}</h1>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Live
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex">
            {/* Main Call Area */}
            <div className="flex-1 bg-white p-6">
              {/* Video Call Window */}
              <div className="relative bg-gray-800 rounded-lg border-4 border-green-500 h-96 flex items-center justify-center mb-6">
                <div className="text-center">
                  <Avatar className={`w-32 h-32 ${contact.bgColor} mx-auto mb-4`}>
                    <AvatarFallback className="text-white font-bold text-4xl">{contact.initials}</AvatarFallback>
                  </Avatar>
                </div>

                {/* Contact Name Bar */}
                <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 flex items-center justify-between">
                  <span className="font-medium text-gray-900">{contact.name}</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleMute}
                  className={`w-12 h-12 rounded-full ${isMuted ? "bg-red-100 border-red-300" : "bg-gray-100"}`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button
                  size="lg"
                  onClick={handleEndCall}
                  className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <Phone className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Transcript Panel */}
            <div className="w-80 bg-white border-l p-6">
              <h2 className="text-lg font-medium mb-4">Transcript</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transcript.map((message, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3">
                    <div className="font-medium text-gray-900 text-sm mb-1">{message.speaker}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">{message.text}</div>
                  </div>
                ))}

                {/* Current typing message */}
                {currentMessage && currentDisplayText && (
                  <div className="border-b border-gray-100 pb-3">
                    <div className="font-medium text-gray-900 text-sm mb-1">{currentMessage.speaker}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {currentDisplayText}
                      <span className="animate-pulse">|</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
