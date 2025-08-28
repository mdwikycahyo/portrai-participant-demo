"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
import type { DocumentFile } from "@/lib/documents-data"
import { onboardingChannel } from "@/lib/messenger-data"

interface Message {
  id: string
  text: string
  isBot: boolean
  type: "user" | "bot" | "reminder" | "tutorial"
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Ada yang bisa saya bantu?",
    isBot: true,
    type: "bot",
    timestamp: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  },
]

const botResponses = {
  default: "Maaf, saya belum memahami pertanyaan Anda. Bisakah Anda menjelaskan lebih detail?",
  greeting: "Halo! Saya Assessment Assistant. Saya di sini untuk membantu Anda menggunakan platform ini.",
  navigation: "Anda dapat menggunakan sidebar di sebelah kiri untuk navigasi ke Beranda, Chat, Email, Documents, atau Call.",
  email:
    "Di halaman Email, Anda dapat membaca, membalas, dan meneruskan email. Gunakan tombol Tulis untuk menulis email baru.",
  documents:
    "Di halaman Documents, Anda dapat melihat folder dan file. Klik folder untuk melihat isinya, atau klik file untuk membacanya.",
  chat: "Di halaman Chat, Anda dapat berkomunikasi dengan rekan kerja. Pilih kontak dari daftar untuk memulai percakapan.",
  call: "Di halaman Call, Anda dapat melakukan panggilan suara dengan rekan kerja. Pilih kontak untuk memulai panggilan atau lihat riwayat panggilan sebelumnya.",
  help: "Saya dapat membantu Anda dengan navigasi, penggunaan email, manajemen dokumen, fitur chat, dan fitur panggilan. Apa yang ingin Anda ketahui?",
  companyProfile: `Berikut adalah rangkuman dokumen "Profil Perusahaan Amboja":

**Tentang Amboja:**
Amboja adalah perusahaan teknologi yang berfokus pada pengembangan solusi digital inovatif untuk berbagai industri. Didirikan pada tahun 2018, perusahaan telah berkembang menjadi salah satu pemain utama dalam ekosistem teknologi Indonesia.

**Visi:**
Menjadi perusahaan teknologi terdepan yang memberikan dampak positif bagi masyarakat melalui inovasi berkelanjutan.

**Misi:**
- Pengembangan produk teknologi yang user-friendly
- Pemberdayaan talenta lokal
- Kontribusi terhadap transformasi digital Indonesia

**Nilai-nilai Perusahaan:**
- Inovasi
- Kolaborasi
- Integritas
- Keberlanjutan
- Kepedulian terhadap Pelanggan

**Budaya Kerja:**
Amboja menerapkan prinsip work-life balance, mendorong kreativitas dan inovasi, serta membangun lingkungan kerja yang inklusif dan supportif. Tim terdiri dari profesional muda yang passionate dan berpengalaman dari berbagai latar belakang. Perusahaan berkomitmen untuk terus mengembangkan kemampuan karyawan melalui program pelatihan, mentoring, dan kesempatan berkontribusi dalam proyek-proyek menantang.`,
}

const tutorialMessages = [
  "Halo Bapak Dwiky Cahyo, ini adalah hari pertama Anda bekerja bersama Amboja! Saya adalah AI Assistant yang akan menjadi rekan kerja virtual untuk memandu Anda dalam sesi Prework ini.",
  "Ini adalah langkah awal dari perjalanan Anda. Apakah Anda sudah siap untuk memulai?"
]

const tutorialContinuationMessages = [
  "Di Amboja, kami percaya pada kekuatan kolaborasi, termasuk kolaborasi antara manusia dan AI.",
  "Anda dianjurkan untuk memanfaatkan teknologi AI dalam menyelesaikan pekerjaan Anda dengan lebih efektif.",
  "Konsep ini cukup jelas ya, Bapak?"
]

