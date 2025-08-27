"use client"

import type { Channel } from "@/lib/messenger-data"
import { useAssessmentAssistant } from "@/contexts/assessment-assistant-context"

type Participant = {
  name: string
  avatar: string
  role: string
  email: string
}

interface ParticipantSelectionProps {
  channel: Channel
  selectedParticipant: Participant | null
  onSelectParticipant: (participant: Participant) => void
}

export function ParticipantSelection({ channel, selectedParticipant, onSelectParticipant }: ParticipantSelectionProps) {
  const { onboardingChannelTriggered, hasInteractedWithMia } = useAssessmentAssistant()
  
  // Static timestamps for participants as shown in the design
  const participantTimestamps = ["11:30 AM", "09:00 AM", "08:45 AM", "02:30 PM", "10:15 AM"]

  // Filter out "You" from the participant list
  const filteredParticipants = channel.participants.filter((participant) => participant.name !== "You")
  
  // Check if this is Mia Avira in the onboarding channel and user hasn't interacted yet
  const isMiaInOnboarding = (participant: Participant) => 
    channel.id === "onboarding-channel" && 
    participant.name === "Mia Avira" && 
    onboardingChannelTriggered &&
    !hasInteractedWithMia

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Participants List */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {filteredParticipants.map((participant, index) => (
            <div
              key={index}
              onClick={() => onSelectParticipant(participant)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedParticipant?.name === participant.name
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                {participant.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{participant.name}</h3>
                    {isMiaInOnboarding(participant) && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {participantTimestamps[index % participantTimestamps.length]}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{participant.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
