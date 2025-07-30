"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WorkHourBannerProps {
  onCheckOut: () => void
}

export function WorkHourBanner({ onCheckOut }: WorkHourBannerProps) {
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-orange-100 border-l-4 border-orange-500 shadow-sm">
      <div className="flex items-center space-x-3">
        <Clock className="h-6 w-6 text-orange-500" />
        <div>
          <p className="font-semibold text-orange-800">Jam kerja hari ini akan segera berakhir</p>
          <p className="text-sm text-orange-700">
            Mohon selesaikan tugas dan check out. Waktu tersisa: {formatTime(timeLeft)}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        className="border-orange-500 text-orange-700 hover:bg-orange-200 bg-transparent"
        onClick={onCheckOut}
      >
        Check Out
      </Button>
    </div>
  )
}
