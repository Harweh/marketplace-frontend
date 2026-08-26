'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { getModerationQueue, getVendors, getAllOrders, getSalesStats, getSalesBreakdown, SalesStats, SalesBreakdown } from '@/lib/admin'

export default function AdminDashboard() {
    const [pendingProducts, setPendingProducts] = useState<number | null>(null)
    const [pendingVendors, setPendingVendors] = useState<number | null>(null)
    const [recentOrders, setRecentOrders] = useState<number | null>(null)
    const [sales, setSales] = useState<SalesStats | null>(null)
    const [breakdown, setBreakdown] = useState<SalesBreakdown | null>(null)

    useEffect(() => {
        getModerationQueue().then(list => setPendingProducts(list.length)).catch(() => setPendingProducts(0))
        getVendors('pending').then(list => setPendingVendors(list.length)).catch(() => setPendingVendors(0))
        getAllOrders(1).then(res => setRecentOrders(res.total)).catch(() => setRecentOrders(0))
        getSalesStats().then(setSales).catch(() => setSales(null))
        getSalesBreakdown().then(setBreakdown).catch(() => setBreakdown(null))
    }, [])

    const queueCards = [
        { label: 'Products Awaiting Review', value: pendingProducts, href: '/admin/products', color: 'bg-orange-50 text-orange-700' },
        { label: 'Vendor Applications Pending', value: pendingVendors, href: '/admin/vendors', color: 'bg-blue-50 text-blue-700' },
        { label: 'Total Orders', value: recentOrders, href: '/admin/orders', color: 'bg-green-50 text-green-700' },
    ]

    const salesCards = sales
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
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Dashboard</h1>

            {/* Sales summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                {sales === null && <p className="text-neutral-500 col-span-4">Loading sales data...</p>}
                {salesCards.map(card => (
                    <div key={card.label} className="p-6 rounded-xl bg-neutral-900 text-white">
                        <p className="text-sm text-neutral-300 mb-2">{card.label}</p>
                        <p className="text-2xl font-bold">₦{card.total.toFixed(2)}</p>
                        <p className="text-xs text-neutral-400 mt-1">{card.count} paid order{card.count === 1 ? '' : 's'}</p>
                    </div>
                ))}
            </div>

            {/* Needs attention */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {queueCards.map(card => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className={`p-6 rounded-xl ${card.color} hover:opacity-80 transition-opacity`}
                    >
                        <p className="text-sm font-medium mb-2">{card.label}</p>
                        <p className="text-3xl font-bold">{card.value === null ? '…' : card.value}</p>
                    </Link>
                ))}
            </div>

            {/* Daily trend chart */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
                <h2 className="font-semibold text-neutral-900 mb-4">Sales — Last 30 Days</h2>
                {breakdown && breakdown.daily.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={breakdown.daily}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value: number) => `₦${value.toFixed(2)}`} />
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
                                        <span className="font-medium text-neutral-900">₦{cat.total.toFixed(2)}</span>
                                    </div>
                                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${(cat.total / maxCategoryTotal) * 100}%` }} />
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
                                        <span className="font-medium text-neutral-900">₦{v.total.toFixed(2)}</span>
                                    </div>
                                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-600 rounded-full" style={{ width: `${(v.total / maxVendorTotal) * 100}%` }} />
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