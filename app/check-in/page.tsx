"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CheckInPage() {
  const router = useRouter()

  const handleCheckIn = () => {
    // Simulate starting the assessment by navigating to the home page
    router.push("/home")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg space-y-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center p-1">
            <svg
              width="30"
              height="31"
              viewBox="0 0 30 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.49994 3.22034C5.43766 3.97671 4.47707 4.87098 3.64318 5.87766C7.05081 5.55551 11.3801 6.08155 16.4063 8.64066C21.7736 11.3733 26.0957 11.4657 29.1036 10.8749C28.8307 10.0335 28.487 9.22474 28.0801 8.45594C24.6368 8.82575 20.2225 8.33625 15.0781 5.71705C11.8113 4.05379 8.9317 3.36864 6.49994 3.22034ZM26.0687 5.54063C23.3495 2.44695 19.3979 0.5 14.9997 0.5C13.7081 0.5 12.4549 0.667935 11.2602 0.983509C12.8782 1.43309 14.5972 2.09082 16.4063 3.01196C20.1728 4.92962 23.4246 5.54707 26.0687 5.54063ZM29.7467 13.8285C26.1128 14.5592 21.0948 14.4092 15.0781 11.3457C9.4531 8.4818 4.97608 8.51787 1.95662 9.20115C1.80077 9.23639 1.64858 9.27343 1.50007 9.312C1.10475 10.1875 0.78919 11.1081 0.562774 12.0641C0.804599 11.9983 1.05449 11.9358 1.31231 11.8774C4.97544 11.0485 10.1511 11.0845 16.4063 14.2693C22.0314 17.1333 26.5084 17.0972 29.5279 16.4139C29.6313 16.3906 29.7333 16.3664 29.8335 16.3414C29.8445 16.103 29.85 15.8631 29.85 15.6219C29.85 15.0152 29.8149 14.4167 29.7467 13.8285ZM29.3486 19.5327C25.75 20.1733 20.8782 19.9275 15.0781 16.9744C9.4531 14.1105 4.97608 14.1466 1.95662 14.8298C1.28639 14.9814 0.68346 15.1662 0.15159 15.3612C0.150139 15.4479 0.149414 15.5348 0.149414 15.6219C0.149414 23.9736 6.79811 30.7439 14.9997 30.7439C21.8732 30.7439 27.6561 25.9887 29.3486 19.5327Z"
                fill="#F3F4F6"
              />
            </svg>
          </div>
          <span className="text-2xl font-semibold text-gray-900">Logoipsum</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mt-8">Selamat Datang di PortrAI</h1>

        <p className="text-lg text-gray-700 leading-relaxed max-w-ld mx-auto">
          Sesi asesmen Anda hari ini siap dimulai. Setelah mengklik &quot;Check In&quot;, sesi asesmen akan mulai berjalan dan terus aktif hingga Anda &quot;Check Out&quot; atau waktu sesi asesmen Anda habis.
        </p>

        <Button
          onClick={handleCheckIn}
          className="w-full max-w-xs bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Check In
        </Button>

        <p className="text-sm text-gray-600 mt-4">Pastikan Anda siap untuk memulai asesmen Anda sebelum check-in.</p>
      </div>
    </div>
  )
}
