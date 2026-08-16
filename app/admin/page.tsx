'use client'

import { useEffect, useState } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { getSalesStats, getSalesBreakdown, SalesStats, SalesBreakdown } from '@/lib/admin'

export default function AdminStatsPage() {
    const [sales, setSales] = useState<SalesStats | null>(null)
    const [breakdown, setBreakdown] = useState<SalesBreakdown | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getSalesStats(), getSalesBreakdown()])
            .then(([s, b]) => {
                setSales(s)
                setBreakdown(b)
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <p className="text-neutral-500">Loading stats...</p>
    }

    const summaryCards = sales
        ? [
            { label: 'Today', total: sales.today.total, count: sales.today.count },
            { label: 'This Week', total: sales.week.total, count: sales.week.count },
            { label: 'This Month', total: sales.month.total, count: sales.month.count },
            { label: 'All Time', total: sales.allTime.total, count: sales.allTime.count },
        ]
        : []

    const maxCategoryTotal = Math.max(...(breakdown?.byCategory.map(c => c.total) ?? [1]), 1)
    const maxVendorTotal = Math.max(...(breakdown?.byVendor.map(v => v.total) ?? [1]), 1)

    return (
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Stats</h1>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                {summaryCards.map(card => (
                    <div key={card.label} className="p-6 rounded-xl bg-neutral-900 text-white">
                        <p className="text-sm text-neutral-300 mb-2">{card.label}</p>
                        <p className="text-2xl font-bold">${card.total.toFixed(2)}</p>
                        <p className="text-xs text-neutral-400 mt-1">{card.count} paid order{card.count === 1 ? '' : 's'}</p>
                    </div>
                ))}
            </div>

            {/* Daily trend chart */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-10">
                <h2 className="font-semibold text-neutral-900 mb-4">Sales — Last 30 Days</h2>
                {breakdown && breakdown.daily.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={breakdown.daily}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            <Line type="monotone" dataKey="total" stroke="#000000" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-neutral-500 text-sm">No sales in the last 30 days yet.</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* By category */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="font-semibold text-neutral-900 mb-4">Sales by Category</h2>
                    {breakdown && breakdown.byCategory.length > 0 ? (
                        <div className="space-y-3">
                            {breakdown.byCategory.map(cat => (
                                <div key={cat.category}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-neutral-700 capitalize">{cat.category}</span>
                                        <span className="font-medium text-neutral-900">${cat.total.toFixed(2)}</span>
                                    </div>
                                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-neutral-900 rounded-full"
                                            style={{ width: `${(cat.total / maxCategoryTotal) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-neutral-500 text-sm">No category sales data yet.</p>
                    )}
                </div>

                {/* By vendor */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="font-semibold text-neutral-900 mb-4">Top Vendors</h2>
                    {breakdown && breakdown.byVendor.length > 0 ? (
                        <div className="space-y-3">
                            {breakdown.byVendor.map(v => (
                                <div key={v.vendorId}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-neutral-700">{v.storeName || 'Unknown vendor'}</span>
                                        <span className="font-medium text-neutral-900">${v.total.toFixed(2)}</span>
                                    </div>
                                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-600 rounded-full"
                                            style={{ width: `${(v.total / maxVendorTotal) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-neutral-500 text-sm">No vendor sales data yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}