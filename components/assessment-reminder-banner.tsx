"use client"

import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AssessmentReminderBannerProps {
  onClose: () => void
}

export function AssessmentReminderBanner({ onClose }: AssessmentReminderBannerProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-blue-100 border-l-4 border-blue-500 shadow-sm">
      <div className="flex items-center space-x-3">
        <Info className="h-6 w-6 text-blue-500" />
        <div>
          <p className="font-semibold text-blue-800">Pengingat Waktu Asesmen</p>
          <p className="text-sm text-blue-700">
            Sesi asesmen Anda akan berakhir dalam waktu kurang dari 30 menit. Mohon gunakan waktu tersisa untuk menyelesaikan tugas Anda.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        className="border-blue-500 text-blue-700 hover:bg-blue-200 bg-transparent"
        onClick={onClose}
      >
        <span className="mr-1">✕</span> Tutup
      </Button>
    </div>
  )
}
