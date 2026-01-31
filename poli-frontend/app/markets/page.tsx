'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { cn, formatNumber, formatTimeAgo, formatDate } from '@/lib/utils'
import { mockMarkets, mockOrderbook, mockTrades, mockTraders } from '@/lib/mock-data'
import { WalletConnect } from '@/components/wallet-connect'

function MarketCard({ market }: { market: any }) {
  return (
    <Link href={`/markets/${market.slug}`} className="block">
      <div className="rounded-lg bg-white border border-base-gray-200 p-4 hover:bg-base-gray-50 transition-smooth-fast card-elevated">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2">{market.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 font-medium">{market.subcategory}</span>
            <span className="text-base-gray-700">截止 {formatDate(market.endDate)}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-foreground">${market.currentPrice.toFixed(2)}</div>
            <div
              className={cn(
                "text-sm font-medium",
                market.priceChange24h > 0 ? "text-success" : "text-danger"
              )}
            >
              {market.priceChange24h > 0 ? "↑" : "↓"} {Math.abs(market.priceChange24h).toFixed(2)}%
            </div>
          </div>

          <div className="h-12 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={market.priceHistory7d}>
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={market.priceChange24h > 0 ? "#10B981" : "#EF4444"}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-base-gray-700">
          <span>24h 交易量: ${formatNumber(market.volume24h)}</span>
          <span className="flex items-center gap-1">
            流动性:
            <span
              className={cn(
                "font-medium",
                market.liquidity > 70 ? "text-success" : market.liquidity > 40 ? "text-warning" : "text-danger"
              )}
            >
              {market.liquidity}/100
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function MarketsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [sortBy, setSortBy] = useState<'volume' | 'price_change' | 'liquidity'>('volume')

  const categories = ['全部', '国际政治', '地缘政治']

  const filteredMarkets = mockMarkets
    .filter((m) => selectedCategory === '全部' || m.subcategory === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.volume24h - a.volume24h
        case 'price_change':
          return b.priceChange24h - a.priceChange24h
        case 'liquidity':
          return b.liquidity - a.liquidity
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Markets
        </h1>
      </div>

      {/* 筛选和排序 */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg bg-white border border-base-gray-200 p-4 card-elevated">
        <div className="flex items-center gap-2">
          <span className="text-sm text-base-gray-700 font-medium">分类:</span>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-smooth-fast",
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-base-gray-100 text-base-gray-700 hover:bg-base-gray-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-base-gray-700 font-medium">排序:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg bg-base-gray-100 border border-base-gray-200 px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="volume">交易量 ↓</option>
            <option value="price_change">价格变化 ↓</option>
            <option value="liquidity">流动性 ↓</option>
          </select>
        </div>
      </div>

      {/* 市场列表 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </div>
  )
}
