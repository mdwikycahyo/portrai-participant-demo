"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronLeft,
  Save,
  Table,
  Link2,
  Heading1,
  Heading2,
  ImageIcon,
  RefreshCw,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layout } from "@/components/layout"

export default function DocumentEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const documentId = searchParams.get("document")

  const [title, setTitle] = useState("Untitled Document")
  const [content, setContent] = useState("<p></p>")
  const [isSaving, setIsSaving] = useState(false)
  const [activeFormats, setActiveFormats] = useState<string[]>([])
  const editorRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState("100%")

  // Load existing document from localStorage if documentId is provided
  useEffect(() => {
    if (documentId) {
      try {
        const storedDocuments = localStorage.getItem("documents")
        if (storedDocuments) {
          const documents = JSON.parse(storedDocuments)
          const document = documents.find((doc: any) => doc.id === documentId)
          if (document) {
            setTitle(document.title)
            setContent(document.content)
          }
        }
      } catch (error) {
        console.error("Error loading document:", error)
      }
    }
  }, [documentId])

  // Initialize editor with content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  // Check for active formats when selection changes
  useEffect(() => {
    const checkFormats = () => {
      const newFormats: string[] = []

      if (document.queryCommandState("bold")) newFormats.push("bold")
      if (document.queryCommandState("italic")) newFormats.push("italic")
      if (document.queryCommandState("underline")) newFormats.push("underline")
      if (document.queryCommandState("justifyLeft")) newFormats.push("justifyLeft")
      if (document.queryCommandState("justifyCenter")) newFormats.push("justifyCenter")
      if (document.queryCommandState("justifyRight")) newFormats.push("justifyRight")
      if (document.queryCommandState("insertUnorderedList")) newFormats.push("insertUnorderedList")
      if (document.queryCommandState("insertOrderedList")) newFormats.push("insertOrderedList")

      setActiveFormats(newFormats)
    }

    document.addEventListener("selectionchange", checkFormats)
    return () => document.removeEventListener("selectionchange", checkFormats)
  }, [])

  const handleSave = () => {
    setIsSaving(true)

    // Get the current content from the editor
    const currentContent = editorRef.current?.innerHTML || ""

    // Create a new document object
    const newDocument = {
      id: documentId || Date.now().toString(),
      title: title || "Untitled Document",
      type: "doc",
      lastModified: new Date().toLocaleString(),
      owner: "You",
      content: currentContent,
    }

    // Save to localStorage
    try {
      const storedDocuments = localStorage.getItem("documents")
      let documents = storedDocuments ? JSON.parse(storedDocuments) : []

      if (documentId) {
        // Update existing document
        documents = documents.map((doc: any) => (doc.id === documentId ? newDocument : doc))
      } else {
        // Add new document
        documents = [newDocument, ...documents]
      }

      localStorage.setItem("documents", JSON.stringify(documents))

      // Dispatch custom event to notify document list to refresh
      window.dispatchEvent(new Event('documentsUpdated'))

      // Simulate saving delay
      setTimeout(() => {
        setIsSaving(false)
        toast({
          title: "Document saved",
          description: "Your document has been saved successfully.",
        })
        router.push("/documents")
      }, 1000)
    } catch (error) {
      console.error("Error saving document:", error)
      setIsSaving(false)
      toast({
        title: "Error saving document",
        description: "There was an error saving your document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    // Reset title and content to initial values
    setTitle("Untitled Document")
    setContent("<p></p>")

    // Update the editor content
    if (editorRef.current) {
      editorRef.current.innerHTML = "<p></p>"
    }

    toast({
      title: "Document reset",
      description: "Your document has been reset.",
    })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const formatText = (command: string, value = "") => {
    // Focus the editor if it's not already focused
    if (document.activeElement !== editorRef.current) {
      editorRef.current?.focus()
    }

    // Execute the command
    document.execCommand(command, false, value)

    // Update active formats
    const newFormats = [...activeFormats]
    const commandIndex = newFormats.indexOf(command)

    if (document.queryCommandState(command)) {
      if (commandIndex === -1) newFormats.push(command)
    } else {
      if (commandIndex !== -1) newFormats.splice(commandIndex, 1)
    }

    setActiveFormats(newFormats)
  }

  const insertTable = () => {
    // Focus the editor if it's not already focused
    if (document.activeElement !== editorRef.current) {
      editorRef.current?.focus()
    }

    const html = `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; height: 40px;">Header 1</th>
            <th style="border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; height: 40px;">Header 2</th>
            <th style="border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; height: 40px;">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 8px 12px; height: 40px;"></td>
            <td style="border: 1px solid #d1d5db; padding: 8px 12px; height: 40px;"></td>
            <td style="border: 1px solid #d1d5db; padding: 8px 12px; height: 40px;"></td>
          </tr>
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 8px 12px; height: 40px;"></td>
            <td style="border: 1px solid #d1d5db; padding: 8px 12px; height: 40px;"></td>
            <td style="border: 1px solid #d1d5db; padding: 8px 12px; height: 40px;"></td>
          </tr>
        </tbody>
      </table>
    `
    document.execCommand("insertHTML", false, html)
  }

  const insertHeading = (level: number) => {
    // Focus the editor if it's not already focused
    if (document.activeElement !== editorRef.current) {
      editorRef.current?.focus()
    }

    // Save the current selection
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString() || `Heading ${level}`

    // Create the heading element with styles
    let headingHTML = ""
    if (level === 1) {
      headingHTML = `<h1 style="font-size: 28px; margin-top: 24px; margin-bottom: 16px; color: #333; font-weight: bold;">${selectedText}</h1>`
    } else {
      headingHTML = `<h2 style="font-size: 22px; margin-top: 20px; margin-bottom: 12px; color: #444; font-weight: bold;">${selectedText}</h2>`
    }

    // Insert the heading
    document.execCommand("insertHTML", false, headingHTML)
  }

  const insertBulletList = () => {
    // Focus the editor if it's not already focused
    if (document.activeElement !== editorRef.current) {
      editorRef.current?.focus()
    }

    // Check if we already have a selection
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      // If no selection, insert a new bullet list
      const html = `
        <ul style="margin-bottom: 16px; padding-left: 24px; list-style-type: disc;">
          <li style="margin-bottom: 8px;">List item 1</li>
          <li style="margin-bottom: 8px;">List item 2</li>
          <li style="margin-bottom: 8px;">List item 3</li>
        </ul>
      `
      document.execCommand("insertHTML", false, html)
    } else {
      // If there's a selection, try to use the built-in command first
      document.execCommand("insertUnorderedList", false)

      // Then apply our styling to the newly created list
      const lists = editorRef.current?.querySelectorAll("ul")
      if (lists && lists.length > 0) {
        const lastList = lists[lists.length - 1]
        lastList.style.marginBottom = "16px"
        lastList.style.paddingLeft = "24px"
        lastList.style.listStyleType = "disc"

        const items = lastList.querySelectorAll("li")
        items.forEach((item) => {
          item.style.marginBottom = "8px"
        })
      }
    }
  }

  const insertNumberedList = () => {
    // Focus the editor if it's not already focused
    if (document.activeElement !== editorRef.current) {
      editorRef.current?.focus()
    }

    // Check if we already have a selection
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      // If no selection, insert a new numbered list
      const html = `
        <ol style="margin-bottom: 16px; padding-left: 24px; list-style-type: decimal;">
          <li style="margin-bottom: 8px;">List item 1</li>
          <li style="margin-bottom: 8px;">List item 2</li>
          <li style="margin-bottom: 8px;">List item 3</li>
        </ol>
      `
      document.execCommand("insertHTML", false, html)
    } else {
      // If there's a selection, try to use the built-in command first
      document.execCommand("insertOrderedList", false)

      // Then apply our styling to the newly created list
      const lists = editorRef.current?.querySelectorAll("ol")
      if (lists && lists.length > 0) {
        const lastList = lists[lists.length - 1]
        lastList.style.marginBottom = "16px"
        lastList.style.paddingLeft = "24px"
        lastList.style.listStyleType = "decimal"

        const items = lastList.querySelectorAll("li")
        items.forEach((item) => {
          item.style.marginBottom = "8px"
        })
      }
    }
  }

  const insertImage = () => {
    // Focus the editor if it's not already focused
    if (document.activeElement !== editorRef.current) {
      editorRef.current?.focus()
    }

    const url = prompt("Enter image URL:", "https://")
    if (url) {
      const html = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto; margin: 16px 0; display: block;" />`
      document.execCommand("insertHTML", false, html)
    }
  }

  const handleFontSizeChange = (value: string) => {
    setFontSize(value)

    // Focus the editor if it's not already focused
    if (document.activeElement !== editorRef.current) {
      editorRef.current?.focus()
    }

    // Get the current selection
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    // If there's a selection, wrap it in a span with the font size
    const range = selection.getRangeAt(0)
    if (!range.collapsed) {
      // There is selected text, apply font size to selection
      const span = document.createElement("span")
      span.style.fontSize = value

      // Apply the span to the selected content
      const selectedContent = range.extractContents()
      span.appendChild(selectedContent)
      range.insertNode(span)
    } else {
      // No selection, just set the default font size for the editor
      if (editorRef.current) {
        editorRef.current.style.fontSize = value
      }
    }
  }

  return (
    <Layout>
      <div className="px-6 pb-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push("/documents")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-xl font-bold border-none shadow-none focus-visible:ring-0 w-[300px] md:w-[500px]"
              placeholder="Document Title"
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"} <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <TooltipProvider>
          <div className="mb-4 bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex flex-wrap gap-1">
            {/* Font size selector */}
            <div className="flex items-center mr-2">
              <Select value={fontSize} onValueChange={handleFontSizeChange}>
                <SelectTrigger className="w-[100px] h-8">
                  <SelectValue placeholder="Font Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="75%">75%</SelectItem>
                  <SelectItem value="90%">90%</SelectItem>
                  <SelectItem value="100%">100%</SelectItem>
                  <SelectItem value="125%">125%</SelectItem>
                  <SelectItem value="150%">150%</SelectItem>
                  <SelectItem value="200%">200%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Text formatting */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("bold")}
                    className={activeFormats.includes("bold") ? "bg-accent" : ""}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("italic")}
                    className={activeFormats.includes("italic") ? "bg-accent" : ""}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("underline")}
                    className={activeFormats.includes("underline") ? "bg-accent" : ""}
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Underline</TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Alignment */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("justifyLeft")}
                    className={activeFormats.includes("justifyLeft") ? "bg-accent" : ""}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Left</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("justifyCenter")}
                    className={activeFormats.includes("justifyCenter") ? "bg-accent" : ""}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Center</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("justifyRight")}
                    className={activeFormats.includes("justifyRight") ? "bg-accent" : ""}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Right</TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Lists */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={insertBulletList}
                    className={activeFormats.includes("insertUnorderedList") ? "bg-accent" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={insertNumberedList}
                    className={activeFormats.includes("insertOrderedList") ? "bg-accent" : ""}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Insert elements */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertHeading(1)}>
                    <Heading1 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 1</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertHeading(2)}>
                    <Heading2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 2</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={insertTable}>
                    <Table className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Table</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={insertImage}>
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Image</TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Links */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const url = prompt("Enter URL:")
                      if (url) formatText("createLink", url)
                    }}
                  >
                    <Link2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Link</TooltipContent>
              </Tooltip>
            </div>
            </div>
          </div>
        </TooltipProvider>

        <div
          className="bg-white rounded-lg border border-gray-200 p-6 min-h-[60vh] focus:outline-none"
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => {
          // We don't need to update state on every input as we'll get the content when saving
          // This prevents cursor position issues
        }}
        style={{ fontSize }}
      />

        {/* Reset button at the bottom */}
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Document
          </Button>
        </div>
      </div>
    </Layout>
  )
}