// Mission briefing messages for Mia Avira (Messages 7-13)
const missionBriefingMessages = [
  "Baik, terima kasih konfirmasinya!",
  "Oke, misi Anda sederhana saja. Di email itu ada lampiran bernama **Profil Perusahaan Amboja**.",
  "Apakah Anda siap untuk melihat rincian tugasnya?",
  `Bagus. Berikut adalah tugas Anda:
1.  **Download** lampiran tersebut.
2.  Lalu, **buka dan pelajari** isinya melalui menu **Document**.
3.  Setelah itu, **buat sebuah dokumen baru** dengan judul **'Apa yang Saya Ketahui Tentang Amboja'**. Isinya adalah rangkuman singkat pemahaman Anda tentang perusahaan kita.
4.  Terakhir, **balas email saya** tadi dan **lampirkan** dokumen rangkuman yang sudah Anda buat.`,
  "Bagaimana, apakah keempat langkah tersebut cukup jelas untuk Anda?",
  "Sedikit tips dari saya: Jangan ragu untuk minta bantuan AI Assistant kita untuk merangkum poin-penting dari dokumen tersebut. Justru itu adalah salah satu tujuan platform PortrAI ini, yaitu membantu Anda mengolah informasi dengan cepat.",
  "Santai saja, tidak ada jawaban benar atau salah. Selamat mengerjakan misi pertama Anda!"
]

interface Email {
  id: string
  sender: string
  avatar: string
  subject: string
  preview: string
  time: string
  hasAttachment: boolean
}

interface AssessmentAssistantContextType {
  messages: Message[]
  isOpen: boolean
  hasNewMessage: boolean
  isTutorialActive: boolean
  tutorialStep: number
  isTyping: boolean
  conversationPhase: 'initial' | 'readiness_check' | 'collaboration_intro' | 'clarity_check' | 'completion'
  tutorialPendingStart: boolean
  onboardingChannelTriggered: boolean
  onboardingEmailSent: boolean
  hasInteractedWithMia: boolean
  emailRead: boolean
  downloadedDocuments: DocumentFile[]
  onboardingMessages: any[]
  conversationStage: 'initial' | 'waiting_for_response' | 'responded' | 'mission_phase' | 'email_confirmed' | 'mission_briefing' | 'task_readiness_check' | 'task_list_delivered' | 'task_clarity_check' | 'ai_hint_given' | 'mission_started' | 'email_replied' | 'mia_completion'
  presidentDirectorChannelTriggered: boolean
  inboxEmails: Email[]
  missionBriefingStep: number
  isMissionBriefingActive: boolean
  addMessage: (message: Message) => void
  addUserMessage: (text: string) => void
  addBotResponse: (userMessage: string) => void
  addReminderMessage: (text: string) => void
  setIsOpen: (isOpen: boolean) => void
  setHasNewMessage: (hasNew: boolean) => void
  clearMessages: () => void
  getBotResponse: (userMessage: string) => string
  startTutorial: () => void
  startDeferredTutorialMessages: () => void
  handleTutorialResponse: (userMessage: string) => void
  triggerOnboardingChannel: () => void
  triggerOnboardingEmail: () => void
  markMiaAsInteracted: () => void
  markEmailAsRead: () => void
  addDownloadedDocument: (document: DocumentFile) => void
  addOnboardingMessage: (message: any) => void
  setConversationStage: (stage: 'initial' | 'waiting_for_response' | 'responded' | 'mission_phase' | 'email_confirmed' | 'mission_briefing' | 'task_readiness_check' | 'task_list_delivered' | 'task_clarity_check' | 'ai_hint_given' | 'mission_started' | 'email_replied' | 'mia_completion') => void
  resetTutorialProgress: () => void
  triggerEmailReplyWithAttachment: () => void
  triggerPresidentDirectorChannel: () => void
  startMissionBriefing: (handleSendMessage: (channelId: string, message: any) => void) => void
  handleMissionBriefingResponse: (userMessage: string, handleSendMessage: (channelId: string, message: any) => void) => void
}

const AssessmentAssistantContext = createContext<AssessmentAssistantContextType | undefined>(undefined)

// Default emails that are always present
const defaultEmails: Email[] = [
  {
    id: "ux-researcher",
    sender: "Dwiky Cahyo",
    avatar: "DC",
    subject: "Kick-off Discussion",
    preview: "Kita tengah memasuki fase penting dalam perjalanan Amboja sebagai perusahaan teknologi yang berbasis pada keber...",
    time: "2:00 PM",
    hasAttachment: true,
  },
  {
    id: "ui-developer",
    sender: "UI Developer",
    avatar: "UD",
    subject: "Launch Planning Session",
    preview: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    time: "4:15 PM",
    hasAttachment: true,
  },
  {
    id: "product-manager",
    sender: "Product Manager",
    avatar: "PM",
    subject: "Project Commencement Brief...",
    preview: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In egestas orci ac quam...",
    time: "11:45 AM",
    hasAttachment: true,
  },
  {
    id: "frontend-engineer",
    sender: "Front-end Engineer",
    avatar: "FE",
    subject: "Initial Project Overview",
    preview: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, tot...",
    time: "9:30 AM",
    hasAttachment: true,
  },
]

