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

// President Director Channel - This will be dynamically added after Mia completion
export const presidentDirectorChannel: Channel = {
  id: "president-director-channel",
  name: "Discussion with President Director",
  participants: [
    {
      name: "You",
      avatar: "Y",
      role: "New Employee",
      email: "you@company.com",
    },
    {
      name: "Arya Prajida",
      avatar: "AP",
      role: "President Director",
      email: "arya.prajida@amboja.com",
    },
  ],
  messages: [
    {
      id: "president-intro-1",
      senderName: "Arya Prajida",
      senderAvatar: "AP",
      content: "Halo Bapak Dwiky Cahyo, perkenalkan saya Arya Prajida, President Director di Amboja.",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      isUser: false,
    },
    {
      id: "president-intro-2",
      senderName: "Arya Prajida",
      senderAvatar: "AP",
      content: "Senang sekali akhirnya bisa berkenalan dengan Anda dan tim kami hari ini.",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      isUser: false,
    },
    {
      id: "president-intro-3",
      senderName: "Arya Prajida",
      senderAvatar: "AP",
      content: "Saya baru saja membaca rangkuman yang Anda buat tentang Amboja, dan terus terang saya sangat terkesan dengan perspektif Anda.",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      isUser: false,
    },
    {
      id: "president-intro-4",
      senderName: "Arya Prajida",
      senderAvatar: "AP",
      content: "Apakah Anda ada waktu sekitar 5-10 menit sekarang untuk kita terhubung lewat **Voice Call** singkat?",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      isUser: false,
    },
  ],
  lastActivity: new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }),
}

// HR Onboarding Channel - This will be dynamically added when triggered
export const onboardingChannel: Channel = {
  id: "onboarding-channel",
  name: "Onboarding",
  participants: [
    {
      name: "You",
      avatar: "Y",
      role: "New Employee",
      email: "you@company.com",
    },
    {
      name: "Mia Avira",
      avatar: "MA",
      role: "VP of Human Resource",
      email: "mia.avira@company.com",
    },
  ],
  messages: [
    {
      id: "onboarding-1",
      senderName: "Mia Avira",
      senderAvatar: "MA",
      content: "Halo Bapak Dwiky Cahyo, perkenalkan saya Mia Avira, VP of Human Resources di Amboja.",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      isUser: false,
    },
  ],
  lastActivity: new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }),
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
        content:
          "Maaf, saya sedang sangat sibuk hari ini dengan beberapa urgent meetings. Bisa kita discuss proposal sponsorship ini via call saja?",
        timestamp: "10:32 AM",
        isUser: false,
      },
      {
        id: "3",
        senderName: "You",
        senderAvatar: "Y",
        content: "Saya akan call sekarang.",
        timestamp: "10:35 AM",
        isUser: true,
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
