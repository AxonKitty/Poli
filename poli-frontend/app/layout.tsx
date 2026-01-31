import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { NetworkSwitcher } from '@/components/network-switcher'
import { Providers } from '@/lib/providers'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel'
})

export const metadata: Metadata = {
  title: 'Poli - 政治预测市场跟单平台',
  description: '实时追踪 Polymarket 政治市场动态,发现聪明钱交易者',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${pressStart2P.variable} bg-white`}>
        <Providers>
          <div className="min-h-screen bg-white">
            <Navigation />
            <NetworkSwitcher />
            <main className="ml-52 px-8 py-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}

