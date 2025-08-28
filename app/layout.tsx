import type { Metadata } from 'next'
import './globals.css'
import { AssessmentAssistantProvider } from '@/contexts/assessment-assistant-context'
import { DocumentsProvider } from '@/contexts/documents-context'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'PortrAI Participant Mockup',
  description: 'Created by FoW',
  generator: 'PortrAI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body>
        <AssessmentAssistantProvider>
          <DocumentsProvider>
            {children}
            <Toaster />
          </DocumentsProvider>
        </AssessmentAssistantProvider>
      </body>
    </html>
  )
}
