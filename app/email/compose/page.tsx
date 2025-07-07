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
  FileText,
} from "lucide-react"
import { documentsData } from "@/lib/documents-data"

// Type for tracking selected documents and their pages
export type SelectedDocumentsMap = Record<string, number[]> // fileId -> array of selected page numbers

export default function ComposePage() {
  const router = useRouter()
  const [showContactSelection, setShowContactSelection] = useState(false)
  const [showDocumentSelection, setShowDocumentSelection] = useState(false)
  const [isContactAnimating, setIsContactAnimating] = useState(false)
  const [isDocumentAnimating, setIsDocumentAnimating] = useState(false)
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedDocumentsMap>({})
  const [attachedDocuments, setAttachedDocuments] = useState<SelectedDocumentsMap>({})
  const [recipient, setRecipient] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleOpenContactSelection = () => {
    setShowContactSelection(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsContactAnimating(true)
      })
    })
  }

  const handleContactSelect = (email: string) => {
    setSelectedContact(email)
    setRecipient(email)
    setIsContactAnimating(false)
    setTimeout(() => setShowContactSelection(false), 300)
  }

  const handleRemoveRecipient = () => {
    setRecipient("")
    setSelectedContact(null)
  }

  const handleDocumentSelectionChange = (newSelection: SelectedDocumentsMap) => {
    setSelectedDocuments(newSelection)
  }

  const handleOpenDocumentSelection = () => {
    setShowDocumentSelection(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDocumentAnimating(true)
      })
    })
  }

  const handleAttachDocuments = () => {
    // Move selected documents to attached documents
    setAttachedDocuments((prev) => ({ ...prev, ...selectedDocuments }))
    // Clear selection and close panel
    setSelectedDocuments({})
    setIsDocumentAnimating(false)
    setTimeout(() => setShowDocumentSelection(false), 300)
  }

  const handleRemoveAttachedDocument = (fileId: string) => {
    setAttachedDocuments((prev) => {
      const newAttached = { ...prev }
      delete newAttached[fileId]
      return newAttached
    })
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

  // Calculate total selected pages
  const totalSelectedPages = Object.values(selectedDocuments).reduce((sum, pages) => sum + pages.length, 0)
  const totalAttachedPages = Object.values(attachedDocuments).reduce((sum, pages) => sum + pages.length, 0)

  // Get file details for attached documents (updated to handle root files)
  const getFileDetails = (fileId: string) => {
    // Check in folders first
    for (const folder of documentsData.folders) {
      const file = folder.files.find((f) => f.id === fileId)
      if (file) return file
    }
    // Check in root files
    const rootFile = documentsData.rootFiles.find((f) => f.id === fileId)
    if (rootFile) return rootFile

    return null
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)] flex -mt-8 px-6 pb-6">
        {/* Main Compose Area */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={handleBack} className="p-2">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Tulis</h1>
            </div>
          </div>

          {/* Form Content (Scrollable) */}
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
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
                  onClick={handleOpenContactSelection}
                  className="ml-auto bg-transparent"
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

            {/* Attached Documents List (Moved here) */}
            {Object.keys(attachedDocuments).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Dokumen Terlampir:</h4>
                <div className="space-y-2">
                  {Object.entries(attachedDocuments).map(([fileId, pages]) => {
                    const file = getFileDetails(fileId)
                    if (!file) return null

                    return (
                      <div key={fileId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {pages.length} halaman terpilih dari {file.content.pages || 0}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAttachedDocument(fileId)}
                          className="p-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Message Area */}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Area Teks"
              className="min-h-[300px] resize-none"
            />
          </div>

          {/* Action Buttons (Fixed at bottom of card) */}
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <Button variant="outline" onClick={handleOpenDocumentSelection}>
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
            onSelectionChange={handleDocumentSelectionChange}
            onClose={handleCloseDocumentSelection}
            onAttach={handleAttachDocuments}
            isAnimating={isDocumentAnimating}
          />
        )}
      </div>
    </Layout>
  )
}
