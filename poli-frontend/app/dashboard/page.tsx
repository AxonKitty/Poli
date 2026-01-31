'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { cn, formatNumber, formatTimeAgo, getTagEmoji, getTagStyle } from '@/lib/utils'
import { mockMarkets, mockTraders, mockAlerts, mockSentimentData } from '@/lib/mock-data'
import { Skeleton } from '@/components/ui/skeleton'

function AlertFeed() {
  return (
    <div className="w-full overflow-hidden bg-base-gray-50 rounded-lg py-3 border border-base-gray-200">
      <div className="animate-marquee flex gap-8 whitespace-nowrap px-4">
        {mockAlerts.map((alert) => (
          <Link
            key={alert.id}
            href={alert.link}
            className="flex items-center gap-2 hover:text-primary transition-smooth-fast"
          >
            <span className="text-2xl">{alert.icon}</span>
            <span className="text-sm font-medium text-foreground">{alert.message}</span>
            <span className="text-xs text-base-gray-700" suppressHydrationWarning>
              {formatTimeAgo(alert.timestamp)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function HotMarkets() {
  return (
    <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated transition-smooth">
      <h3 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
        热门市场
      </h3>
      <div className="space-y-3">
        {mockMarkets.slice(0, 4).map((market, index) => (
          <Link
            key={market.id}
            href={`/markets/${market.slug}`}
            className="block rounded-lg bg-base-gray-50 p-4 hover:bg-base-gray-100 transition-smooth-fast border border-transparent hover:border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-base-gray-700">#{index + 1}</span>
                  <span className="font-medium text-foreground line-clamp-1">{market.title}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 font-medium">
                    {market.subcategory}
                  </span>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-lg font-bold text-foreground">${market.currentPrice.toFixed(2)}</div>
                <div
                  className={cn(
                    "text-sm font-medium",
                    market.priceChange24h > 0 ? "text-success" : "text-danger"
                  )}
                >
                  {market.priceChange24h > 0 ? "↑" : "↓"} {Math.abs(market.priceChange24h)}%
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/markets"
        className="mt-4 block text-center text-sm text-primary hover:text-primary/80 font-medium transition-smooth-fast"
      >
        查看全部 →
      </Link>
    </div>
  )
}

function TopSmartMoney() {
  const smartMoneyTraders = mockTraders
    .filter((t) => t.tags.includes('聪明钱'))
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 5)

  return (
    <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated transition-smooth">
      <h3 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
        Top Smart Money
      </h3>
      <div className="space-y-2">
        {smartMoneyTraders.map((trader, index) => (
          <Link
            key={trader.address}
            href={`/traders/${trader.address}`}
            className="flex items-center justify-between rounded-lg bg-base-gray-50 p-3 hover:bg-base-gray-100 transition-smooth-fast border border-transparent hover:border-primary/20"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-base-gray-700 w-6">#{index + 1}</span>
              <span className="font-mono text-sm font-medium text-foreground">{trader.shortAddress}</span>
              <div className="flex gap-1">
                {trader.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-lg" title={tag}>
                    {getTagEmoji(tag)}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-smartmoney">{trader.winRate}%</div>
              <div className="text-xs text-base-gray-700">ROI {trader.roi}%</div>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/traders?tab=smart-money"
        className="mt-4 block text-center text-sm text-primary hover:text-primary/80 font-medium transition-smooth-fast"
      >
        查看完整榜单 →
      </Link>
    </div>
  )
}

function ReverseIndicatorFeed() {
  const reverseTraders = mockTraders.filter((t) => t.tags.includes('反向指标'))

  return (
    <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated transition-smooth">
      <h3 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
        <span>🔴</span> 反向指标动态
      </h3>
      {reverseTraders.length > 0 ? (
        <div className="space-y-3">
          {reverseTraders.slice(0, 2).map((trader) => (
            <div
              key={trader.address}
              className="rounded-lg bg-danger/5 border border-danger/20 p-4 transition-smooth"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-foreground">{trader.shortAddress}</span>
                    <span className="text-xs text-danger font-medium">胜率 {trader.winRate}%</span>
                  </div>
                  <div className="mt-1 text-sm text-base-gray-700">
                    {trader.recentPerformance.message}
                  </div>
                </div>
                <div className="text-xs text-danger font-medium">
                  反向强度 {85 - trader.winRate}/100
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-warning/10 border border-warning/20 p-3 text-xs text-base-gray-900">
                <span className="font-medium text-warning">💡 </span>
                {trader.aiReview.slice(0, 50)}...
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-base-gray-700 py-4">暂无反向指标动态</div>
      )}
      <Link
        href="/traders?tab=reverse"
        className="mt-4 block text-center text-sm text-primary hover:text-primary/80 font-medium transition-smooth-fast"
      >
        查看详情 →
      </Link>
    </div>
  )
}

function MarketSentiment() {
  return (
    <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated transition-smooth">
      <h3 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
        市场情绪指数 (7天)
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={mockSentimentData}>
          <XAxis
            dataKey="date"
            stroke="#71717a"
            tickFormatter={(val) => val.slice(5)}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#71717a"
            domain={[0, 100]}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e4e4e7',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: '#09090b', fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="bullish"
            stroke="#10B981"
            strokeWidth={2}
            name="看涨"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="bearish"
            stroke="#EF4444"
            strokeWidth={2}
            name="看跌"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success"></div>
          <span className="text-base-gray-700 font-medium">看涨情绪</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-danger"></div>
          <span className="text-base-gray-700 font-medium">看跌情绪</span>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Dashboard
        </h1>
      </div>

      {/* 实时警报流 */}
      <AlertFeed />

      {/* 主要内容区域 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <HotMarkets />
        <TopSmartMoney />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ReverseIndicatorFeed />
        <MarketSentiment />
      </div>
    </div>
  )
}

