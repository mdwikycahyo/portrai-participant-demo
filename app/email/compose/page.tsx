"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Layout } from "@/components/layout"
import { ComposeContactSelection } from "@/components/compose-contact-selection"
import { ComposeDocumentSelection } from "@/components/compose-document-selection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronLeft,
  X,
  Bold,
  Italic,
  Underline,
  Link,
  ImageIcon,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"

export default function ComposePage() {
  const router = useRouter()
  const [showContactSelection, setShowContactSelection] = useState(false)
  const [showDocumentSelection, setShowDocumentSelection] = useState(false)
  const [isContactAnimating, setIsContactAnimating] = useState(false)
  const [isDocumentAnimating, setIsDocumentAnimating] = useState(false)
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [recipient, setRecipient] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleContactSelect = (email: string) => {
    setSelectedContact(email)
    setRecipient(email)
    setShowContactSelection(false)
  }

  const handleRemoveRecipient = () => {
    setRecipient("")
    setSelectedContact(null)
  }

  const handleDocumentToggle = (docId: string) => {
    setSelectedDocuments((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  const handleBack = () => {
    router.push("/email")
  }

  const handleCloseContactSelection = () => {
    setIsContactAnimating(false)
    setTimeout(() => setShowContactSelection(false), 300)
  }

  const handleCloseDocumentSelection = () => {
    setIsDocumentAnimating(false)
    setTimeout(() => setShowDocumentSelection(false), 300)
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex -mt-8 px-6 pb-6">
        {/* Main Compose Area */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={handleBack} className="p-2">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Tulis</h1>
            </div>
            {showDocumentSelection && (
              <span className="text-sm text-gray-600">{selectedDocuments.length} dokumen terlampir</span>
            )}
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">
            {/* To Field */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-12">Kepada:</label>
              <div className="flex-1 flex items-center gap-2">
                {recipient && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                    {recipient}
                    <button onClick={handleRemoveRecipient} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsContactAnimating(true)
                    setShowContactSelection(!showContactSelection)
                  }}
                  className="ml-auto"
                >
                  Tambah Kontak
                </Button>
              </div>
            </div>

            {/* Subject */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-12">Subjek:</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subjek"
                className="flex-1"
              />
            </div>

            {/* Rich Text Toolbar */}
            <div className="flex items-center gap-1 p-2 border border-gray-200 rounded-lg bg-gray-50">
              <Button variant="ghost" size="sm" disabled>
                <Bold className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <Italic className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <Underline className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <Button variant="ghost" size="sm" disabled>
                <Link className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <ImageIcon className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <Button variant="ghost" size="sm" disabled>
                <List className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <Button variant="ghost" size="sm" disabled>
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Message Area */}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Area Teks"
              className="min-h-[300px] resize-none"
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDocumentAnimating(true)
                  setShowDocumentSelection(!showDocumentSelection)
                }}
              >
                Lampirkan Dokumen
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" disabled>
                  Simpan sebagai Draft
                </Button>
                <Button className="bg-gray-800 hover:bg-gray-700 text-white" disabled>
                  Kirim
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panels */}
        {showContactSelection && (
          <ComposeContactSelection
            selectedContact={selectedContact}
            onContactSelect={handleContactSelect}
            onClose={handleCloseContactSelection}
            isAnimating={isContactAnimating}
          />
        )}

        {showDocumentSelection && (
          <ComposeDocumentSelection
            selectedDocuments={selectedDocuments}
            onDocumentToggle={handleDocumentToggle}
            onClose={handleCloseDocumentSelection}
            isAnimating={isDocumentAnimating}
          />
        )}
      </div>
    </Layout>
  )
}
