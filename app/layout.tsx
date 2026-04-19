import './globals.css'
import type { Metadata } from 'next'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import Providers from './provider'

export const metadata: Metadata = {
  metadataBase: new URL('https://hfs.uselesslab.top'),
  title: 'HFS NEXT - 下一代好分数',
  description: '你的下一个好分数，何必是好分数？',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'HFS NEXT - 下一代好分数',
    description: '你的下一个好分数，何必是好分数？',
    images: ['/images/logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HFS NEXT - 下一代好分数',
    description: '你的下一个好分数，何必是好分数？',
    images: ['/images/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='zh-CN'>
      <body>
        <Providers>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
