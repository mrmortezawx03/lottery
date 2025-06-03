import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'قرعه‌کشی اتوتقی زاده',
  description: 'سیستم قرعه‌کشی آنلاین',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
