"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, FileText } from "lucide-react"
import { Layout } from "@/components/layout"
import { documentsData } from "@/lib/documents-data"
import { Button } from "@/components/ui/button"

export default function FolderPage() {
  const params = useParams()
  const router = useRouter()
  const folderId = params.folderId as string

  const folder = documentsData.folders.find((f) => f.id === folderId)

  if (!folder) {
    return (
      <Layout>
        <div className="px-6 pb-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Folder tidak ditemukan</h1>
            <Button onClick={() => router.push("/documents")}>Kembali ke Documents</Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push("/documents")} className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold text-gray-900">{folder.name}</h1>
        </div>

        {/* All Files Section */}
        <div>
          {folder.files.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Tidak ada file dalam folder ini</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
                <div className="col-span-2">Nama</div>
                <div>Tanggal</div>
                <div>Pemilik</div>
                <div></div>
              </div>
              <div className="divide-y divide-gray-200">
                {folder.files.map((file) => (
                  <Link
                    key={file.id}
                    href={`/documents/file/${file.id}`}
                    className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-2 flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-900">{file.name}</span>
                    </div>
                    <div className="flex items-center text-gray-600">{file.date}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {file.owner.avatar}
                      </div>
                      <span className="text-gray-900">{file.owner.name}</span>
                    </div>
                    <div></div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
