"use client"

import { useEffect, useRef } from "react"
import { useOnboardingTour } from "@/components/onboarding-tour"

export function AutoStartHomeTour() {
  const { isRunning, startHomeTour } = useOnboardingTour()
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    if (!isRunning) startHomeTour()
  }, [isRunning, startHomeTour])

  return null
}

