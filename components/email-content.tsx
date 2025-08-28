"use client"

import { useState, useEffect } from "react"
import {
  Eye,
  Download,
  Forward,
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
  Send,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAssessmentAssistant } from "@/contexts/assessment-assistant-context"
import { ComposeDocumentSelection } from "@/components/compose-document-selection"
import { documentsData } from "@/lib/documents-data"
import { useRouter } from "next/navigation"
import { useDocuments } from "@/contexts/documents-context"

interface EmailContentProps {
  emailId: string
}

// Type for tracking selected documents and their pages
type SelectedDocumentsMap = Record<string, number[]> // fileId -> array of selected page numbers

const emailData = {
  "first-mission": {
    sender: "Mia Avira",
    email: "mia.avira@company.com",
    subject: "Misi Pertama Anda di Amboja",
    date: "Hari ini, 12:30 PM",
    recipients: [
      "dwiky.cahyo@company.com",
    ],
    content: `Halo Bapak Dwiky Cahyo,

Selamat datang di Amboja! Kami sangat senang Anda bergabung dengan tim kami.

Sebagai bagian dari proses onboarding, saya melampirkan profil perusahaan Amboja untuk membantu Anda memahami visi, misi, dan budaya kerja kami.

Silakan luangkan waktu untuk membaca dokumen tersebut. Jika ada pertanyaan, jangan ragu untuk menghubungi saya melalui chat atau email.

Salam hangat,

Mia Avira  
VP of Human Resources  
Amboja Technology`,
    attachments: [
      "Profil Perusahaan Amboja.pdf",
    ],
  },
  "ux-researcher": {
    sender: "Dwiky Cahyo",
    email: "ux.researcher@email.com",
    subject: "Kick-off Discussion",
    date: "April 15, 2025",
    recipients: [
      "me@email.com",
      "Douglas.Terry16@hotmail.com",
      "Gretchen_Christiansen25@yahoo.com",
      "Michael_Weissnat@gmail.com",
    ],
    content: `Dear Participant,

Kita tengah memasuki fase penting dalam perjalanan Amboja sebagai perusahaan teknologi yang berbasis pada keberlanjutan dan inovasi. Setelah bertahun-tahun berfokus pada perluasan pasar dan efisiensi operasional, kini saatnya kita memperkuat fondasi manusia di balik semua pencapaian itu.

Saya percaya bahwa keberhasilan jangka panjang hanya bisa dicapai jika kita mampu membangun budaya kerja yang kolaboratif, sehat secara psikologis, dan menyenangkan. Keseimbangan antara target dan keterlibatan karyawan adalah kunci untuk menjaga performa tetap stabil di tengah tekanan.

Karena itu, saya ingin mengajak seluruh pimpinan untuk memberikan ruang bagi inisiatif yang mampu memperkuat keterikatan dan kebersamaan tim. Kegiatan engagement internal bukan sekadar acara hiburan, melainkan investasi terhadap ketahanan organisasi kita di masa depan.

Terima kasih atas dedikasi dan partisipasi Anda.

Best regards,

Sarah Johnson
President Director`,
    attachments: [
      "Dokumen Referensi Kegiatan Engagement",
      "Dokumen Referensi Kegiatan Engagement",
      "Dokumen Referensi Kegiatan Engagement",
    ],
  },
}

