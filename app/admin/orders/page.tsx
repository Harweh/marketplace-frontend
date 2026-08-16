'use client'

import { useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus, AdminOrder } from '@/lib/admin'

const STATUS_OPTIONS = [
    'placed', 'confirmed', 'packed', 'shipped', 'delivered',
    'completed', 'cancelled', 'return_requested', 'refunded',
]

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<AdminOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [busyKey, setBusyKey] = useState<string | null>(null)

    const load = (p: number) => {
        setLoading(true)
        getAllOrders(p)
            .then(res => {
                setOrders(res.orders)
                setPages(res.pages)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => { load(page) }, [page])

    const handleStatusChange = async (orderId: string, subOrderId: string, status: string) => {
        const key = `${orderId}-${subOrderId}`
        setBusyKey(key)
        try {
            const updated = await updateOrderStatus(orderId, subOrderId, status)
            setOrders(prev => prev.map(o => (o._id === orderId ? updated : o)))
        } finally {
            setBusyKey(null)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Orders</h1>

            {loading && <p className="text-neutral-500">Loading...</p>}
            {!loading && orders.length === 0 && <p className="text-neutral-500">No orders yet.</p>}

            <div className="space-y-6">
                {orders.map(order => {
                    const buyer = typeof order.buyer === 'string' ? null : order.buyer
                    return (
                        <div key={order._id} className="bg-white rounded-lg border border-neutral-200 p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-semibold text-neutral-900">#{order.orderNumber}</p>
                                    <p className="text-sm text-neutral-500">
                                        {buyer ? `${buyer.name} • ${buyer.email}${buyer.phone ? ` • ${buyer.phone}` : ''}` : 'Buyer info unavailable'}
                                    </p>
                                    <p className="text-sm text-neutral-500">
                                        {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-neutral-900">${order.totalAmount.toFixed(2)}</p>
                                    <p className="text-xs text-neutral-500 capitalize">{order.paymentStatus}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.subOrders.map(sub => {
                                    const vendor = typeof sub.vendor === 'string' ? null : sub.vendor
                                    const key = `${order._id}-${sub._id}`
                                    return (
                                        <div key={sub._id} className="flex items-center justify-between bg-neutral-50 rounded-lg p-3">
                                            <div>
                                                <p className="text-sm font-medium text-neutral-800">
                                                    {vendor ? vendor.storeName : 'Vendor'} — {sub.items.length} item(s) — ${sub.subtotal.toFixed(2)}
                                                </p>
                                                <p className="text-xs text-neutral-500 capitalize">Status: {sub.status.replace('_', ' ')}</p>
                                            </div>
                                            <select
                                                value={sub.status}
                                                disabled={busyKey === key}
                                                onChange={e => handleStatusChange(order._id, sub._id, e.target.value)}
                                                className="text-sm border border-neutral-300 rounded-lg px-2 py-1.5"
                                            >
                                                {STATUS_OPTIONS.map(s => (
                                                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {pages > 1 && (
                <div className="flex gap-2 mt-6">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium ${
                                page === p ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}