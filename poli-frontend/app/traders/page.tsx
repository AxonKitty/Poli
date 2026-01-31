'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn, formatNumber, formatTimeAgo, formatDate, getTagEmoji, getTagStyle } from '@/lib/utils'
import { mockTraders } from '@/lib/mock-data'
import { WalletConnect } from '@/components/wallet-connect'

type TabType = 'smart_money' | 'reverse' | 'whale' | 'all'

function TradersTabs({ activeTab, setActiveTab }: { activeTab: TabType; setActiveTab: (tab: TabType) => void }) {
  const tabs = [
    { id: 'smart_money' as TabType, label: '🏆 聪明钱', count: mockTraders.filter((t) => t.tags.includes('聪明钱')).length },
    { id: 'reverse' as TabType, label: '🔴 反向指标', count: mockTraders.filter((t) => t.tags.includes('反向指标')).length },
    { id: 'whale' as TabType, label: '🐋 巨鲸', count: mockTraders.filter((t) => t.tags.includes('巨鲸')).length },
    { id: 'all' as TabType, label: '🎯 全部', count: mockTraders.length },
  ]

  return (
    <div className="flex gap-2 border-b border-base-gray-200 overflow-x-auto bg-white rounded-t-lg px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "px-4 py-3 transition-smooth-fast whitespace-nowrap font-medium",
            activeTab === tab.id
              ? "border-b-2 border-primary text-primary"
              : "text-base-gray-700 hover:text-foreground"
          )}
        >
          {tab.label}
          <span className="ml-2 text-xs">({tab.count})</span>
        </button>
      ))}
    </div>
  )
}

function TraderCard({ trader }: { trader: any }) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated transition-smooth">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <Link href={`/traders/${trader.address}`} className="font-mono text-lg font-medium text-foreground hover:text-primary transition-smooth-fast">
            {trader.shortAddress}
          </Link>
          <div className="mt-2 flex flex-wrap gap-2">
            {trader.tags.map((tag: string) => (
              <span
                key={tag}
                className={cn("rounded-lg border px-2 py-1 text-xs font-medium", getTagStyle(tag))}
              >
                {getTagEmoji(tag)} {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-smooth-fast",
            isFollowing
              ? "bg-base-gray-200 text-base-gray-700 hover:bg-base-gray-300"
              : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {isFollowing ? "✓ 已关注" : "+ 关注"}
        </button>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-4 rounded-lg bg-base-gray-50 p-4 border border-base-gray-200">
        <div>
          <div className="text-xs text-base-gray-700 font-medium">胜率</div>
          <div className="mt-1 text-2xl font-bold text-smartmoney">{trader.winRate}%</div>
          <div className="text-xs text-base-gray-700">近7天: {trader.winRate7d}%</div>
        </div>
        <div>
          <div className="text-xs text-base-gray-700 font-medium">ROI</div>
          <div className="mt-1 text-2xl font-bold text-success">{trader.roi}%</div>
        </div>
        <div>
          <div className="text-xs text-base-gray-700 font-medium">总盈利</div>
          <div className="mt-1 text-2xl font-bold text-foreground">${formatNumber(trader.totalProfit)}</div>
        </div>
        <div>
          <div className="text-xs text-base-gray-700 font-medium">总交易</div>
          <div className="mt-1 text-2xl font-bold text-foreground">{trader.totalTrades}笔</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium text-foreground">🎯 擅长领域</h4>
        <div className="space-y-2">
          {trader.expertise.slice(0, 3).map((exp: any) => (
            <div key={exp.category} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{exp.category}</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-base-gray-200">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      exp.winRate >= 70 ? "bg-success" : exp.winRate >= 50 ? "bg-warning" : "bg-danger"
                    )}
                    style={{ width: `${exp.winRate}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-base-gray-700">{exp.winRate}%</span>
                <span className="w-16 text-right text-xs text-base-gray-600">({exp.trades}笔)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg bg-base-gray-50 border border-base-gray-200 p-3">
        <span className="text-lg">
          {trader.recentPerformance.status === 'good' ? '✅' : trader.recentPerformance.status === 'warning' ? '⚠️' : '🔴'}
        </span>
        <span className="text-sm text-base-gray-900">{trader.recentPerformance.message}</span>
      </div>

      <div className="mb-4 rounded-lg bg-smartmoney/10 border border-smartmoney/20 p-3">
        <div className="mb-1 flex items-center gap-2 text-sm font-medium text-smartmoney">
          <span>🤖</span>
          <span>AI 智能点评</span>
        </div>
        <p className="text-sm text-base-gray-900">{trader.aiReview}</p>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/traders/${trader.address}`}
          className="flex-1 rounded-lg bg-base-gray-100 border border-base-gray-200 py-2 text-center text-sm font-medium text-foreground hover:bg-base-gray-200 transition-smooth-fast"
        >
          查看详情
        </Link>
        <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-smooth-fast">
          复制策略
        </button>
      </div>
    </div>
  )
}

export default function TradersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('smart_money')
  const [sortBy, setSortBy] = useState<'win_rate' | 'roi' | 'profit' | 'volume'>('win_rate')

  const filteredTraders = mockTraders
    .filter((trader) => {
      if (activeTab === 'all') return true
      if (activeTab === 'smart_money') return trader.tags.includes('聪明钱')
      if (activeTab === 'reverse') return trader.tags.includes('反向指标')
      if (activeTab === 'whale') return trader.tags.includes('巨鲸')
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'win_rate':
          return b.winRate - a.winRate
        case 'roi':
          return b.roi - a.roi
        case 'profit':
          return b.totalProfit - a.totalProfit
        case 'volume':
          return b.totalVolume - a.totalVolume
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Traders
        </h1>
      </div>

      <TradersTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex items-center gap-2">
        <span className="text-sm text-base-gray-700 font-medium">排序:</span>
        {[
          { value: 'win_rate' as const, label: '胜率 ↓' },
          { value: 'roi' as const, label: 'ROI ↓' },
          { value: 'profit' as const, label: '总盈利 ↓' },
          { value: 'volume' as const, label: '交易量 ↓' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setSortBy(option.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-smooth-fast",
              sortBy === option.value
                ? "bg-primary text-white"
                : "bg-base-gray-100 text-base-gray-700 hover:bg-base-gray-200"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredTraders.map((trader) => (
          <TraderCard key={trader.address} trader={trader} />
        ))}
      </div>
    </div>
  )
}

