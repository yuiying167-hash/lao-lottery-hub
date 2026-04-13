import type { Metadata } from 'next'
import { Sarabun, Roboto_Mono, Noto_Sans_Lao } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/Navbar'

const sarabun = Sarabun({
  variable: '--font-sarabun',
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
})

const notoSansLao = Noto_Sans_Lao({
  variable: '--font-noto-lao',
  subsets: ['lao'],
  weight: ['400', '700'],
})

const SITE_URL = 'https://lao-lottery-hub.yuiying167.workers.dev'

export const metadata: Metadata = {
  title: 'หวยลาว · ผลหวยลาวล่าสุด อัปเดตอัตโนมัติ',
  description: 'ผลหวยลาวล่าสุด อัปเดตอัตโนมัติทุกวันจันทร์ พุธ ศุกร์ พร้อมสถิติย้อนหลัง เลขร้อน เลขเย็น และระบบตรวจหวยออนไลน์',
  keywords: ['หวยลาว', 'ผลหวยลาว', 'ຫວຍລາວ', 'lao lottery', 'หวยลาววันนี้', 'เลขลาว', 'ตรวจหวยลาว'],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'หวยลาว · ผลหวยลาวล่าสุด',
    description: 'ผลหวยลาวล่าสุด อัปเดตอัตโนมัติ พร้อมสถิติและตรวจหวยออนไลน์',
    url: SITE_URL,
    siteName: 'หวยลาว',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'หวยลาว - ผลหวยลาวล่าสุด',
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'หวยลาว · ผลหวยลาวล่าสุด',
    description: 'ผลหวยลาวล่าสุด อัปเดตอัตโนมัติ พร้อมสถิติและตรวจหวยออนไลน์',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/icon-192.png', sizes: '192x192' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="th"
      className={`${sarabun.variable} ${robotoMono.variable} ${notoSansLao.variable}`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3198582468837090"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col font-[var(--font-sarabun)] antialiased"
        style={{ background: 'var(--bg)', color: 'var(--cream)' }}>
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <footer style={{
          borderTop: '1px solid rgba(255,215,0,0.06)',
          padding: '20px 16px',
          textAlign: 'center',
          fontSize: 11,
          color: 'rgba(245,230,211,0.25)',
        }}>
          © 2026 หวยลาว · ข้อมูลจาก mthai.com · อัปเดตทุกวันจันทร์ พุธ ศุกร์
        </footer>
      </body>
    </html>
  )
}
