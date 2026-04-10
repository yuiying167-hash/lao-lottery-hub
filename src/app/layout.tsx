import type { Metadata } from 'next'
import { Sarabun, Roboto_Mono, Noto_Sans_Lao } from 'next/font/google'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'Lao Lottery Hub · ผลหวยลาว',
  description: 'ผลหวยลาวล่าสุด สถิติ และตรวจหวยออนไลน์ อัปเดตอัตโนมัติ',
  keywords: ['หวยลาว', 'ผลหวยลาว', 'ເລກລາວ', 'lao lottery'],
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
      <body className="min-h-full flex flex-col font-[var(--font-sarabun)] antialiased">
        {children}
      </body>
    </html>
  )
}
