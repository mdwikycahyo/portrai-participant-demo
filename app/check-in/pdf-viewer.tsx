'use client'

import { useState, useEffect } from 'react'

export default function PDFViewer() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Use local PDF file from public folder
  const pdfUrl = "/pdfs/company-profile.pdf"
  
  // Handle iframe load events
  const handleIframeLoad = () => {
    setLoading(false)
    setError(null)
    console.log('PDF loaded successfully via iframe')
    // Estimate total pages (you can customize this based on your PDF)
    setTotalPages(12) // Adjust this to match your actual PDF page count
  }

  const handleIframeError = () => {
    console.error('Error loading PDF in iframe')
    setError('Failed to load PDF document. Please contact support.')
    setLoading(false)
  }

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  // Zoom functions
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200)) // Max 200%
  }

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50)) // Min 50%
  }

  const resetZoom = () => {
    setZoom(100)
  }

  // Fullscreen functions using browser's native fullscreen API
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen - target the PDF viewer container
        const pdfViewerElement = document.getElementById('pdf-viewer-container')
        if (pdfViewerElement) {
          if (pdfViewerElement.requestFullscreen) {
            await pdfViewerElement.requestFullscreen()
          } else if ((pdfViewerElement as any).webkitRequestFullscreen) {
            await (pdfViewerElement as any).webkitRequestFullscreen()
          } else if ((pdfViewerElement as any).msRequestFullscreen) {
            await (pdfViewerElement as any).msRequestFullscreen()
          }
          setIsFullscreen(true)
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen()
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen()
        }
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
    }
  }

  // Listen for fullscreen changes (including ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('PDF loading timeout')
        setError('PDF loading timed out. Please refresh the page and try again.')
        setLoading(false)
      }
    }, 8000) // 8 second timeout

    return () => clearTimeout(timeout)
  }, [loading])

  // Security measures to prevent downloading and printing
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Disable keyboard shortcuts for printing and saving
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+P (print), Ctrl+S (save), Ctrl+Shift+S (save as)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
        e.preventDefault()
        return false
      }
      // Prevent F12 (developer tools)
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }
    }

    // Disable drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('dragstart', handleDragStart)

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('dragstart', handleDragStart)
    }
  }, [])
  


  return (
    <div 
      id="pdf-viewer-container"
      className={`${isFullscreen ? 'h-screen w-screen bg-white flex flex-col' : 'w-full border border-gray-200 rounded-lg overflow-hidden'} relative`}
    >
      {/* Confidential Document Watermark */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-5">
        <div className="text-6xl font-bold text-gray-400 transform -rotate-45">
          CONFIDENTIAL
        </div>
      </div>
      
      {/* Security overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      />
      {/* Header with controls */}
      <div className={`bg-gray-100 p-3 flex justify-between items-center border-b border-gray-200 ${isFullscreen ? 'shadow-md flex-shrink-0' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-gray-700">
            Company Profile Document
          </div>
          <div className="text-xs text-red-600 font-semibold">
            🔒 CONFIDENTIAL - READ ONLY
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <button 
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="px-3 py-1 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              ←
            </button>
            <span className="text-sm min-w-[80px] text-center">
              {totalPages > 0 ? `${currentPage} of ${totalPages}` : 'Loading...'}
            </span>
            <button 
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              →
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={zoomOut}
              disabled={zoom <= 50}
              className="px-3 py-1 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              −
            </button>
            <button 
              onClick={resetZoom}
              className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 min-w-[60px]"
            >
              {zoom}%
            </button>
            <button 
              onClick={zoomIn}
              disabled={zoom >= 200}
              className="px-3 py-1 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              +
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button 
            onClick={toggleFullscreen}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            {isFullscreen ? (
              <>
                <span className="text-sm">⛶</span>
                <span className="text-sm">Exit</span>
              </>
            ) : (
              <>
                <span className="text-sm">⛶</span>
                <span className="text-sm">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>
            {/* PDF Viewer Container */}
      <div className={`${isFullscreen ? 'flex-1' : 'h-[550px]'} relative`}>
        {/* Security notice overlay */}
        <div className="absolute top-2 left-2 z-30 bg-red-100 border border-red-300 rounded px-2 py-1">
          <span className="text-xs text-red-700 font-medium">🔒 Confidential Document - No Download/Print</span>
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-40">
            <div className="text-gray-500 text-center">
              <div className="mb-2">Loading confidential document...</div>
              <div className="text-sm">Please wait while the document loads securely</div>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-40">
            <div className="text-red-500 text-center">
              <p className="mb-2">{error}</p>
              <p className="text-sm text-gray-600">Please contact support if you cannot access the confidential document.</p>
            </div>
          </div>
        )}

        {/* PDF Iframe - More reliable than react-pdf */}
        {!error && (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&page=${currentPage}&zoom=${zoom}&view=FitH`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="w-full h-full border-0"
            style={{
              pointerEvents: 'auto',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              width: `${10000 / zoom}%`,
              height: `${10000 / zoom}%`
            }}
            title="Confidential Company Profile"
            key={`${currentPage}-${zoom}`} // Force reload when page or zoom changes
          />
        )}
      </div>
    </div>
  )
}