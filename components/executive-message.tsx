"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const messages = [
  {
    id: 1,
    title: "Pesan dari Eksekutif",
    author: "Arya Prajida",
    position: "President Director",
    avatar: "AP",
    content: `Dear Participant,

Kita tengah memasuki fase penting dalam perjalanan Amboja sebagai perusahaan teknologi yang berbasis pada keberlanjutan dan inovasi. Setelah bertahun-tahun berfokus pada perluasan pasar dan efisiensi operasional, kini saatnya kita memperkuat fondasi manusia di balik semua pencapaian itu.

Saya percaya bahwa keberhasilan jangka panjang hanya bisa dicapai jika kita mampu membangun budaya kerja yang kolaboratif, sehat secara psikologis, dan menyenangkan. Keseimbangan antara target dan keterlibatan karyawan adalah kunci untuk menjaga performa tetap stabil di tengah tekanan.

Karena itu, saya ingin mengajak seluruh pimpinan untuk memberikan ruang bagi inisiatif yang mampu memperkuat keterikatan dan kebersamaan tim. Kegiatan engagement internal bukan sekadar acara hiburan, melainkan investasi terhadap ketahanan organisasi kita di masa depan.

Terima kasih atas dedikasi dan partisipasi Anda.

Best regards,

Arya Prajida
President Director`,
  },
]

export function ExecutiveMessage() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const message = messages[currentMessage]

  const nextMessage = () => {
    setCurrentMessage((prev) => (prev + 1) % messages.length)
  }

  const prevMessage = () => {
    setCurrentMessage((prev) => (prev - 1 + messages.length) % messages.length)
  }

  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-white font-medium">{message.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevMessage}
            className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="bg-gray-600 text-white px-2 py-1 rounded-xl text-sm">{currentMessage + 1}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextMessage}
            className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {message.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{message.position}</h3>
            <p className="text-gray-600">{message.author}</p>
          </div>
        </div>

        {/* Message Content */}
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">{message.content}</div>
      </div>
    </div>
  )
}
