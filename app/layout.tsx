import type { Metadata } from 'next'
import './globals.css'
import { AssessmentAssistantProvider } from '@/contexts/assessment-assistant-context'

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
          {children}
        </AssessmentAssistantProvider>
      </body>
    </html>
  )
}
