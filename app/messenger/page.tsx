"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Layout } from "@/components/layout"
import { MessengerChannelList } from "@/components/messenger-channel-list"
import { ActiveMessengerChannel } from "@/components/active-messenger-channel"
import { MessengerEmptyState } from "@/components/messenger-empty-state"
import { ParticipantSelection } from "@/components/participant-selection"
import { ContactSelection } from "@/components/contact-selection"
import { messengerChannelsData, onboardingChannel, presidentDirectorChannel, type Channel, type Message } from "@/lib/messenger-data"
import { useAssessmentAssistant } from "@/contexts/assessment-assistant-context"

interface ContactWithContext {
  name: string
  email: string
  avatar: string
  role: string
  simulationContext?: string | null
}

type Participant = {
  name: string
  avatar: string
  role: string
  email: string
}

function MessengerPageContent() {
  const searchParams = useSearchParams()
  const { 
    onboardingChannelTriggered, 
    triggerOnboardingEmail, 
    markMiaAsInteracted,
    onboardingMessages,
    conversationStage,
    addOnboardingMessage,
    setConversationStage,
    presidentDirectorChannelTriggered,
    startMissionBriefing,
    handleMissionBriefingResponse,
    aryaJoinedOnboarding,
    aryaHasNewMessages,
    onboardingHasNewMessages,
    messengerTypingState
  } = useAssessmentAssistant()
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [channels, setChannels] = useState<Channel[]>(messengerChannelsData)
  const [showContactSelection, setShowContactSelection] = useState(false)
  const [isContactAnimating, setIsContactAnimating] = useState(false)
  const [callEndProcessed, setCallEndProcessed] = useState(false)
  const [onboardingChannelAdded, setOnboardingChannelAdded] = useState(false)
  const [onboardingTriggered, setOnboardingTriggered] = useState(false)
  const [presidentDirectorChannelAdded, setPresidentDirectorChannelAdded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const onboardingTimeoutsRef = useRef<NodeJS.Timeout[]>([])

  // Handle call end redirect
  useEffect(() => {
    const callEnd = searchParams.get("callEnd")
    const contact = searchParams.get("contact")

    if (callEnd && (contact === "ezra" || contact === "arya") && !callEndProcessed) {
      setCallEndProcessed(true)
      
      // Use functional update to access the latest channels state
      setChannels((prevChannels) => {
        if (contact === "ezra") {
          // Find Ezra's channel
          const ezraChannel = prevChannels.find((channel) => channel.name === "Peluang Sponsorship S24")
          const ezraParticipant = ezraChannel?.participants.find((p) => p.name === "Ezra Kaell")

          if (ezraChannel && ezraParticipant) {
            // Auto-select Ezra's channel and participant
            setSelectedChannelId(ezraChannel.id)
            setSelectedParticipant(ezraParticipant)

            // Add call end messages
            const currentTime = new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })

            // Generate truly unique IDs with random strings
            const randomStr1 = Math.random().toString(36).substring(2, 8)
            const randomStr2 = Math.random().toString(36).substring(2, 8)
            
            const systemMessage = {
              id: `msg-system-${Date.now()}-${randomStr1}`,
              senderName: "System",
              senderAvatar: "S",
              content: callEnd === "complete" ? "Panggilan selesai (5:23 durasi)" : "Panggilan terputus (2:15 durasi)",
              timestamp: currentTime,
              isUser: false,
            }

            const ezraMessage = {
              id: `msg-ezra-${Date.now()}-${randomStr2}`,
              senderName: "Ezra Kaell",
              senderAvatar: "EK",
              content:
                callEnd === "complete"
                  ? "Terima kasih untuk diskusi yang produktif! Saya akan follow up action items yang kita bahas."
                  : "Sepertinya panggilan kita terputus. Bisa kita lanjutkan di sini atau coba call lagi.",
              timestamp: currentTime,
              isUser: false,
            }

            // Return updated channels
            return prevChannels.map((channel) =>
              channel.id === ezraChannel.id
                ? { ...channel, messages: [...channel.messages, systemMessage, ezraMessage] }
                : channel,
            )
          }
        } else if (contact === "arya") {
          // Find Arya's channel (President Director channel)
          const aryaChannel = prevChannels.find((channel) => channel.id === "president-director-channel")
          const aryaParticipant = aryaChannel?.participants.find((p) => p.name === "Arya Prajida")

          if (aryaChannel && aryaParticipant) {
            // Auto-select Arya's channel and participant
            setSelectedChannelId(aryaChannel.id)
            setSelectedParticipant(aryaParticipant)

            // Add call end messages
            const currentTime = new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })

            // Generate truly unique IDs with random strings
            const randomStr1 = Math.random().toString(36).substring(2, 8)
            const randomStr2 = Math.random().toString(36).substring(2, 8)
            
            const systemMessage = {
              id: `msg-system-${Date.now()}-${randomStr1}`,
              senderName: "System",
              senderAvatar: "S",
              content: callEnd === "complete" ? "Panggilan selesai (8:45 durasi)" : "Panggilan terputus (3:22 durasi)",
              timestamp: currentTime,
              isUser: false,
            }

            const aryaMessage = {
              id: `msg-arya-${Date.now()}-${randomStr2}`,
              senderName: "Arya Prajida",
              senderAvatar: "AP",
              content:
                callEnd === "complete"
                  ? "Terima kasih untuk percakapan yang menyenangkan! Saya senang bisa berkenalan dengan Anda. Selamat berkarya di Amboja!"
                  : "Sepertinya koneksi kita terputus. Tidak apa-apa, kita bisa lanjutkan kapan-kapan lagi.",
              timestamp: currentTime,
              isUser: false,
            }

            // Return updated channels
            return prevChannels.map((channel) =>
              channel.id === aryaChannel.id
                ? { ...channel, messages: [...channel.messages, systemMessage, aryaMessage] }
                : channel,
            )
          }
        }
        
        // If no matching channel found, return unchanged
        return prevChannels
      })
      
      // We're not clearing URL parameters to ensure the page works correctly when accessed directly
      // This allows the URL parameters to remain when the page is loaded directly
    }
  }, [searchParams, callEndProcessed]) // Removed channels from dependency array

  // Handle onboarding channel removal when tutorial is reset
  useEffect(() => {
    if (!onboardingChannelTriggered && onboardingChannelAdded) {
      // Remove the onboarding channel when tutorial is reset
      setChannels((prevChannels) => prevChannels.filter(channel => channel.id !== onboardingChannel.id))
      setOnboardingChannelAdded(false)
      // Reset selected channel if it was the onboarding channel
      if (selectedChannelId === onboardingChannel.id) {
        setSelectedChannelId(null)
        setSelectedParticipant(null)
      }
    }
  }, [onboardingChannelTriggered, onboardingChannelAdded, selectedChannelId])

  // Handle onboarding channel creation
  useEffect(() => {
    if (onboardingChannelTriggered && !onboardingChannelAdded) {
      setOnboardingChannelAdded(true)
      
      // Add the onboarding channel to the top of the channels list
      setChannels((prevChannels) => {
        // Check if onboarding channel already exists
        const hasOnboardingChannel = prevChannels.some(channel => channel.id === onboardingChannel.id)
        
        if (!hasOnboardingChannel) {
          // Create a new onboarding channel with persisted messages
          const newOnboardingChannel = {
            ...onboardingChannel,
            messages: onboardingMessages.map((message, index) => {
              // Only update timestamp for the initial message if it doesn't have one
              if (!message.timestamp) {
                const currentTime = new Date()
                currentTime.setSeconds(currentTime.getSeconds() + index * 30) // Stagger messages by 30 seconds
                
                return {
                  ...message,
                  timestamp: currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }),
                }
              }
              return message
            }),
            lastActivity: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          }
          
          // Don't auto-select the channel - let user discover it
          
          return [newOnboardingChannel, ...prevChannels]
        }
        
        return prevChannels
      })
    }
  }, [onboardingChannelTriggered, onboardingChannelAdded])

  // Handle President Director channel triggering
  useEffect(() => {
    if (presidentDirectorChannelTriggered && !presidentDirectorChannelAdded) {
      setPresidentDirectorChannelAdded(true)
      
      // Add the president director channel to the top of the channels list
      setChannels((prevChannels) => {
        // Check if president director channel already exists
        const hasPresidentDirectorChannel = prevChannels.some(channel => channel.id === presidentDirectorChannel.id)
        
        if (!hasPresidentDirectorChannel) {
          // Create the president director channel with current timestamp
          const newPresidentDirectorChannel = {
            ...presidentDirectorChannel,
            messages: presidentDirectorChannel.messages.map(message => ({
              ...message,
              timestamp: new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
            })),
            lastActivity: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          }
          
          // Auto-select the president director channel and participant
          setSelectedChannelId(newPresidentDirectorChannel.id)
          setSelectedParticipant(newPresidentDirectorChannel.participants.find(p => p.name === "Arya Prajida") || null)
          
          return [newPresidentDirectorChannel, ...prevChannels]
        }
        
        return prevChannels
      })
    }
  }, [presidentDirectorChannelTriggered, presidentDirectorChannelAdded])

  // Handle Arya joining the onboarding channel
  useEffect(() => {
    if (aryaJoinedOnboarding) {
      setChannels((prevChannels) => {
        return prevChannels.map(channel => {
          if (channel.id === "onboarding-channel") {
            // Check if Arya is already in the participants list
            const hasArya = channel.participants.some(p => p.name === "Arya Prajida")
            
            if (!hasArya) {
              // Add Arya as a participant
              const aryaParticipant = {
                name: "Arya Prajida",
                avatar: "AP",
                role: "President Director",
                email: "arya.prajida@amboja.com",
              }
              
              return {
                ...channel,
                participants: [...channel.participants, aryaParticipant],
                messages: onboardingMessages, // Use the latest messages from context
                lastActivity: new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }),
              }
            }
          }
          return channel
        })
      })
    }
  }, [aryaJoinedOnboarding, onboardingMessages])

  // Sync typing state from context (for onboarding channel messages)
  useEffect(() => {
    if (selectedChannelId === "onboarding-channel") {
      setIsTyping(messengerTypingState)
    }
  }, [messengerTypingState, selectedChannelId])

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId)
    setSelectedParticipant(null) // Reset participant selection when changing channels
  }

  const handleSelectParticipant = (participant: Participant) => {
    setSelectedParticipant(participant)
  }

  const handleAddNewChannel = () => {
    setShowContactSelection(true)
    setTimeout(() => setIsContactAnimating(true), 50)
  }

  const generateUniqueChannelName = (baseName: string): string => {
    const existingNames = channels.map((channel) => channel.name)

    if (!existingNames.includes(baseName)) {
      return baseName
    }

    let counter = 2
    let uniqueName = `${baseName} (${counter})`

    while (existingNames.includes(uniqueName)) {
      counter++
      uniqueName = `${baseName} (${counter})`
    }

    return uniqueName
  }

  const handleSelectAndCloseContactSelection = (selectedContactWithContext: ContactWithContext | null) => {
    if (selectedContactWithContext) {
      const { simulationContext, ...selectedContact } = selectedContactWithContext
      const contextToUse = simulationContext ?? "New Conversation"

      // Generate unique channel name based on context
      const uniqueChannelName = generateUniqueChannelName(contextToUse)

      // Create new channel
      const newChannel: Channel = {
        id: `channel_${Date.now()}`,
        name: uniqueChannelName,
        participants: [
          {
            name: "You",
            avatar: "Y",
            role: "Manager",
            email: "you@company.com",
          },
          selectedContact,
        ],
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderName: "You",
            senderAvatar: "Y",
            content: `Mulai percakapan baru untuk konteks: ${contextToUse}`,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            isUser: true,
          },
        ],
        lastActivity: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }

      // Add new channel to the beginning of the list
      setChannels((prevChannels) => [newChannel, ...prevChannels])

      // Auto-select the new channel and participant
      setSelectedChannelId(newChannel.id)
      setSelectedParticipant(selectedContact)
    }

    // Close contact selection panel
    setIsContactAnimating(false)
    setTimeout(() => setShowContactSelection(false), 300)
  }

  const selectedChannel = channels.find((channel) => channel.id === selectedChannelId)

  // Centralized message sending handler
  const handleSendMessage = (channelId: string, message: Message) => {
    setChannels((prevChannels) => {
      const updatedChannels = prevChannels.map(channel => 
        channel.id === channelId 
          ? { ...channel, messages: [...channel.messages, message] }
          : channel
      )
      
      return updatedChannels
    })

    // Also persist onboarding messages separately
    if (channelId === "onboarding-channel") {
      addOnboardingMessage(message)
    }

    // Handle onboarding flow responses from Mia Avira - moved outside setState
    if (channelId === "onboarding-channel" && selectedParticipant?.name === "Mia Avira" && message.isUser) {
      setConversationStage('responded')
      markMiaAsInteracted() // Mark that user has interacted with Mia
      
      // Use setTimeout to ensure state has updated
      setTimeout(() => {
        handleMiaAviraResponse(message.content, channelId)
      }, 100)
    }
  }

  // Handle Mia Avira response logic - FIXED: Immediate response trigger
  const handleMiaAviraResponse = (userMessage: string, channelId: string) => {
    console.log('Debug - userMessage:', userMessage)
    console.log('Debug - conversationStage:', conversationStage)
    
    // Pattern detection for specific responses (immediate, no state dependency)
    const isFeedbackResponse = /\b(ya|iya|baik|setuju|bagus|membantu|sangat|positif|terbantu|siap)\b/i.test(userMessage.toLowerCase()) && 
                              conversationStage === 'waiting_for_response'
    
    const emailConfirmationRegexTest = /\b(ya.*terima|sudah.*terima|terima.*email|email.*terima|dapat.*email|email.*dapat)\b/i.test(userMessage.toLowerCase())
    const isEmailConfirmation = emailConfirmationRegexTest && (conversationStage === 'mission_phase' || conversationStage === 'responded')
    
    console.log('Debug - emailConfirmationRegexTest:', emailConfirmationRegexTest)
    console.log('Debug - conversationStage === mission_phase:', conversationStage === 'mission_phase')
    console.log('Debug - conversationStage === responded:', conversationStage === 'responded')
    
    // Use persisted messages only for duplicate checking
    const messagesToCheck = channelId === "onboarding-channel" ? onboardingMessages : (channels.find(c => c.id === channelId)?.messages || [])
    const hasThankYouMessage = messagesToCheck.some(msg => msg.content.includes("Baik, terima kasih atas jawaban anda"))
    const hasEmailConfirmationMessage = messagesToCheck.some(msg => msg.content.includes("Baik, terima kasih konfirmasinya"))
    
    console.log('Debug - isFeedbackResponse:', isFeedbackResponse)
    console.log('Debug - isEmailConfirmation:', isEmailConfirmation)
    console.log('Debug - hasThankYouMessage:', hasThankYouMessage)
    console.log('Debug - hasEmailConfirmationMessage:', hasEmailConfirmationMessage)
    
    // Handle email confirmation response
    if (isEmailConfirmation && !hasEmailConfirmationMessage) {
      console.log('Debug - Triggering mission briefing!')
      // Use the new mission briefing system instead
      startMissionBriefing(handleSendMessage)
      return
    }
    
    // Handle feedback response - immediate trigger without counting messages
    if (isFeedbackResponse && !hasThankYouMessage) {
      // Send follow-up messages from Mia with typing animation
      const messages = [
        {
          id: `msg-mia-thanks-${Date.now()}`,
          content: "Baik, terima kasih atas jawaban anda.",
        },
        {
          id: `msg-mia-mission-intro-${Date.now() + 1}`,
          content: "Sebagai bagian dari onboarding, saya ingin memberikan Anda sebuah misi pertama. Ini akan membantu Anda terbiasa dengan alur kerja dan platform kita.",
        },
        {
          id: `msg-mia-email-${Date.now() + 2}`,
          content: "Saya baru saja mengirimkan **Email** dengan judul **'Misi Pertama Anda di Amboja'**. Bisa tolong cek dan kabari saya melalui fitur chat ini jika sudah Anda terima?",
        }
      ]

      // Send messages with typing animation
      messages.forEach((message, index) => {
        setTimeout(() => {
          // Start typing
          setIsTyping(true)
          
          // After typing delay, send message
          setTimeout(() => {
            const fullMessage = {
              ...message,
              senderName: "Mia Avira",
              senderAvatar: "MA",
              timestamp: new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              isUser: false,
            }
            handleSendMessage(channelId, fullMessage)
            setIsTyping(false)
            
            // Trigger email after the last message
            if (index === messages.length - 1) {
              setTimeout(() => {
                triggerOnboardingEmail()
                setConversationStage('mission_phase')
              }, 1000)
            }
          }, 2000) // 2 second typing delay
        }, index * 3500 + 1500) // Stagger messages by 3.5 seconds, start after 1.5 seconds
      })
    } 
    
    // Handle non-positive feedback response - immediate trigger
    const isNonPositiveFeedback = !isFeedbackResponse && conversationStage === 'waiting_for_response' && !hasThankYouMessage
    if (isNonPositiveFeedback) {
      // Handle non-positive response with typing animation
      const messages = [
        {
          id: `msg-mia-clarification-${Date.now()}`,
          content: "Terima kasih atas feedback Anda. Jika ada hal yang perlu diperbaiki dari AI Assistant kami, tim akan mengevaluasinya. Mari kita lanjutkan dengan proses onboarding.",
        },
        {
          id: `msg-mia-mission-intro-alt-${Date.now() + 1}`,
          content: "Sebagai bagian dari onboarding, saya ingin memberikan Anda sebuah misi pertama. Ini akan membantu Anda terbiasa dengan alur kerja dan platform kita.",
        },
        {
          id: `msg-mia-email-alt-${Date.now() + 2}`,
          content: "Saya baru saja mengirimkan **Email** dengan judul **'Misi Pertama Anda di Amboja'**. Bisa tolong cek dan kabari saya melalui fitur chat ini jika sudah Anda terima?",
        }
      ]

      // Send messages with typing animation
      messages.forEach((message, index) => {
        setTimeout(() => {
          // Start typing
          setIsTyping(true)
          
          // After typing delay, send message
          setTimeout(() => {
            const fullMessage = {
              ...message,
              senderName: "Mia Avira",
              senderAvatar: "MA",
              timestamp: new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              isUser: false,
            }
            handleSendMessage(channelId, fullMessage)
            setIsTyping(false)
            
            // Trigger email after the last message
            if (index === messages.length - 1) {
              setTimeout(() => {
                triggerOnboardingEmail()
                setConversationStage('mission_phase')
              }, 1000)
            }
          }, 2000) // 2 second typing delay
        }, index * 3500 + 1500) // Stagger messages by 3.5 seconds, start after 1.5 seconds
      })
    }
    
    // Handle mission briefing responses (task readiness and clarity checks)
    const isMissionBriefingResponse = conversationStage === 'task_readiness_check' || conversationStage === 'task_clarity_check'
    const isPositiveResponse = /\b(ya|iya|baik|setuju|siap|jelas|cukup)\b/i.test(userMessage.toLowerCase())
    
    console.log('Debug - isMissionBriefingResponse:', isMissionBriefingResponse)
    console.log('Debug - Mission briefing isPositiveResponse:', isPositiveResponse)
    
    if (isMissionBriefingResponse && isPositiveResponse) {
      console.log('Debug - Calling handleMissionBriefingResponse')
      handleMissionBriefingResponse(userMessage, handleSendMessage)
      return
    }
  }

  // Handle email confirmation response and continue with task assignment
  const handleEmailConfirmationResponse = (channelId: string) => {
    const messages = [
      {
        id: `msg-mia-confirmation-${Date.now()}`,
        content: "Baik, terima kasih konfirmasinya!",
      },
      {
        id: `msg-mia-task-intro-${Date.now() + 1}`,
        content: "Oke, misi Anda sederhana saja. Di email itu ada lampiran bernama 'Profil Perusahaan Amboja'.",
      },
      {
        id: `msg-mia-task-list-${Date.now() + 2}`,
        content: `Tugas Anda:

1. **Download** lampiran tersebut.

2. Lalu, **buka dan pelajari** isinya melalui menu **Document**.

3. Setelah itu, **buat sebuah dokumen baru** dengan judul **'Apa yang Saya Ketahui Tentang Amboja'**. Isinya adalah rangkuman singkat pemahaman Anda tentang perusahaan kita.

4. Terakhir, **balas email saya** tadi dan **lampirkan** dokumen rangkuman yang sudah Anda buat.`,
      },
      {
        id: `msg-mia-ai-hint-${Date.now() + 3}`,
        content: "Sedikit tips dari saya: Jangan ragu untuk minta bantuan AI Assistant kita untuk merangkum poin penting dari dokumen tersebut. Justru itu adalah salah satu tujuan platform PortrAI ini, yaitu membantu Anda mengolah informasi dengan cepat.",
      },
      {
        id: `msg-mia-encouragement-${Date.now() + 4}`,
        content: "Santai saja, tidak ada jawaban benar atau salah. Kami hanya ingin melihat bagaimana Anda menangkap dan mengolah informasi.",
      },
      {
        id: `msg-mia-closing-${Date.now() + 5}`,
        content: "Selamat mengerjakan misi pertama Anda!",
      }
    ]

    // Send messages with typing animation
    messages.forEach((message, index) => {
      setTimeout(() => {
        // Start typing
        setIsTyping(true)
        
        // After typing delay, send message
        setTimeout(() => {
          const fullMessage = {
            ...message,
            senderName: "Mia Avira",
            senderAvatar: "MA",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            isUser: false,
          }
          handleSendMessage(channelId, fullMessage)
          setIsTyping(false)
        }, 2000) // 2 second typing delay
      }, index * 3000) // 3 second delay between messages
    })
  }

  // Handle onboarding trigger when Mia is selected
  const handleOnboardingTrigger = () => {
    if (onboardingTriggered) return // Already triggered
    
    // Check if we already have the welcome and question messages in persisted state
    const hasWelcomeMessage = onboardingMessages.some(msg => msg.content.includes("Selamat datang di Amboja"))
    const hasQuestionMessage = onboardingMessages.some(msg => msg.content.includes("Bagaimana sejauh ini"))
    
    if (hasWelcomeMessage && hasQuestionMessage) return // Messages already added
    
    setOnboardingTriggered(true)
    
    // Clear any existing timeouts
    onboardingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    onboardingTimeoutsRef.current = []
    
    // Define the remaining messages with truly unique IDs
    const baseTimestamp = Date.now()
    const remainingMessages = [
      {
        id: `onboarding-auto-${baseTimestamp}-${Math.random().toString(36).substring(2)}-1`,
        senderName: "Mia Avira",
        senderAvatar: "MA",
        content: "Selamat datang di Amboja. Saya turut senang akhirnya Anda bergabung dengan tim kami hari ini.",
        isUser: false,
      },
      {
        id: `onboarding-auto-${baseTimestamp}-${Math.random().toString(36).substring(2)}-2`,
        senderName: "Mia Avira",
        senderAvatar: "MA",
        content: "Bagaimana sejauh ini? Apakah sesi perkenalan dengan AI Assistant kami cukup membantu?",
        isUser: false,
      }
    ]

    // Simulate typing for each message
    remainingMessages.forEach((message, index) => {
      const timeout1 = setTimeout(() => {
        // Start typing
        setIsTyping(true)
        
        // After typing delay, add message
        const timeout2 = setTimeout(() => {
          const messageWithTimestamp = {
            ...message,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          }
          handleSendMessage("onboarding-channel", messageWithTimestamp)
          setIsTyping(false)
          
          // Update conversation stage when the question is asked
          if (index === 1) { // The second message in the array (index 1) is the question
            setConversationStage('waiting_for_response')
          }
        }, 2000) // 2 second typing delay
        onboardingTimeoutsRef.current.push(timeout2)
      }, index * 3000) // Stagger messages by 3 seconds
      onboardingTimeoutsRef.current.push(timeout1)
    })
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      onboardingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  return (
    <Layout>
        <div className="h-[calc(100vh-120px)] flex px-6 pb-6">
          {/* Left Panel: Channel List */}
          <MessengerChannelList
            channels={channels}
            selectedChannelId={selectedChannelId}
            onChannelSelect={handleChannelSelect}
            onAddNewChannel={handleAddNewChannel}
          />

          {/* Contact Selection Overlay */}
          {showContactSelection && (
            <ContactSelection onClose={handleSelectAndCloseContactSelection} isAnimating={isContactAnimating} />
          )}

          {/* Middle and Right Panels */}
          {!showContactSelection && selectedChannelId === null && (
            /* Default State: Merged Empty State spanning middle and right columns */
            <MessengerEmptyState />
          )}

          {!showContactSelection && selectedChannelId !== null && selectedChannel && (
            <div className="flex-1 flex">
              {/* Middle Panel: Participant Selection */}
              <ParticipantSelection
                channel={selectedChannel}
                selectedParticipant={selectedParticipant}
                onSelectParticipant={handleSelectParticipant}
              />

              {!selectedParticipant ? (
                <div className="p-4 bg-gray-50 flex-1 flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Klik kontak untuk chat</h3>
                    <p className="text-gray-500">Tidak ada yang dipilih</p>
                  </div>
                </div>
              ) : (
                <ActiveMessengerChannel 
                  channel={selectedChannel} 
                  selectedParticipant={selectedParticipant}
                  onSendMessage={handleSendMessage}
                  onOnboardingTrigger={handleOnboardingTrigger}
                  isTyping={isTyping}
                  conversationStage={conversationStage}
                />
              )}
            </div>
          )}
        </div>
      </Layout>
  )
}

export default function MessengerPage() {
  return <MessengerPageContent />
}
