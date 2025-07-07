"use client"

import { Search, ChevronDown, ChevronRight, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { documentsData, type DocumentFile } from "@/lib/documents-data"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import type { SelectedDocumentsMap } from "@/app/email/compose/page"

interface ComposeDocumentSelectionProps {
  selectedDocuments: SelectedDocumentsMap
  onSelectionChange: (newSelection: SelectedDocumentsMap) => void
  onClose: () => void
  onAttach: () => void
  isAnimating: boolean
}

export function ComposeDocumentSelection({
  selectedDocuments,
  onSelectionChange,
  onClose,
  onAttach,
  isAnimating,
}: ComposeDocumentSelectionProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => (prev.includes(folderId) ? prev.filter((f) => f !== folderId) : [...prev, folderId]))
  }

  const handleFileCheckboxChange = (file: DocumentFile, isChecked: boolean) => {
    const newSelection = { ...selectedDocuments }
    if (isChecked) {
      // Select all pages by default when first selecting a file
      const totalPages = file.content.pages || 0
      const allPages = Array.from({ length: totalPages }, (_, i) => i + 1)
      newSelection[file.id] = allPages
    } else {
      // Remove file from selection
      delete newSelection[file.id]
    }
    onSelectionChange(newSelection)
  }

  const handlePageCheckboxChange = (file: DocumentFile, pageNumber: number, isChecked: boolean) => {
    const newSelection = { ...selectedDocuments }
    let currentSelectedPages = newSelection[file.id] || []

    if (isChecked) {
      // Add page if not already present
      if (!currentSelectedPages.includes(pageNumber)) {
        currentSelectedPages = [...currentSelectedPages, pageNumber].sort((a, b) => a - b)
      }
    } else {
      // Remove page
      currentSelectedPages = currentSelectedPages.filter((p) => p !== pageNumber)
    }

    if (currentSelectedPages.length > 0) {
      newSelection[file.id] = currentSelectedPages
    } else {
      // If no pages are selected, remove the file from selection
      delete newSelection[file.id]
    }
    onSelectionChange(newSelection)
  }

  const totalSelectedPages = Object.values(selectedDocuments).reduce((sum, pages) => sum + pages.length, 0)
  const hasSelection = totalSelectedPages > 0

  return (
    <div
      className={`w-[320px] bg-white border-l border-gray-200 h-full transition-all duration-300 ease-in-out transform ${
        isAnimating ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose} className="p-2">
              <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">{totalSelectedPages} halaman terpilih</span>
          </div>
          <Button
            onClick={onAttach}
            disabled={!hasSelection}
            className="bg-gray-800 hover:bg-gray-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
          >
            Lampirkan Dokumen
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Cari Dokumen" className="pl-10" disabled />
        </div>
      </div>

      {/* Documents Tree */}
      <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Dokumen</h2>
          <Button variant="outline" size="sm" disabled>
            Semua <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Integrated Folder/File Tree */}
        <div className="space-y-2">
          {documentsData.folders.map((folder) => (
            <div key={folder.id}>
              {/* Folder Header */}
              <button
                onClick={() => toggleFolder(folder.id)}
                className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded-lg text-left"
              >
                <Folder className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">{folder.name}</span>
                {expandedFolders.includes(folder.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                )}
              </button>

              {/* Files under this folder (shown when expanded) */}
              {expandedFolders.includes(folder.id) && (
                <div className="ml-6 mt-2 space-y-3">
                  {folder.files.map((file) => {
                    const totalPages = file.content.pages || 0
                    const selectedPagesCount = selectedDocuments[file.id]?.length || 0
                    const isFileChecked = selectedPagesCount > 0

                    return (
                      <div key={file.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 mt-1"
                            checked={isFileChecked}
                            onChange={(e) => handleFileCheckboxChange(file, e.target.checked)}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                            <p className="text-xs text-gray-500">{file.date}</p>
                            <div className="mt-2">
                              {totalPages > 0 && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger className="w-full" asChild>
                                    <Button variant="outline" size="sm" className="bg-transparent">
                                      {selectedPagesCount}/{totalPages} Halaman Terpilih{" "}
                                      <ChevronDown className="w-3 h-3 ml-1" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[--radix-dropdown-menu-trigger-width]">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                      <DropdownMenuCheckboxItem
                                        key={pageNumber}
                                        checked={selectedDocuments[file.id]?.includes(pageNumber) || false}
                                        onCheckedChange={(checked) =>
                                          handlePageCheckboxChange(file, pageNumber, checked)
                                        }
                                      >
                                        Halaman {pageNumber}
                                      </DropdownMenuCheckboxItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
