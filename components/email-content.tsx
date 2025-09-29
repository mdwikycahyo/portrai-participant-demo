"use client"

import { useState, useEffect } from "react"
import {
  Eye,
  Download,
  Reply,
  X,
  Send,
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAssessmentAssistant } from "@/contexts/assessment-assistant-context"
import { useToast } from "@/hooks/use-toast"

interface EmailContentProps {
  emailId: string
}

interface Reply {
  id: string
  content: string
  subject: string
  sender: string
  email: string
  recipientEmail: string
  date: string
  timestamp: number
  isUserReply: boolean
}

interface Contact {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  department: string
}

const contactsData: Contact[] = [
  {
    id: "dwiky-cahyo",
    name: "Dwiky Cahyo",
    email: "pm.corp@email.com",
    avatar: "DC",
    role: "Product Manager",
    department: "Product"
  },
  {
    id: "mia-avira",
    name: "Mia Avira",
    email: "mia.avira@company.com",
    avatar: "MA",
    role: "VP of Human Resources",
    department: "HR"
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    avatar: "SJ",
    role: "President Director",
    department: "Executive"
  },
  {
    id: "manager",
    name: "Your Manager",
    email: "manager@company.com",
    avatar: "MG",
    role: "Manager",
    department: "Your Team"
  },
  {
    id: "hr-team",
    name: "HR Team",
    email: "hr-team@company.com",
    avatar: "HR",
    role: "HR Team",
    department: "HR"
  },
  {
    id: "it-support",
    name: "IT Support",
    email: "it-support@company.com",
    avatar: "IT",
    role: "IT Support",
    department: "IT"
  }
]


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
  "product-manager": {
    sender: "Dwiky Cahyo",
    email: "pm.corp@email.com",
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
  const [replyMode, setReplyMode] = useState<"none" | "reply">("none")
  const [replyContent, setReplyContent] = useState("")
  const [replySubject, setReplySubject] = useState("")
  const [emailThreads, setEmailThreads] = useState<Record<string, Reply[]>>({})
  const [selectedRecipient, setSelectedRecipient] = useState<string>("")
  const [pendingRecipient, setPendingRecipient] = useState<string>("")
  const [showContactSelector, setShowContactSelector] = useState(false)
  const { markEmailAsRead, addDownloadedDocument, triggerEmailReplyWithAttachment } = useAssessmentAssistant()
  const { toast } = useToast()

  const email = emailData[emailId as keyof typeof emailData]

  // Mark email as read when first-mission email is opened
  useEffect(() => {
    if (emailId === "first-mission") {
      markEmailAsRead()
    }
  }, [emailId, markEmailAsRead])

  // Initialize selected recipient when entering reply mode
  useEffect(() => {
    if (replyMode === "reply" && email && !selectedRecipient) {
      // Default to Dwiky Cahyo (pm.corp@email.com)
      setSelectedRecipient("pm.corp@email.com")
    }
  }, [replyMode, email, selectedRecipient])

  // Initialize reply subject when entering reply mode
  useEffect(() => {
    if (replyMode === "reply" && email) {
      // Smart RE: handling - don't add RE: if already present
      const smartSubject = email.subject.startsWith('RE: ')
        ? email.subject
        : `RE: ${email.subject}`
      setReplySubject(smartSubject)
    }
  }, [replyMode, email])

  // Initialize pending recipient when opening contact selector
  useEffect(() => {
    if (showContactSelector) {
      setPendingRecipient(selectedRecipient || "pm.corp@email.com")
    }
  }, [showContactSelector, selectedRecipient])

  // Helper function to get contact details by email
  const getContactByEmail = (email: string): Contact | null => {
    return contactsData.find(contact => contact.email === email) || null
  }

  // Handle pending contact selection (radio button behavior)
  const handlePendingContactSelect = (contact: Contact) => {
    setPendingRecipient(contact.email)
  }

  // Confirm contact selection and close panel
  const handleConfirmContactSelection = () => {
    setSelectedRecipient(pendingRecipient)
    setShowContactSelector(false)
  }

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
      toast({
        title: "Dokumen Berhasil Didownload",
        description: `Dokumen "${attachmentName}" berhasil didownload dan ditambahkan ke Documents!`,
      })
    }
  }

  const handleSendReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: "Pesan Kosong",
        description: "Harap isi pesan balasan!",
        variant: "destructive",
      })
      return
    }

    if (!replySubject.trim()) {
      toast({
        title: "Subjek Kosong",
        description: "Harap isi subjek email!",
        variant: "destructive",
      })
      return
    }

    // Create new reply object
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      content: replyContent,
      subject: replySubject,
      sender: "You",
      email: "dwiky.cahyo@company.com",
      recipientEmail: selectedRecipient || email.email,
      date: new Date().toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      timestamp: Date.now(),
      isUserReply: true
    }

    // Add reply to thread
    setEmailThreads(prev => ({
      ...prev,
      [emailId]: [...(prev[emailId] || []), newReply]
    }))

    // Check if this is a reply to Mia's email
    const isMiaEmail = emailId === "first-mission"

    if (isMiaEmail) {
      // This is a reply to Mia's email - trigger the completion flow
      triggerEmailReplyWithAttachment()
    }

    // Simulate email sending
    toast({
      title: "Balasan Terkirim",
      description: "Email balasan berhasil dikirim!",
    })

    // Reset reply mode and content
    setReplyMode("none")
    setReplyContent("")
    setReplySubject("")
    setSelectedRecipient("")

    // Stay on email view to show the thread (removed navigation)
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
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-gray-500">{email.date}</span>
            <Button
              onClick={() => setReplyMode("reply")}
              size="sm"
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              <Reply className="w-4 h-4 mr-2" />
              Balas
            </Button>
          </div>
        </div>
        {/* Recipients */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">Kepada:</span> {email.recipients.join(", ")}
        </div>
      </div>

      {/* Reply Interface */}
      {replyMode === "reply" && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-6 mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Balas</h3>
              <Button variant="ghost" onClick={() => {
                setReplyMode("none")
                setReplyContent("")
                setReplySubject("")
                setSelectedRecipient("")
              }} className="p-1">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* To Field */}
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-medium text-gray-700 w-12">Kepada:</label>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                  {selectedRecipient || email.email}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowContactSelector(true)}
                  className="text-sm"
                >
                  Change Recipient
                </Button>
              </div>
            </div>

            {/* Subject */}
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-medium text-gray-700 w-12">Subjek:</label>
              <Input
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                className="flex-1"
                placeholder="Enter email subject"
              />
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

            {/* Message Area */}
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Area Teks"
              className="min-h-[200px] resize-none mb-4"
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button variant="outline" disabled>
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

      {/* Content - Only show when not in reply mode */}
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

          {/* Email Replies - Clean Corporate Style */}
          {emailThreads[emailId] && emailThreads[emailId].length > 0 && (
            <div className="mt-8 space-y-6">
              <h3 className="font-medium text-gray-900 text-lg border-b border-gray-200 pb-2">
                Replies ({emailThreads[emailId].length})
              </h3>
              {emailThreads[emailId].map((reply) => (
                <div key={reply.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                  <div className="p-4">
                    {/* Clean header with sender info */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-600 text-white text-sm font-medium flex items-center justify-center">
                          You
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{reply.sender}</p>
                          <p className="text-sm text-gray-500">{reply.date}</p>
                        </div>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">To:</span> {reply.recipientEmail}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Subject:</span> {reply.subject}
                      </div>
                    </div>
                    <div className="mt-4 text-gray-800 leading-relaxed">
                      {reply.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Original Email Content (when replying) */}
      {replyMode === "reply" && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="bg-gray-100 rounded-lg p-6 mx-4">
            <div className="text-sm text-gray-600 mb-4">Pesan Asli:</div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                  {emailId === "first-mission" ? "MA" : "DC"}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{email.sender}</p>
                  <p className="text-sm text-gray-600">&lt;{email.email}&gt;</p>
                </div>
                <span className="text-sm text-gray-500 ml-auto">{email.date}</span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Kepada:</span> {email.recipients.join(", ")}
              </div>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed mb-4">{email.content}</div>

              {/* Attachments in original message */}
              {email.attachments.length > 0 && (
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

      {/* Contact Selector Modal */}
      {showContactSelector && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={() => setShowContactSelector(false)}
          />
          {/* Modal */}
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg z-50 border-l border-gray-200">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Change Recipient</h3>
                  <Button variant="ghost" onClick={() => setShowContactSelector(false)} className="p-1">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-1">Select who should receive this reply</p>
              </div>

              {/* Contact List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {contactsData.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handlePendingContactSelect(contact)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                        pendingRecipient === contact.email
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-purple-600 text-sm">
                          {contact.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{contact.name}</p>
                          <p className="text-sm text-gray-600 truncate">{contact.role}</p>
                          <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                        </div>
                        {pendingRecipient === contact.email && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                        {selectedRecipient === contact.email && (
                          <span className="text-xs text-blue-600 font-medium">CURRENT</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowContactSelector(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmContactSelection}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!pendingRecipient}
                  >
                    Select
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