export function AssessmentAssistantProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [isTutorialActive, setIsTutorialActive] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [conversationPhase, setConversationPhase] = useState<'initial' | 'readiness_check' | 'collaboration_intro' | 'clarity_check' | 'completion'>('initial')
  const [tutorialPendingStart, setTutorialPendingStart] = useState(false)
  const [onboardingChannelTriggered, setOnboardingChannelTriggered] = useState(false)
  const [onboardingEmailSent, setOnboardingEmailSent] = useState(false)
  const [hasInteractedWithMia, setHasInteractedWithMia] = useState(false)
  const [emailRead, setEmailRead] = useState(false)
  const [downloadedDocuments, setDownloadedDocuments] = useState<DocumentFile[]>([])
  const [onboardingMessages, setOnboardingMessages] = useState(onboardingChannel.messages)
  const [conversationStage, setConversationStage] = useState<'initial' | 'waiting_for_response' | 'responded' | 'mission_phase' | 'email_confirmed' | 'mission_briefing' | 'task_readiness_check' | 'task_list_delivered' | 'task_clarity_check' | 'ai_hint_given' | 'mission_started' | 'email_replied' | 'mia_completion'>('initial')
  const [presidentDirectorChannelTriggered, setPresidentDirectorChannelTriggered] = useState(false)
  const [inboxEmails, setInboxEmails] = useState<Email[]>(defaultEmails)
  const [missionBriefingStep, setMissionBriefingStep] = useState(0)
  const [isMissionBriefingActive, setIsMissionBriefingActive] = useState(false)

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
  }, [])

  const addUserMessage = useCallback((text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      type: "user",
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }
    addMessage(userMessage)
  }, [addMessage])

  const addBotResponse = useCallback((userMessage: string) => {
    const botResponse = getBotResponse(userMessage)
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      isBot: true,
      type: "bot",
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }
    addMessage(botMessage)
    setHasNewMessage(true)
  }, [addMessage])

  const addReminderMessage = useCallback((text: string) => {
    const reminderMessage: Message = {
      id: (Date.now() + 2).toString(),
      text,
      isBot: true,
      type: "reminder",
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }
    addMessage(reminderMessage)
    setHasNewMessage(true)
  }, [addMessage])

  const clearMessages = useCallback(() => {
    setMessages(initialMessages)
  }, [])

  const getBotResponse = useCallback((userMessage: string): string => {
    const message = userMessage.toLowerCase()

    // Check for company profile queries first (more specific)
    if (
      message.includes("rangkum") && 
      (message.includes("profil perusahaan") || message.includes("amboja") || message.includes("company profile"))
    ) {
      return botResponses.companyProfile
    } else if (
      message.includes("profil perusahaan") || 
      (message.includes("amboja") && !message.includes("branding")) || 
      message.includes("company profile") ||
      message.includes("tentang amboja") ||
      message.includes("visi misi") ||
      message.includes("budaya kerja") ||
      message.includes("nilai perusahaan") ||
      message.includes("sejarah amboja") ||
      message.includes("kapan didirikan") ||
      message.includes("apa itu amboja")
    ) {
      return botResponses.companyProfile
    } else if (message.includes("halo") || message.includes("hai") || message.includes("hello")) {
      return botResponses.greeting
    } else if (message.includes("navigasi") || message.includes("menu") || message.includes("sidebar")) {
      return botResponses.navigation
    } else if (message.includes("email") || message.includes("surat")) {
      return botResponses.email
    } else if (message.includes("dokumen") || message.includes("file") || message.includes("folder")) {
      return botResponses.documents
    } else if (message.includes("chat") || message.includes("pesan")) {
      return botResponses.chat
    } else if (message.includes("panggilan") || message.includes("call") || message.includes("telepon") || message.includes("suara") || message.includes("video")) {
      return botResponses.call
    } else if (message.includes("bantuan") || message.includes("help") || message.includes("tolong")) {
      return botResponses.help
    } else {
      return botResponses.default
    }
  }, [])

  const startTutorial = useCallback(() => {
    // Set up tutorial state and show red dot notification
    setTutorialPendingStart(true)
    setTutorialStep(0)
    setHasNewMessage(true)
    setConversationPhase('initial')
    
    // Clear existing messages except the initial one
    setMessages(initialMessages)
  }, [])

  const startDeferredTutorialMessages = useCallback(() => {
    // Only start if tutorial is pending
    if (!tutorialPendingStart) return
    
    setTutorialPendingStart(false)
    setIsTutorialActive(true)
    
    // Send the first tutorial message
    setTimeout(() => {
      setIsTyping(true)
      
      setTimeout(() => {
        const tutorialMessage: Message = {
          id: `tutorial-1`,
          text: tutorialMessages[0],
          isBot: true,
          type: "tutorial",
          timestamp: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        }
        addMessage(tutorialMessage)
        setIsTyping(false)
        setTutorialStep(1)
        
        // Send the second message (readiness question) after a delay
        setTimeout(() => {
          setIsTyping(true)
          
          setTimeout(() => {
            const readinessMessage: Message = {
              id: `tutorial-2`,
              text: tutorialMessages[1],
              isBot: true,
              type: "tutorial",
              timestamp: new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
            }
            addMessage(readinessMessage)
            setIsTyping(false)
            setTutorialStep(2)
            setConversationPhase('readiness_check')
            setIsTutorialActive(false) // Allow user to respond
          }, 1500)
        }, 2000)
      }, 1500)
    }, 500)
  }, [tutorialPendingStart, addMessage])

  const handleTutorialResponse = useCallback((userMessage: string) => {
    const message = userMessage.toLowerCase()
    const isPositiveResponse = message.includes("ya") || message.includes("iya") || message.includes("baik") || message.includes("setuju") || message.includes("siap")
    
    if (conversationPhase === 'readiness_check' && isPositiveResponse) {
      // Continue to collaboration introduction
      setConversationPhase('collaboration_intro')
      setIsTutorialActive(true)
      
      // Send the collaboration messages
      tutorialContinuationMessages.forEach((messageText, index) => {
        setTimeout(() => {
          setIsTyping(true)
          
          setTimeout(() => {
            const tutorialMessage: Message = {
              id: `tutorial-continuation-${index + 1}`,
              text: messageText,
              isBot: true,
              type: "tutorial",
              timestamp: new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
            }
            addMessage(tutorialMessage)
            setIsTyping(false)
            setTutorialStep(3 + index)
            
            // If this is the last message (clarity check), allow user interaction
            if (index === tutorialContinuationMessages.length - 1) {
              setConversationPhase('clarity_check')
              setIsTutorialActive(false)
            }
          }, 1500)
        }, (index + 1) * 3000)
      })
    } else if (conversationPhase === 'clarity_check' && isPositiveResponse) {
      // Final completion message
      setConversationPhase('completion')
      
      setTimeout(() => {
        setIsTyping(true)
        
        setTimeout(() => {
          const finalMessage: Message = {
            id: `tutorial-final`,
            text: "Baik. Kalau begitu, sebagai langkah selanjutnya, saya akan langsung informasikan tim HR untuk menghubungi Anda melalui Chat. Mereka akan segera menyapa Anda untuk memulai proses onboarding.",
            isBot: true,
            type: "tutorial",
            timestamp: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          }
          addMessage(finalMessage)
          setIsTyping(false)
          // Don't set hasNewMessage for the final completion message
          // as it leads to onboarding flow
          
          // Trigger onboarding channel creation after a short delay
          setTimeout(() => {
            setOnboardingChannelTriggered(true)
          }, 2000)
        }, 1500)
      }, 1000)
    }
  }, [conversationPhase, addMessage])

  const triggerOnboardingChannel = useCallback(() => {
    setOnboardingChannelTriggered(true)
  }, [])

  const triggerOnboardingEmail = useCallback(() => {
    setOnboardingEmailSent(true)
    
    // Add Mia's email to inbox
    const miaEmail: Email = {
      id: "first-mission",
      sender: "Mia Avira",
      avatar: "MA",
      subject: "Misi Pertama Anda di Amboja",
      preview: "Selamat datang di Amboja! Sebagai bagian dari proses onboarding, kami telah menyiapkan misi pertama yang akan membantu...",
      time: "12:30 PM",
      hasAttachment: true,
    }
    
    // Add Mia's email to the beginning of the inbox
    setInboxEmails(prev => [miaEmail, ...prev])
  }, [])

  const markMiaAsInteracted = useCallback(() => {
    setHasInteractedWithMia(true)
  }, [])

  const markEmailAsRead = useCallback(() => {
    setEmailRead(true)
  }, [])

  const addDownloadedDocument = useCallback((document: DocumentFile) => {
    setDownloadedDocuments(prev => [...prev, document])
  }, [])

  const addOnboardingMessage = useCallback((message: any) => {
    setOnboardingMessages(prev => [...prev, message])
  }, [])

  const triggerPresidentDirectorChannel = useCallback(() => {
    setPresidentDirectorChannelTriggered(true)
  }, [])

  const triggerEmailReplyWithAttachment = useCallback(() => {
    setConversationStage('email_replied')
    
    // Mia's completion messages
    const completionMessages = [
      "Halo Bapak Dwiky Cahyo, email dan dokumen rangkuman Anda sudah saya terima. Terima kasih banyak, misi pertama Anda selesai dengan sangat baik!",
      "Proses onboarding dari saya untuk sementara selesai.",
      "Sepertinya rangkuman Anda menarik perhatian salah satu pimpinan kita.",
      "Setelah ini, President Director kita, Arya Prajida, akan segera menyapa Anda melalui fitur Chat ini untuk berdiskusi singkat dengan Anda."
    ]

    // Send messages with proper timing
    completionMessages.forEach((messageText, index) => {
      setTimeout(() => {
        const message = {
          id: `mia-completion-${Date.now()}-${index}`,
          content: messageText,
          senderName: "Mia Avira",
          senderAvatar: "MA",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          isUser: false,
        }
        
        addOnboardingMessage(message)
        
        // After the last message, set stage to completion and trigger president director
        if (index === completionMessages.length - 1) {
          setTimeout(() => {
            setConversationStage('mia_completion')
            // Trigger President Director introduction after a delay
            setTimeout(() => {
              setPresidentDirectorChannelTriggered(true)
            }, 3000) // 3 seconds after completion
          }, 1000)
        }
      }, (index + 1) * 3000) // 3 seconds between each message
    })
  }, [addOnboardingMessage])

  const startMissionBriefing = useCallback((handleSendMessage: (channelId: string, message: any) => void) => {
    console.log('Debug - startMissionBriefing called!')
    setConversationStage('email_confirmed')
    setIsMissionBriefingActive(true)
    setMissionBriefingStep(0)
    
    // Send the first message immediately (Message 7: "Baik, terima kasih konfirmasinya!")
    setTimeout(() => {
      const message = {
        id: `mission-briefing-${Date.now()}-0`,
        content: missionBriefingMessages[0],
        senderName: "Mia Avira",
        senderAvatar: "MA",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        isUser: false,
      }
      
      console.log('Debug - Adding first mission briefing message:', message)
      handleSendMessage("onboarding-channel", message)
      setMissionBriefingStep(1)
      
      // Send the second message after a delay (Message 8)
      setTimeout(() => {
        const message2 = {
          id: `mission-briefing-${Date.now()}-1`,
          content: missionBriefingMessages[1],
          senderName: "Mia Avira",
          senderAvatar: "MA",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          isUser: false,
        }
        
        handleSendMessage("onboarding-channel", message2)
        setMissionBriefingStep(2)
        
        // Send the third message (Message 9: readiness check)
        setTimeout(() => {
          const message3 = {
            id: `mission-briefing-${Date.now()}-2`,
            content: missionBriefingMessages[2],
            senderName: "Mia Avira",
            senderAvatar: "MA",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            isUser: false,
          }
          
          handleSendMessage("onboarding-channel", message3)
          setConversationStage('task_readiness_check')
          setIsMissionBriefingActive(false) // Allow user to respond
          setMissionBriefingStep(3)
        }, 2500)
      }, 2000)
    }, 1000)
  }, [])

  const handleMissionBriefingResponse = useCallback((userMessage: string, handleSendMessage: (channelId: string, message: any) => void) => {
    console.log('Debug - handleMissionBriefingResponse called with:', userMessage)
    console.log('Debug - Current conversationStage:', conversationStage)
    const message = userMessage.toLowerCase()
    const isPositiveResponse = message.includes("ya") || message.includes("iya") || message.includes("baik") || message.includes("setuju") || message.includes("siap") || message.includes("jelas") || message.includes("cukup")
    console.log('Debug - isPositiveResponse:', isPositiveResponse)
    
    if (conversationStage === 'task_readiness_check' && isPositiveResponse) {
      // Continue to task list (Message 10)
      setConversationStage('mission_briefing')
      setIsMissionBriefingActive(true)
      
      setTimeout(() => {
        const taskListMessage = {
          id: `mission-briefing-${Date.now()}-3`,
          content: missionBriefingMessages[3],
          senderName: "Mia Avira",
          senderAvatar: "MA",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          isUser: false,
        }
        
        handleSendMessage("onboarding-channel", taskListMessage)
        setMissionBriefingStep(4)
        
        // Send clarity check message (Message 11)
        setTimeout(() => {
          const clarityMessage = {
            id: `mission-briefing-${Date.now()}-4`,
            content: missionBriefingMessages[4],
            senderName: "Mia Avira",
            senderAvatar: "MA",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            isUser: false,
          }
          
          handleSendMessage("onboarding-channel", clarityMessage)
          setConversationStage('task_clarity_check')
          setIsMissionBriefingActive(false) // Allow user to respond
          setMissionBriefingStep(5)
        }, 3000)
      }, 1500)
    } else if (conversationStage === 'task_clarity_check' && isPositiveResponse) {
      console.log('Debug - Task clarity confirmed, sending final messages!')
      // Send AI hint and final encouragement (Messages 12 & 13)
      setConversationStage('ai_hint_given')
      setIsMissionBriefingActive(true)
      
      setTimeout(() => {
        const aiHintMessage = {
          id: `mission-briefing-${Date.now()}-5`,
          content: missionBriefingMessages[5],
          senderName: "Mia Avira",
          senderAvatar: "MA",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          isUser: false,
        }
        
        handleSendMessage("onboarding-channel", aiHintMessage)
        setMissionBriefingStep(6)
        
        // Send final encouragement message
        setTimeout(() => {
          const finalMessage = {
            id: `mission-briefing-${Date.now()}-6`,
            content: missionBriefingMessages[6],
            senderName: "Mia Avira",
            senderAvatar: "MA",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            isUser: false,
          }
          
          handleSendMessage("onboarding-channel", finalMessage)
          setConversationStage('mission_started')
          setIsMissionBriefingActive(false)
          setMissionBriefingStep(7) // All messages sent
        }, 2500)
      }, 2000)
    }
  }, [conversationStage])

  const resetTutorialProgress = useCallback(() => {
    setMessages(initialMessages)
    setIsTutorialActive(false)
    setTutorialStep(0)
    setIsTyping(false)
    setConversationPhase('initial')
    setTutorialPendingStart(false)
    setOnboardingChannelTriggered(false)
    setOnboardingEmailSent(false)
    setHasInteractedWithMia(false)
    setEmailRead(false)
    setDownloadedDocuments([])
    setOnboardingMessages(onboardingChannel.messages)
    setConversationStage('initial')
    setPresidentDirectorChannelTriggered(false)
    setHasNewMessage(false)
    setInboxEmails(defaultEmails) // Reset to default emails only
    setMissionBriefingStep(0)
    setIsMissionBriefingActive(false)
  }, [])

  const value: AssessmentAssistantContextType = {
    messages,
    isOpen,
    hasNewMessage,
    isTutorialActive,
    tutorialStep,
    isTyping,
    conversationPhase,
    tutorialPendingStart,
    onboardingChannelTriggered,
    onboardingEmailSent,
    hasInteractedWithMia,
    emailRead,
    downloadedDocuments,
    onboardingMessages,
    conversationStage,
    presidentDirectorChannelTriggered,
    inboxEmails,
    missionBriefingStep,
    isMissionBriefingActive,
    addMessage,
    addUserMessage,
    addBotResponse,
    addReminderMessage,
    setIsOpen,
    setHasNewMessage,
    clearMessages,
    getBotResponse,
    startTutorial,
    startDeferredTutorialMessages,
    handleTutorialResponse,
    triggerOnboardingChannel,
    triggerOnboardingEmail,
    markMiaAsInteracted,
    markEmailAsRead,
    addDownloadedDocument,
    addOnboardingMessage,
    setConversationStage,
    resetTutorialProgress,
    triggerEmailReplyWithAttachment,
    triggerPresidentDirectorChannel,
    startMissionBriefing,
    handleMissionBriefingResponse,
  }

  return (
    <AssessmentAssistantContext.Provider value={value}>
      {children}
    </AssessmentAssistantContext.Provider>
  )
}

export function useAssessmentAssistant() {
  const context = useContext(AssessmentAssistantContext)
  if (context === undefined) {
    throw new Error("useAssessmentAssistant must be used within an AssessmentAssistantProvider")
  }
  return context
}
