'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn, formatNumber, formatTimeAgo, getTagEmoji, getTagStyle } from '@/lib/utils'
import { mockTraders } from '@/lib/mock-data'
import { useHasMounted } from '@/lib/hooks/use-has-mounted'
import { WalletConnect } from '@/components/wallet-connect'

function FollowedTraderCard({ trader }: { trader: any }) {
  const [showSettings, setShowSettings] = useState(false)
  const [followConfig, setFollowConfig] = useState({
    enabled: true,
    copyRatio: 30,
    maxPerTrade: 1000,
  })

  const followPerformance = {
    totalInvested: Math.random() * 5000 + 1000,
    totalPnL: (Math.random() - 0.3) * 2000,
    followedTrades: Math.floor(Math.random() * 20) + 5,
    lastFollowTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  }

  const status = trader.recentPerformance.status === 'good' ? 'active' : 'warning'

  return (
    <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated transition-smooth">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <Link
            href={`/traders/${trader.address}`}
            className="font-mono text-lg font-medium text-foreground hover:text-primary transition-smooth-fast"
          >
            {trader.shortAddress}
          </Link>
          <div className="mt-2 flex flex-wrap gap-2">
            {trader.tags.slice(0, 4).map((tag: string) => (
              <span key={tag} className="text-lg" title={tag}>
                {getTagEmoji(tag)}
              </span>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium",
            status === 'active'
              ? "bg-success/10 text-success border border-success/20"
              : "bg-danger/10 text-danger border border-danger/20"
          )}
        >
          {status === 'active' ? '✅ 活跃' : '⚠️ 警示'}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4 rounded-lg bg-base-gray-50 border border-base-gray-200 p-3">
        <div>
          <div className="text-xs text-base-gray-700 font-medium">胜率</div>
          <div className="mt-1 text-lg font-bold text-smartmoney">{trader.winRate}%</div>
        </div>
        <div>
          <div className="text-xs text-base-gray-700 font-medium">ROI</div>
          <div className="mt-1 text-lg font-bold text-success">{trader.roi}%</div>
        </div>
        <div>
          <div className="text-xs text-base-gray-700 font-medium">总盈利</div>
          <div className="mt-1 text-lg font-bold text-foreground">${formatNumber(trader.totalProfit)}</div>
        </div>
      </div>

      <div className="mb-4 rounded-lg bg-primary/10 border border-primary/20 p-3">
        <div className="mb-2 text-sm font-medium text-primary">跟单表现</div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <div className="text-base-gray-700">已投入</div>
            <div className="mt-1 font-medium text-foreground">${formatNumber(followPerformance.totalInvested)}</div>
          </div>
          <div>
            <div className="text-base-gray-700">盈亏</div>
            <div
              className={cn(
                "mt-1 font-medium",
                followPerformance.totalPnL > 0 ? "text-success" : "text-danger"
              )}
            >
              {followPerformance.totalPnL > 0 ? '+' : ''}${formatNumber(followPerformance.totalPnL)}
            </div>
          </div>
          <div>
            <div className="text-base-gray-700">跟单次数</div>
            <div className="mt-1 font-medium text-foreground">{followPerformance.followedTrades}笔</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-base-gray-700" suppressHydrationWarning>
          最后跟单: {formatTimeAgo(followPerformance.lastFollowTime)}
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex w-full items-center justify-between rounded-lg bg-base-gray-100 border border-base-gray-200 p-3 text-sm font-medium text-foreground hover:bg-base-gray-200 transition-smooth-fast"
        >
          <span>⚙️ 跟单配置</span>
          <span>{showSettings ? '▲' : '▼'}</span>
        </button>

        {showSettings && (
          <div className="mt-2 space-y-3 rounded-lg bg-base-gray-50 border border-base-gray-200 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">启用跟单</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={followConfig.enabled}
                  onChange={(e) => setFollowConfig({ ...followConfig, enabled: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-base-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            {followConfig.enabled && (
              <>
                <div>
                  <label className="mb-1 block text-xs text-base-gray-700 font-medium">
                    跟单比例: {followConfig.copyRatio}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={followConfig.copyRatio}
                    onChange={(e) => setFollowConfig({ ...followConfig, copyRatio: parseInt(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-base-gray-700 font-medium">单笔最大额</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-base-gray-700">$</span>
                    <input
                      type="number"
                      value={followConfig.maxPerTrade}
                      onChange={(e) => setFollowConfig({ ...followConfig, maxPerTrade: parseInt(e.target.value) })}
                      className="flex-1 rounded-lg bg-white border border-base-gray-200 px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/traders/${trader.address}`}
          className="flex-1 rounded-lg bg-base-gray-100 border border-base-gray-200 py-2 text-center text-sm font-medium text-foreground hover:bg-base-gray-200 transition-smooth-fast"
        >
          查看详情
        </Link>
        <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-smooth-fast">
          调整策略
        </button>
        <button className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger/90 transition-smooth-fast">
          取消关注
        </button>
      </div>
    </div>
  )
}

export default function FollowingPage() {
  const hasMounted = useHasMounted()
  const [filter, setFilter] = useState<'all' | 'active' | 'warning' | 'paused'>('all')

  // 模拟关注的交易者（取前3个）
  const followedTraders = mockTraders.slice(0, 3)

  // 跟单总览数据
  const overview = {
    totalFollowed: followedTraders.length,
    activeFollowed: followedTraders.filter((t) => t.recentPerformance.status === 'good').length,
    totalInvested: 12500,
    totalPnL: 2340,
    todayActivities: 5,
    topPerformer: {
      address: followedTraders[0]?.address || '',
      pnl: 1250,
    },
    worstPerformer: {
      address: followedTraders[followedTraders.length - 1]?.address || '',
      pnl: -320,
    },
  }

  const filteredTraders = followedTraders.filter((trader) => {
    if (filter === 'all') return true
    if (filter === 'active') return trader.recentPerformance.status === 'good'
    if (filter === 'warning') return trader.recentPerformance.status === 'warning'
    if (filter === 'paused') return false
    return true
  })

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground" suppressHydrationWarning>
          My Following {hasMounted && `(${overview.totalFollowed})`}
        </h1>
      </div>

      {/* 快速筛选 */}
      <div className="flex gap-2">
        {[
          { value: 'all' as const, label: '全部', count: overview.totalFollowed },
          { value: 'active' as const, label: '活跃', count: overview.activeFollowed },
          { value: 'warning' as const, label: '警示', count: overview.totalFollowed - overview.activeFollowed },
          { value: 'paused' as const, label: '已暂停', count: 0 },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-smooth-fast",
              filter === f.value
                ? "bg-primary text-white"
                : "bg-base-gray-100 text-base-gray-700 hover:bg-base-gray-200"
            )}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 跟单总览 */}
        <div className="rounded-lg bg-white border border-base-gray-200 p-6 card-elevated">
          <h3 className="mb-4 text-lg font-bold text-foreground">跟单总览</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-base-gray-700 font-medium">关注交易者</div>
              <div className="mt-1 text-2xl font-bold text-foreground">{overview.totalFollowed}</div>
              <div className="text-xs text-base-gray-700">活跃: {overview.activeFollowed}</div>
            </div>

            <div>
              <div className="text-xs text-base-gray-700 font-medium">总投入</div>
              <div className="mt-1 text-2xl font-bold text-foreground">${formatNumber(overview.totalInvested)}</div>
            </div>

            <div>
              <div className="text-xs text-base-gray-700 font-medium">总盈亏</div>
              <div
                className={cn(
                  "mt-1 text-2xl font-bold",
                  overview.totalPnL > 0 ? "text-success" : "text-danger"
                )}
              >
                {overview.totalPnL > 0 ? '+' : ''}${formatNumber(overview.totalPnL)}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-base-gray-50 border border-base-gray-200 p-3">
            <span className="text-sm text-base-gray-900">今日动态</span>
            <span className="text-lg font-bold text-primary">{overview.todayActivities} 条</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-success/10 border border-success/20 p-3">
              <div className="text-xs text-base-gray-700 font-medium">表现最佳</div>
              <Link
                href={`/traders/${overview.topPerformer.address}`}
                className="mt-1 block font-mono text-sm text-foreground hover:text-primary"
              >
                {overview.topPerformer.address.slice(0, 6)}...{overview.topPerformer.address.slice(-4)}
              </Link>
              <div className="mt-1 text-lg font-bold text-success">
                +${formatNumber(overview.topPerformer.pnl)}
              </div>
            </div>

            <div className="rounded-lg bg-danger/10 border border-danger/20 p-3">
              <div className="text-xs text-base-gray-700 font-medium">表现最差</div>
              <Link
                href={`/traders/${overview.worstPerformer.address}`}
                className="mt-1 block font-mono text-sm text-foreground hover:text-primary"
              >
                {overview.worstPerformer.address.slice(0, 6)}...{overview.worstPerformer.address.slice(-4)}
              </Link>
              <div className="mt-1 text-lg font-bold text-danger">
                ${formatNumber(overview.worstPerformer.pnl)}
              </div>
            </div>
          </div>
        </div>

        {/* 最近动态 */}
        <div className="lg:col-span-2 rounded-lg bg-white border border-base-gray-200 p-6 card-elevated">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">🔔 最近动态</h3>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-success"></div>
              <span className="text-xs text-base-gray-700">实时更新</span>
            </div>
          </div>

          <div className="max-h-96 space-y-2 overflow-y-auto">
            {followedTraders.map((trader, i) => (
              <div key={trader.address} className="rounded-lg bg-base-gray-50 border border-base-gray-200 p-3 hover:bg-base-gray-100 transition-smooth-fast">
                <div className="flex items-start gap-2">
                  <span className="text-xl">💰</span>
                  <div className="flex-1">
                    <p className="text-sm text-base-gray-900">
                      <Link
                        href={`/traders/${trader.address}`}
                        className="font-mono font-medium text-foreground hover:text-primary"
                      >
                        {trader.shortAddress}
                      </Link>{' '}
                      买入 "2024美国总统选举" ${formatNumber(Math.random() * 10000 + 1000)} @0.62
                    </p>
                    <div className="mt-1 text-xs text-base-gray-700">{i * 5 + 2}分钟前</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 关注的交易者列表 */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground">📋 我关注的交易者</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTraders.map((trader) => (
            <FollowedTraderCard key={trader.address} trader={trader} />
          ))}
        </div>
      </div>
    </div>
  )
}
