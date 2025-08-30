"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
import type { DocumentFile } from "@/lib/documents-data"

interface SavedDocument {
  id: string
  title: string
  type: string
  lastModified: string
  owner: string
  content: string
}

interface DocumentsContextType {
  savedDocuments: DocumentFile[]
  rawSavedDocuments: SavedDocument[]
  addDocument: (document: SavedDocument) => void
  updateDocument: (id: string, document: SavedDocument) => void
  deleteDocument: (id: string) => void
  getDocumentById: (id: string) => SavedDocument | undefined
  refreshDocuments: () => void
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined)

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [rawSavedDocuments, setRawSavedDocuments] = useState<SavedDocument[]>([])
  const [savedDocuments, setSavedDocuments] = useState<DocumentFile[]>([])

  // Convert raw saved documents to DocumentFile format
  const convertToDocumentFile = useCallback((doc: SavedDocument): DocumentFile => ({
    id: doc.id,
    name: doc.title + ".doc",
    date: doc.lastModified || new Date().toLocaleDateString("id-ID", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    }),
    owner: { name: "You", avatar: "YU" },
    folderId: null,
    content: {
      title: doc.title,
      author: "You",
      lastUpdate: doc.lastModified || new Date().toLocaleDateString("id-ID", { 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
      }),
      sections: [
        {
          title: "Content",
          content: doc.content || ""
        }
      ],
      pages: 1
    }
  }), [])

  // Load documents from localStorage
  const loadDocuments = useCallback(() => {
    try {
      const storedDocuments = localStorage.getItem("documents")
      if (storedDocuments) {
        const documents: SavedDocument[] = JSON.parse(storedDocuments)
        setRawSavedDocuments(documents)
        
        // Convert to DocumentFile format
        const convertedDocs = documents.map(convertToDocumentFile)
        setSavedDocuments(convertedDocs)
      }
    } catch (error) {
      console.error("Error loading saved documents:", error)
    }
  }, [convertToDocumentFile])

  // Save documents to localStorage
  const saveDocuments = useCallback((documents: SavedDocument[]) => {
    try {
      localStorage.setItem("documents", JSON.stringify(documents))
      setRawSavedDocuments(documents)
      
      // Convert to DocumentFile format
      const convertedDocs = documents.map(convertToDocumentFile)
      setSavedDocuments(convertedDocs)
    } catch (error) {
      console.error("Error saving documents:", error)
    }
  }, [convertToDocumentFile])

  // Add a new document
  const addDocument = useCallback((document: SavedDocument) => {
    const updatedDocuments = [document, ...rawSavedDocuments]
    saveDocuments(updatedDocuments)
  }, [rawSavedDocuments, saveDocuments])

  // Update an existing document
  const updateDocument = useCallback((id: string, document: SavedDocument) => {
    const updatedDocuments = rawSavedDocuments.map((doc) => 
      doc.id === id ? document : doc
    )
    saveDocuments(updatedDocuments)
  }, [rawSavedDocuments, saveDocuments])

  // Delete a document
  const deleteDocument = useCallback((id: string) => {
    const updatedDocuments = rawSavedDocuments.filter((doc) => doc.id !== id)
    saveDocuments(updatedDocuments)
  }, [rawSavedDocuments, saveDocuments])

  // Get document by ID
  const getDocumentById = useCallback((id: string) => {
    return rawSavedDocuments.find((doc) => doc.id === id)
  }, [rawSavedDocuments])

  // Refresh documents from localStorage
  const refreshDocuments = useCallback(() => {
    loadDocuments()
  }, [loadDocuments])

  // Load documents on mount
  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "documents") {
        loadDocuments()
      }
    }

    const handleCustomEvent = () => {
      loadDocuments()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('documentsUpdated', handleCustomEvent)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('documentsUpdated', handleCustomEvent)
    }
  }, [loadDocuments])

  const value: DocumentsContextType = {
    savedDocuments,
    rawSavedDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
    refreshDocuments,
  }

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentsContext)
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentsProvider")
  }
  return context
}

export type { SavedDocument }
