"use client"

import { useParams, useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Layout } from "@/components/layout"
import { documentsData } from "@/lib/documents-data"
import { Button } from "@/components/ui/button"

export default function DocumentPage() {
  const params = useParams()
  const router = useRouter()
  const fileId = params.fileId as string

  const file = documentsData.allFiles.find((f) => f.id === fileId)

  if (!file) {
    return (
      <Layout>
        <div className="px-6 pb-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Dokumen tidak ditemukan</h1>
            <Button onClick={() => router.push("/documents")}>Kembali ke Documents</Button>
          </div>
        </div>
      </Layout>
    )
  }

  const hasMultiplePages = file.content.pages && file.content.pages > 1

  return (
    <Layout>
      <div className="px-6 pb-6">
        {/* Document Content */}
        <div className="max-w-4xl mx-auto">
          {/* Document Header Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={() => router.back()} className="p-2">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">{file.content.title}</h1>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {file.owner.avatar}
              </div>
              <span className="text-gray-900 font-medium">{file.content.author}</span>
            </div>
            <p className="text-gray-600">Terakhir diperbarui: {file.content.lastUpdate}</p>
          </div>

          {/* Document Body Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="prose max-w-none">
              {hasMultiplePages ? (
                // Multi-page vertical scroll view (like Word/Google Docs)
                <div className="space-y-12">
                  {file.content.sections.map((section, index) => (
                    <div key={index} className="min-h-[600px] p-8 bg-white border border-gray-300 rounded-lg shadow-sm">
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-2">
                          Halaman {index + 1} dari {file.content.pages}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                      </div>
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed">{section.content}</div>
                    </div>
                  ))}
                </div>
              ) : (
                // Single page view
                <div className="space-y-8">
                  {file.content.sections.map((section, index) => (
                    <div key={index}>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed">{section.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
