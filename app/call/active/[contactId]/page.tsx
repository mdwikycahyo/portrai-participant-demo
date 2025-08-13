"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Layout } from "@/components/layout"

// Mock contact data with Ezra Kaell as contactId "1"
const contactData = {
  superior: [
    {
      id: "1",
      name: "Ezra Kaell",
      level: "Assistant Vice President",
      division: "Strategic Planning",
      email: "Ezra.Kaell@company.com",
      status: "online",
      initials: "EK",
      bgColor: "bg-purple-500",
    },
    {
      id: "2",
      name: "Emily Carter",
      level: "Assistant Vice President",
      division: "Human Resources",
      email: "Emily.Carter@yahoo.com",
      status: "online",
      initials: "EC",
      bgColor: "bg-purple-500",
    },
    {
      id: "3",
      name: "Sarah Patel",
      level: "General Manager",
      division: "Production",
      email: "Sarah.Patel@gmail.com",
      status: "away",
      initials: "SP",
      bgColor: "bg-purple-500",
    },
    {
      id: "4",
      name: "Marcus Lee",
      level: "General Manager",
      division: "Quality Control",
      email: "Marcus.Lee@outlook.com",
      status: "online",
      initials: "ML",
      bgColor: "bg-purple-500",
    },
    {
      id: "5",
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
      id: "6",
      name: "Jessica Wong",
      level: "Department Head",
      division: "Operations Planning",
      email: "Jessica.Wong@yahoo.com",
      status: "online",
      initials: "JW",
      bgColor: "bg-purple-500",
    },
    {
      id: "7",
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
      text: "Terima kasih sudah menghubungi saya via call. Seperti yang saya bilang di chat tadi, saya sedang sangat sibuk hari ini dan lebih efektif kalau kita diskusi langsung seperti ini.",
    },
    {
      speaker: "Head of Procurement & IT",
      text: "Baik, saya mengerti. Langsung saja ya, mengenai proposal sponsorship S24 yang kemarin.",
    },
    {
      speaker: contactName,
      text: "Ya betul. Saya sudah review semua dokumen yang Anda kirim. Secara garis besar, konsepnya sudah bagus dan sesuai dengan strategic direction kita.",
    },
    {
      speaker: "Head of Procurement & IT",
      text: "Bagaimana dengan budget allocation-nya? Apakah masih dalam range yang acceptable?",
    },
    {
      speaker: contactName,
      text: "Budget-nya reasonable, tapi saya perlu diskusi dengan finance team dulu untuk final approval. Kira-kira timeline implementasi-nya kapan?",
    },
    {
      speaker: "Head of Procurement & IT",
      text: "Idealnya kita bisa start awal bulan depan, tapi flexible sesuai kebutuhan tim.",
    },
    {
      speaker: contactName,
      text: "Perfect. Saya akan coordinate dengan semua stakeholder terkait dan give you update by end of this week. Apakah ada concern lain yang perlu kita address sekarang?",
    },
    {
      speaker: "Head of Procurement & IT",
      text: "Untuk saat ini sudah cukup comprehensive. Terima kasih untuk waktu dan feedback-nya.",
    },
    {
      speaker: contactName,
      text: "Sama-sama. Saya appreciate initiative ini dan looking forward untuk collaboration selanjutnya. Let's make this project successful.",
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

  const handleCompleteCall = () => {
    router.push("/messenger?callEnd=complete&contact=ezra")
  }

  const handleDisconnectCall = () => {
    router.push("/messenger?callEnd=disconnect&contact=ezra")
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
              <TooltipProvider>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={toggleMute}
                    className={`w-12 h-12 rounded-full ${isMuted ? "bg-red-100 border-red-300" : "bg-gray-100"}`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="lg"
                        onClick={handleCompleteCall}
                        className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Phone className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>End Call</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="lg"
                        onClick={handleDisconnectCall}
                        className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        <PhoneOff className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Simulate Disconnect</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
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