export function EmailContent({ emailId }: EmailContentProps) {
  const router = useRouter()
  const [replyMode, setReplyMode] = useState<"none" | "reply" | "forward">("none")
  const [replyContent, setReplyContent] = useState("")
  const [forwardRecipient, setForwardRecipient] = useState("")
  const [showContactSelection, setShowContactSelection] = useState(false)
  const [showDocumentSelection, setShowDocumentSelection] = useState(false)
  const [isDocumentAnimating, setIsDocumentAnimating] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedDocumentsMap>({})
  const [attachedDocuments, setAttachedDocuments] = useState<SelectedDocumentsMap>({})
  const { savedDocuments } = useDocuments()
  const { markEmailAsRead, addDownloadedDocument, triggerEmailReplyWithAttachment } = useAssessmentAssistant()

  const email = emailData[emailId as keyof typeof emailData]

  // Mark email as read when first-mission email is opened
  useEffect(() => {
    if (emailId === "first-mission") {
      markEmailAsRead()
    }
  }, [emailId, markEmailAsRead])



  const handleDownload = (attachmentName: string) => {
    if (emailId === "first-mission" && attachmentName === "Profil Perusahaan Amboja.pdf") {
      const document = {
        id: "profil-perusahaan-amboja",
        name: "Profil Perusahaan Amboja.pdf",
        date: new Date().toLocaleDateString("id-ID", { 
          day: "numeric", 
          month: "short", 
          year: "numeric" 
        }),
        owner: { name: "Mia Avira", avatar: "MA" },
        folderId: null,
        content: {
          title: "Profil Perusahaan Amboja",
          author: "Mia Avira",
          lastUpdate: new Date().toLocaleDateString("id-ID", { 
            day: "numeric", 
            month: "long", 
            year: "numeric" 
          }),
          pages: 8,
          sections: [
            {
              title: "Tentang Amboja",
              content: `Amboja adalah perusahaan teknologi yang berfokus pada pengembangan solusi digital inovatif untuk berbagai industri. Didirikan pada tahun 2018, kami telah berkembang menjadi salah satu pemain utama dalam ekosistem teknologi Indonesia.

Visi kami adalah menjadi perusahaan teknologi terdepan yang memberikan dampak positif bagi masyarakat melalui inovasi berkelanjutan. Misi kami meliputi pengembangan produk teknologi yang user-friendly, pemberdayaan talenta lokal, dan kontribusi terhadap transformasi digital Indonesia.

Nilai-nilai perusahaan kami: Inovasi, Kolaborasi, Integritas, Keberlanjutan, dan Kepedulian terhadap Pelanggan.`
            },
            {
              title: "Budaya Kerja",
              content: `Di Amboja, kami percaya bahwa budaya kerja yang positif adalah kunci kesuksesan. Kami menerapkan prinsip work-life balance, mendorong kreativitas dan inovasi, serta membangun lingkungan kerja yang inklusif dan supportif.

Tim kami terdiri dari profesional muda yang passionate dan berpengalaman dari berbagai latar belakang. Kami menghargai keberagaman dan percaya bahwa perbedaan perspektif akan menghasilkan solusi yang lebih baik.

Kami juga berkomitmen untuk terus mengembangkan kemampuan karyawan melalui program pelatihan, mentoring, dan kesempatan untuk berkontribusi dalam proyek-proyek menantang.`
            }
          ],
        },
      }
      
      addDownloadedDocument(document)
      
      // Simulate download
      alert(`Dokumen "${attachmentName}" berhasil didownload dan ditambahkan ke Documents!`)
    }
  }

  // Document attachment handlers
  const handleOpenDocumentSelection = () => {
    setShowDocumentSelection(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDocumentAnimating(true)
      })
    })
  }

  const handleDocumentSelectionChange = (newSelection: SelectedDocumentsMap) => {
    setSelectedDocuments(newSelection)
  }

  const handleAttachDocuments = () => {
    // Move selected documents to attached documents
    setAttachedDocuments((prev) => ({ ...prev, ...selectedDocuments }))
    // Clear selection and close panel
    setSelectedDocuments({})
    setIsDocumentAnimating(false)
    setTimeout(() => setShowDocumentSelection(false), 300)
  }

  const handleCloseDocumentSelection = () => {
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

  // Get file details for attached documents
  const getFileDetails = (fileId: string) => {
    // Check in folders first
    for (const folder of documentsData.folders) {
      const file = folder.files.find((f) => f.id === fileId)
      if (file) return file
    }
    // Check in root files
    const rootFile = documentsData.rootFiles.find((f) => f.id === fileId)
    if (rootFile) return rootFile

    // Check in saved documents (already converted to DocumentFile format)
    const savedDoc = savedDocuments.find((doc) => doc.id === fileId)
    if (savedDoc) {
      return savedDoc
    }

    return null
  }

  // Handle send email reply
  const handleSendReply = () => {
    if (!replyContent.trim()) {
      alert("Harap isi pesan balasan!")
      return
    }

    // Check if this is a reply to Mia's email with attachments
    const isMiaEmail = emailId === "first-mission"
    const hasAttachments = Object.keys(attachedDocuments).length > 0
    
    if (isMiaEmail && hasAttachments) {
      // This is a reply to Mia's email with attachments - trigger the completion flow
      triggerEmailReplyWithAttachment()
    }
    
    // Simulate email sending
    alert(`Email balasan berhasil dikirim!`)
    
    // Reset reply mode and content
    setReplyMode("none")
    setReplyContent("")
    setAttachedDocuments({})
    
    // Navigate back to email list
    router.push("/email")
  }

  if (!email) return null

  return (
    <div className="flex-1 bg-white overflow-y-auto border-l border-gray-200">
      {" "}
      {/* Changed background to gray-50 and added padding */}
      {/* Header Card */}
      <div className="p-4 border-b border-gray-200">
        {" "}
        {/* Added bg-white, rounded, shadow, and margin-bottom */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">{email.subject}</h1>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                {emailId === "first-mission" ? "MA" : "DC"}
              </div>
              <div>
                <p className="font-medium text-gray-900">{email.sender}</p>
                <p className="text-sm text-gray-600">&lt;{email.email}&gt;</p>
              </div>
            </div>
          </div>
          <span className="text-sm text-gray-500">{email.date}</span>
        </div>
        {/* Recipients */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">Kepada:</span> {email.recipients.join(", ")}
        </div>
      </div>
      {/* Reply/Forward Interface */}
      {replyMode !== "none" && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {replyMode === "reply" ? "Balas" : "Teruskan Pesan"}
              </h3>
              <Button variant="ghost" onClick={() => setReplyMode("none")} className="p-1">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* To Field */}
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-medium text-gray-700 w-12">Kepada:</label>
              <div className="flex-1 flex items-center gap-2">
                {replyMode === "reply" ? (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                    Dwiky.wick@email.com
                    <button onClick={() => setReplyMode("none")} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    {forwardRecipient && (
                      <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                        {forwardRecipient}
                        <button onClick={() => setForwardRecipient("")} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowContactSelection(!showContactSelection)}
                      className="ml-auto"
                    >
                      Tambah Kontak
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-medium text-gray-700 w-12">Subjek:</label>
              <Input value={`${replyMode === "reply" ? "RE:" : "FW:"} ${email.subject}`} className="flex-1" readOnly />
            </div>

            {/* Rich Text Toolbar */}
            <div className="flex items-center gap-1 p-2 border border-gray-200 rounded-lg bg-white mb-4">
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

            {/* Attached Documents List */}
            {Object.keys(attachedDocuments).length > 0 && (
              <div className="space-y-2 mb-4">
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
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Area Teks"
              className="min-h-[200px] resize-none mb-4"
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleOpenDocumentSelection}>
                Lampirkan Dokumen
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" disabled>
                  Simpan sebagai Draft
                </Button>
                <Button 
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                  onClick={handleSendReply}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Kirim
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Content - Only show when not in reply/forward mode */}
      {replyMode === "none" && (
        <div className="p-4">
          {" "}
          {/* Added bg-white, rounded, shadow, and padding */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed mb-8">{email.content}</div>
          </div>
          {/* Attachments */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Lampiran</h3>
            <div className="space-y-3">
              {email.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
                      <div className="w-4 h-4 bg-gray-500 rounded-sm"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{attachment}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" disabled>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDownload(attachment)}
                      className="hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Action Buttons (when not in reply/forward mode) */}
          <div className="flex gap-3 mt-8">
            <Button onClick={() => setReplyMode("reply")} className="bg-gray-800 hover:bg-gray-700 text-white">
              Balas
            </Button>
          </div>
        </div>
      )}
      {/* Original Email Content (when replying/forwarding) */}
      {replyMode !== "none" && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="text-sm text-gray-600 mb-4">
              {replyMode === "reply" ? "Pesan Asli:" : "Pesan yang Diteruskan:"}
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                  UR
                </div>
                <div>
                  <p className="font-medium text-gray-900">M.Dwiky Wicak</p>
                  <p className="text-sm text-gray-600">&lt;Dwiky.wick@email.com&gt;</p>
                </div>
                <span className="text-sm text-gray-500 ml-auto">{email.date}</span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Kepada:</span> {email.recipients.join(", ")}
              </div>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed mb-4">{email.content}</div>

              {/* Attachments in forwarded message */}
              {replyMode === "forward" && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Lampiran</h4>
                  <div className="space-y-2">
                    {email.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                          <div className="w-3 h-3 bg-gray-500 rounded-sm"></div>
                        </div>
                        <span className="text-sm text-gray-900">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Document Selection Panel */}
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
  )
}
