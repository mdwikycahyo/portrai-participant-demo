export interface CallHistoryItem {
  id: string
  contactName: string
  contactInitials: string
  contactRole: string
  duration: string
  status: "completed" | "missed" | "declined"
  timestamp: string
  callType: "outgoing"
}

export const callHistoryData: CallHistoryItem[] = [
  {
    id: "1",
    contactName: "Jessica Wong",
    contactInitials: "JW",
    contactRole: "Department Head",
    duration: "8:45",
    status: "completed",
    timestamp: "11:30 AM",
    callType: "outgoing",
  },
  {
    id: "2",
    contactName: "Emily Carter",
    contactInitials: "EC",
    contactRole: "Assistant Vice President",
    duration: "3:22",
    status: "completed",
    timestamp: "10:15 AM",
    callType: "outgoing",
  },
  {
    id: "3",
    contactName: "David Kim",
    contactInitials: "DK",
    contactRole: "Manager",
    duration: "15:33",
    status: "completed",
    timestamp: "9:45 AM",
    callType: "outgoing",
  },
]
