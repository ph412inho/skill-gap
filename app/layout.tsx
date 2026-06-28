import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Career Readiness Platform',
  description: 'วิเคราะห์ความพร้อมอาชีพด้วย AI — Evidence-based, not resume-based',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        {/* Load Sarabun in the browser (avoids server-side SSL issues with proxy) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
