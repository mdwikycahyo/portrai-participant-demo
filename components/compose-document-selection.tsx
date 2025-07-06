"use client"

import { Search, ChevronDown, ChevronRight, Folder, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { documentsData } from "@/lib/documents-data"

// Replace the existing documents and files constants with:
const folders = documentsData.folders.reduce(
  (acc, folder) => {
    acc[folder.name] = folder.files
    return acc
  },
  {} as Record<string, any[]>,
)

const files = documentsData.allFiles.map((file) => ({
  id: file.id,
  name: file.name,
  category: documentsData.folders.find((f) => f.id === file.folderId)?.name || "Unknown",
  date: file.date,
}))

interface ComposeDocumentSelectionProps {
  selectedDocuments: string[]
  onDocumentToggle: (docId: string) => void
  onClose: () => void
  isAnimating: boolean
}

export function ComposeDocumentSelection({
  selectedDocuments,
  onDocumentToggle,
  onClose,
  isAnimating,
}: ComposeDocumentSelectionProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => (prev.includes(folder) ? prev.filter((f) => f !== folder) : [...prev, folder]))
  }

  return (
    <div
      className={`w-50 bg-white border-l border-gray-200 h-full transition-all duration-300 ease-in-out transform ${
        isAnimating ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{selectedDocuments.length} dokumen terlampir</span>
            <Button variant="ghost" onClick={onClose} className="p-1 h-6 w-6">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Button className="bg-gray-800 hover:bg-gray-700 text-white">Lampirkan Dokumen</Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Cari Kontak" className="pl-10" disabled />
        </div>
      </div>

      {/* Documents */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Dokumen</h2>
          <Button variant="outline" size="sm" disabled>
            Semua <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Folders */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Folder</h3>
          <div className="space-y-2">
            {Object.entries(folders).map(([folder, folderFiles]) => (
              <div key={folder}>
                <button
                  onClick={() => toggleFolder(folder)}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded-lg text-left"
                >
                  <Folder className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">{folder}</span>
                  {expandedFolders.includes(folder) ? (
                    <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Files */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">File</h3>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1"
                    checked={selectedDocuments.includes(file.id)}
                    onChange={() => onDocumentToggle(file.id)}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{file.name}</h4>
                    <p className="text-sm text-gray-600">{file.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{file.date}</span>
                      <Button variant="outline" size="sm" disabled>
                        0/7 Halaman Terpilih <ChevronDown className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
