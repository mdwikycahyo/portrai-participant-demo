export interface Participant {
  name: string
  avatar: string
  role: string
  email: string
}

export interface Message {
  id: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  isUser: boolean
}

export interface Channel {
  id: string
  name: string
  participants: Participant[]
  messages: Message[]
  lastActivity: string
}

export const messengerChannelsData: Channel[] = [
  {
    id: "1",
    name: "Branding Amboja",
    participants: [
      {
        name: "You",
        avatar: "Y",
        role: "Manager",
        email: "you@company.com",
      },
      {
        name: "Jessica Wong",
        avatar: "JW",
        role: "Department Head",
        email: "jessica.wong@company.com",
      },
    ],
    messages: [
      {
        id: "1",
        senderName: "Jessica Wong",
        senderAvatar: "JW",
        content: "Konsep branding untuk Amboja sudah ready untuk review.",
        timestamp: "11:15 AM",
        isUser: false,
      },
      {
        id: "2",
        senderName: "You",
        senderAvatar: "Y",
        content: "Great! Bisa kita schedule meeting untuk discuss detail?",
        timestamp: "11:20 AM",
        isUser: true,
      },
    ],
    lastActivity: "11:30 AM",
  },
  {
    id: "2",
    name: "Peluang Sponsorship S24",
    participants: [
      {
        name: "You",
        avatar: "Y",
        role: "Manager",
        email: "you@company.com",
      },
      {
        name: "Ezra Kaell",
        avatar: "EK",
        role: "Assistant Vice President",
        email: "ezra.kaell@company.com",
      },
      {
        name: "Sarah Patel",
        avatar: "SP",
        role: "General Manager",
        email: "sarah.patel@company.com",
      },
    ],
    messages: [
      {
        id: "1",
        senderName: "You",
        senderAvatar: "Y",
        content: "Tim, bagaimana progress untuk sponsorship S24?",
        timestamp: "10:30 AM",
        isUser: true,
      },
      {
        id: "2",
        senderName: "Ezra Kaell",
        senderAvatar: "EK",
        content: "Sudah ada beberapa lead yang menjanjikan. Saya akan share update lengkapnya di meeting nanti.",
        timestamp: "10:32 AM",
        isUser: false,
      },
      {
        id: "3",
        senderName: "Sarah Patel",
        senderAvatar: "SP",
        content: "Perfect! Saya sudah prepare budget allocation untuk Q1.",
        timestamp: "10:35 AM",
        isUser: false,
      },
    ],
    lastActivity: "10:45 AM",
  },
  {
    id: "3",
    name: "Project X Implementation",
    participants: [
      {
        name: "You",
        avatar: "Y",
        role: "Manager",
        email: "you@company.com",
      },
      {
        name: "Nero Atlas",
        avatar: "NA",
        role: "Technical Lead",
        email: "nero.atlas@company.com",
      },
    ],
    messages: [
      {
        id: "1",
        senderName: "Nero Atlas",
        senderAvatar: "NA",
        content: "Implementation phase 1 completed. Ready untuk testing.",
        timestamp: "09:00 AM",
        isUser: false,
      },
      {
        id: "2",
        senderName: "You",
        senderAvatar: "Y",
        content: "Excellent work! Let's proceed dengan phase 2.",
        timestamp: "09:03 AM",
        isUser: true,
      },
    ],
    lastActivity: "09:05 AM",
  },
]
