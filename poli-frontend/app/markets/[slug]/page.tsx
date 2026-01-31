'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { cn, formatNumber, formatTimeAgo, formatDate, getTagEmoji } from '@/lib/utils'
import { mockMarkets, mockOrderbook, mockTrades, mockTraders } from '@/lib/mock-data'

export default function MarketDetailPage({ params }: { params: { slug: string } }) {
  const market = mockMarkets.find((m) => m.slug === params.slug)

  if (!market) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">市场未找到</h2>
          <Link href="/markets" className="mt-4 block text-primary hover:text-primary/80">
            返回市场列表
          </Link>
        </div>
      </div>
    )
  }

  // 模拟价格历史数据
  const priceHistory = Array.from({ length: 7 }, (_, i) => ({
    timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    yesPrice: market.yesPrice + (Math.random() - 0.5) * 0.1,
    noPrice: market.noPrice + (Math.random() - 0.5) * 0.1,
  }))

  // 模拟聪明钱持仓
  const smartMoneyPositions = mockTraders
    .filter((t) => t.tags.includes('聪明钱') || t.tags.includes('巨鲸'))
    .slice(0, 3)
    .map((trader) => ({
      address: trader.address,
      shortAddress: trader.shortAddress,
      tags: trader.tags,
      outcome: Math.random() > 0.5 ? 'YES' : 'NO',
      amount: Math.random() * 50000 + 10000,
      avgPrice: market.currentPrice + (Math.random() - 0.5) * 0.1,
      unrealizedPnL: (Math.random() - 0.3) * 10000,
    }))

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <Link href="/markets" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-smooth-fast">
          ← 返回市场列表
        </Link>
        <h1 className="text-3xl font-bold text-foreground mt-2">
          Market Detail
        </h1>
        <p className="mt-2 text-lg text-base-gray-900">{market.title}</p>
      </div>

      {/* 市场信息头部 */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-primary font-medium">
          🏷️ {market.category}
        </span>
        <span className="flex items-center gap-1 text-base-gray-900">
          💰 ${formatNumber(market.volume24h)} (24h)
        </span>
        <span
          className={cn(
            "flex items-center gap-1 font-medium",
            market.priceChange24h > 0 ? "text-success" : "text-danger"
          )}
        >
          📈 {market.priceChange24h > 0 ? "+" : ""}{market.priceChange24h.toFixed(2)}%
        </span>
        <span className="flex items-center gap-1 text-base-gray-700">
          ⏰ 截止 {formatDate(market.endDate)}
        </span>
        <span
          className={cn(
            "rounded-lg px-2 py-0.5 font-medium",
            market.status === 'active'
              ? "bg-success/10 text-success border border-success/20"
              : "bg-base-gray-200 text-base-gray-700"
          )}
        >
          {market.status === 'active' ? '活跃' : '已关闭'}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 价格走势图 */}
        <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated">
          <h3 className="mb-4 text-lg font-bold text-foreground">价格走势 (7天)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceHistory}>
              <XAxis dataKey="timestamp" stroke="#71717a" tickFormatter={(val) => val.slice(5)} />
              <YAxis stroke="#71717a" domain={[0, 1]} tickFormatter={(val) => `$${val.toFixed(2)}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px' }}
                formatter={(value: number) => `$${value.toFixed(4)}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="yesPrice"
                stroke="#10B981"
                strokeWidth={2}
                name="YES 价格"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="noPrice"
                stroke="#EF4444"
                strokeWidth={2}
                name="NO 价格"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-sm text-base-gray-700 font-medium">YES 当前价格</div>
              <div className="text-2xl font-bold text-success">${market.yesPrice.toFixed(4)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-base-gray-700 font-medium">NO 当前价格</div>
              <div className="text-2xl font-bold text-danger">${market.noPrice.toFixed(4)}</div>
            </div>
          </div>
        </div>

        {/* 买卖压力 */}
        <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated">
          <h3 className="mb-4 text-lg font-bold text-foreground">买卖压力</h3>
          <div className="mb-4 flex h-8 overflow-hidden rounded-lg">
            <div className="bg-success" style={{ width: '60%' }} />
            <div className="bg-danger" style={{ width: '40%' }} />
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-success font-medium">买盘: 60.0%</span>
              <div className="text-xs text-base-gray-700">${formatNumber(market.volume24h * 0.6)}</div>
            </div>
            <div className="text-right">
              <span className="text-danger font-medium">卖盘: 40.0%</span>
              <div className="text-xs text-base-gray-700">${formatNumber(market.volume24h * 0.4)}</div>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-base-gray-50 border border-base-gray-200 p-3 text-center">
            <div className="text-2xl">📈</div>
            <div className="mt-1 text-sm font-medium text-foreground">温和看涨</div>
          </div>
        </div>
      </div>

      {/* 聪明钱持仓分析 */}
      <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated">
        <h3 className="mb-4 text-lg font-bold text-foreground">聪明钱持仓分析</h3>
        {smartMoneyPositions.length > 0 ? (
          <div className="space-y-3">
            {smartMoneyPositions.map((pos) => (
              <Link
                key={pos.address}
                href={`/traders/${pos.address}`}
                className="block rounded-lg bg-base-gray-50 border border-base-gray-200 p-3 hover:bg-base-gray-100 transition-smooth-fast"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-foreground">{pos.shortAddress}</span>
                      {pos.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-lg" title={tag}>
                          {getTagEmoji(tag)}
                        </span>
                      ))}
                    </div>
                    <div className="mt-1 text-sm text-base-gray-700">
                      持仓: {pos.outcome} @ ${pos.avgPrice.toFixed(4)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">${formatNumber(pos.amount)}</div>
                    <div
                      className={cn(
                        "text-xs font-medium",
                        pos.unrealizedPnL > 0 ? "text-success" : "text-danger"
                      )}
                    >
                      {pos.unrealizedPnL > 0 ? "+" : ""}${formatNumber(pos.unrealizedPnL)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-base-gray-700">暂无聪明钱持仓数据</div>
        )}
      </div>

      {/* 最近交易 */}
      <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">最近交易</h3>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-success"></div>
            <span className="text-xs text-base-gray-700">实时更新</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-base-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-base-gray-50 border-b border-base-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-base-gray-900 font-medium">时间</th>
                <th className="px-3 py-2 text-left text-base-gray-900 font-medium">方向</th>
                <th className="px-3 py-2 text-right text-base-gray-900 font-medium">价格</th>
                <th className="px-3 py-2 text-right text-base-gray-900 font-medium">数量</th>
                <th className="px-3 py-2 text-right text-base-gray-900 font-medium">总额</th>
              </tr>
            </thead>
            <tbody>
              {mockTrades.slice(0, 10).map((trade, i) => {
                const isBuy = trade.side === 'BUY'
                return (
                  <tr key={`${trade.txHash}-${i}`} className="border-t border-base-gray-200 hover:bg-base-gray-50 transition-smooth-fast">
                    <td className="px-3 py-2 text-xs text-base-gray-700" suppressHydrationWarning>{formatTimeAgo(trade.timestamp)}</td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-xs font-medium",
                          isBuy ? "bg-success/10 text-success border border-success/20" : "bg-danger/10 text-danger border border-danger/20"
                        )}
                      >
                        {trade.side} {trade.outcome}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-foreground">${trade.price.toFixed(4)}</td>
                    <td className="px-3 py-2 text-right text-foreground">{formatNumber(trade.size)}</td>
                    <td className="px-3 py-2 text-right font-medium text-foreground">
                      ${formatNumber(trade.size * trade.price)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
