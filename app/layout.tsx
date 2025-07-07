import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PortrAI Participant Mockup',
  description: 'PortrAI Participant Mockup',
  generator: 'Future of Work',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
