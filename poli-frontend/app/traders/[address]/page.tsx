'use client'

import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { cn, formatNumber, formatTimeAgo, formatDate, getTagEmoji, getTagStyle } from '@/lib/utils'
import { mockTraders, mockMarkets } from '@/lib/mock-data'

export default function TraderDetailPage({ params }: { params: { address: string } }) {
  const trader = mockTraders.find((t) => t.address === params.address)

  if (!trader) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">交易者未找到</h2>
          <Link href="/traders" className="mt-4 block text-primary hover:text-primary/80">
            返回交易者列表
          </Link>
        </div>
      </div>
    )
  }

  // 模拟胜率趋势数据
  const winRateTrend = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    winRate: trader.winRate + (Math.random() - 0.5) * 15,
  }))

  // 模拟交易历史
  const tradeHistory = mockMarkets.slice(0, 3).map((market) => ({
    marketSlug: market.slug,
    marketTitle: market.title,
    trades: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
      txHash: '0x' + Math.random().toString(16).slice(2, 66),
      outcome: Math.random() > 0.5 ? 'YES' : 'NO',
      side: Math.random() > 0.5 ? 'BUY' : 'SELL',
      price: Math.random() * 0.5 + 0.25,
      size: Math.random() * 5000 + 500,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      pnl: (Math.random() - 0.3) * 2000,
    })),
    totalPnL: (Math.random() - 0.3) * 5000,
    status: Math.random() > 0.3 ? 'won' : 'lost',
  }))

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <Link href="/traders" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-smooth-fast">
          ← 返回交易者列表
        </Link>
        <h1 className="text-3xl font-bold text-foreground mt-2">
          Trader Detail
        </h1>
        <p className="mt-2 font-mono text-lg text-base-gray-700">{trader.address}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {trader.tags.map((tag) => (
          <span
            key={tag}
            className={cn("rounded-lg border px-3 py-1 text-sm font-medium", getTagStyle(tag))}
          >
            {getTagEmoji(tag)} {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-base-gray-700">
        <span>加入: {formatDate(trader.joinedAt)}</span>
        <span suppressHydrationWarning>最后活跃: {formatTimeAgo(trader.lastActive)}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated">
          <h3 className="mb-4 text-lg font-bold text-foreground">📊 基础信息</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-base-gray-700">钱包地址</span>
              <span className="font-mono text-foreground">{trader.shortAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-gray-700">加入时间</span>
              <span className="text-foreground">{formatDate(trader.joinedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-gray-700">最后活跃</span>
              <span className="text-foreground" suppressHydrationWarning>{formatTimeAgo(trader.lastActive)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-gray-700">总交易量</span>
              <span className="font-medium text-foreground">${formatNumber(trader.totalVolume)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated">
          <h3 className="mb-4 text-lg font-bold text-foreground">🎯 核心指标</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-base-gray-700 font-medium">胜率</div>
              <div className="mt-1 text-3xl font-bold text-smartmoney">{trader.winRate}%</div>
              <div className="mt-1 text-xs text-base-gray-700">
                近7天: {trader.winRate7d}% | 30天: {trader.winRate30d}%
              </div>
            </div>
            <div>
              <div className="text-xs text-base-gray-700 font-medium">ROI</div>
              <div className="mt-1 text-3xl font-bold text-success">{trader.roi}%</div>
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
        </div>
      </div>

      <div className="rounded-lg bg-smartmoney/10 border border-smartmoney/20 p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-bold text-smartmoney">AI 智能点评</h3>
        </div>
        <p className="mb-4 leading-relaxed text-base-gray-900">{trader.aiReview}</p>
        <div className="grid grid-cols-3 gap-4 rounded-lg bg-smartmoney/5 border border-smartmoney/10 p-4">
          <div>
            <div className="text-xs text-base-gray-700 font-medium">推荐跟单比例</div>
            <div className="mt-1 text-lg font-bold text-smartmoney">30-50%</div>
          </div>
          <div>
            <div className="text-xs text-base-gray-700 font-medium">风险等级</div>
            <div className="mt-1 text-lg font-bold text-foreground">中等</div>
          </div>
          <div>
            <div className="text-xs text-base-gray-700 font-medium">信心指数</div>
            <div className="mt-1 text-lg font-bold text-success">82/100</div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated">
        <h3 className="mb-4 text-lg font-bold text-foreground">📈 胜率趋势 (30天)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={winRateTrend}>
            <XAxis dataKey="date" stroke="#71717a" tickFormatter={(val) => val.slice(5)} />
            <YAxis stroke="#71717a" domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px' }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Line type="monotone" dataKey="winRate" stroke="#8B5CF6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated">
        <h3 className="mb-4 text-lg font-bold text-foreground">🎯 擅长领域分析</h3>
        <div className="space-y-4">
          {trader.expertise.map((exp) => (
            <div key={exp.category}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-foreground">{exp.category}</span>
                <span className="text-sm text-base-gray-700">
                  {exp.trades}笔交易 | 胜率 {exp.winRate}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-base-gray-200">
                <div
                  className={cn(
                    "h-full rounded-full",
                    exp.winRate >= 70 ? "bg-success" : exp.winRate >= 50 ? "bg-warning" : "bg-danger"
                  )}
                  style={{ width: `${exp.winRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated">
        <h3 className="mb-4 text-lg font-bold text-foreground">📜 交易历史</h3>
        <div className="space-y-4">
          {tradeHistory.map((market) => (
            <div key={market.marketSlug} className="rounded-lg bg-base-gray-50 border border-base-gray-200 p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <Link
                    href={`/markets/${market.marketSlug}`}
                    className="font-medium text-foreground hover:text-primary transition-smooth-fast"
                  >
                    {market.marketTitle}
                  </Link>
                  <div className="mt-1 text-xs text-base-gray-700">{market.trades.length}笔交易</div>
                </div>
                {market.status !== 'ongoing' && (
                  <div
                    className={cn("text-right", market.totalPnL > 0 ? "text-success" : "text-danger")}
                  >
                    <div className="text-sm">{market.status === 'won' ? '✅ 已盈利' : '❌ 已亏损'}</div>
                    <div className="mt-1 font-mono text-lg font-bold">
                      {market.totalPnL > 0 ? '+' : ''}${formatNumber(market.totalPnL)}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {market.trades.map((trade, i) => (
                  <div key={`${trade.txHash}-${i}`} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-xs font-medium",
                          trade.side === 'BUY' ? "bg-success/10 text-success border border-success/20" : "bg-danger/10 text-danger border border-danger/20"
                        )}
                      >
                        {trade.side} {trade.outcome}
                      </span>
                      <span className="text-base-gray-700" suppressHydrationWarning>{formatTimeAgo(trade.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-foreground">${trade.price.toFixed(4)}</span>
                      <span className="text-base-gray-700">×{formatNumber(trade.size)}</span>
                      {trade.pnl !== undefined && (
                        <span
                          className={cn("font-medium", trade.pnl > 0 ? "text-success" : "text-danger")}
                        >
                          {trade.pnl > 0 ? '+' : ''}${formatNumber(trade.pnl)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
