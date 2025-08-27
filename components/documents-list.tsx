"use client"

import Link from "next/link"
import { Folder, FileText } from "lucide-react"
import { documentsData } from "@/lib/documents-data"
import { useAssessmentAssistant } from "@/contexts/assessment-assistant-context"

export function DocumentsList() {
  const { downloadedDocuments } = useAssessmentAssistant()
  
  // Combine original files with downloaded documents
  const allFiles = [...documentsData.allFiles, ...downloadedDocuments]
  
  return (
    <div className="px-6 pb-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Documents</h1>

      {/* Folders Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Folder</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentsData.folders.map((folder) => (
            <Link
              key={folder.id}
              href={`/documents/folder/${folder.id}`}
              className="block p-6 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mb-4">
                  <Folder className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{folder.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Files Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Semua File</h2>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
            <div className="col-span-2">Nama</div>
            <div>Tanggal</div>
            <div>Pemilik</div>
            <div>Folder</div>
          </div>
          <div className="divide-y divide-gray-200">
            {allFiles.map((file) => {
              const folder = documentsData.folders.find((f) => f.id === file.folderId)
              return (
                <Link
                  key={file.id}
                  href={`/documents/file/${file.id}`}
                  className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex gap-3 items-center col-span-2">
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
                  <div className="flex items-center text-gray-600">{folder?.name}</div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
