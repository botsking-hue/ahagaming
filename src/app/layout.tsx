import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GlobalNotification from '@/components/notifications/GlobalNotification'
import WhatsAppButton from '@/components/shared/WhatsAppButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GameHub - Download Free Games',
  description: 'Download latest games for Android, iOS & PC. Arcade, Racing, Soccer and more!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
<GlobalNotification />
<WhatsAppButton variant="floating" />
<main className="flex-1 container mx-auto px-4 py-8">
  {children}
</main>
        <Footer />
      </body>
    </html>
  )
}
