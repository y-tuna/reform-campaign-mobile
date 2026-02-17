import React from 'react'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '개혁신당 유세 비서',
  description: '개혁신당 공천 후보자를 위한 캠페인 관리 서비스',
  robots: 'noindex, nofollow', // Private system
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}