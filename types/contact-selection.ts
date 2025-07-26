export interface ContactSelectionProps {
  onClose: (
    contact: {
      name: string
      email: string
      avatar: string
      role: string
      simulationContext?: string | null
    } | null,
  ) => void
  isAnimating: boolean
}
