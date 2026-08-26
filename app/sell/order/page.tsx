'use client'

import { useEffect, useState } from 'react'
import { getMyOrders, updateSellerOrderStatus, SellerOrder } from '@/lib/seller'

// Mirrors the backend's allowed transitions exactly — sellers can only
// move an order forward through fulfillment. "Delivered" only comes from
// the buyer confirming (or an SLA auto-confirm), never the seller, so it's
// never offered here as an option.
const NEXT_STATUS: Record<string, { value: string; label: string } | null> = {
    placed: { value: 'confirmed', label: 'Confirm Order' },
    confirmed: { value: 'packed', label: 'Mark as Packed' },
    packed: { value: 'shipped', label: 'Mark as Shipped' },
    shipped: null, // waiting on buyer/SLA to confirm delivery — nothing left for the seller to do
}

const STATUS_STYLES: Record<string, string> = {
    placed: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-blue-100 text-blue-700',
    packed: 'bg-amber-100 text-amber-700',
    shipped: 'bg-amber-100 text-amber-700',
    delivered: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    return_requested: 'bg-orange-100 text-orange-700',
    refunded: 'bg-neutral-200 text-neutral-600',
}

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState<SellerOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [busyKey, setBusyKey] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const load = () => {
        setLoading(true)
        getMyOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleAdvance = async (orderId: string, subOrderId: string, nextStatus: string) => {
        const key = `${orderId}-${subOrderId}`
        setBusyKey(key)
        setError(null)
        try {
            await updateSellerOrderStatus(orderId, subOrderId, nextStatus)
            load()
        } catch {
            setError('Could not update order status. Please try again.')
        } finally {
            setBusyKey(null)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Orders</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {loading && <p className="text-neutral-500">Loading...</p>}
            {!loading && orders.length === 0 && <p className="text-neutral-500">No orders yet.</p>}

            <div className="space-y-4">
                {orders.map(order => {
                    const buyer = typeof order.buyer === 'string' ? null : order.buyer
                    const next = NEXT_STATUS[order.subOrder.status]
                    const key = `${order._id}-${order.subOrder._id}`
                    return (
                        <div key={order._id} className="bg-white rounded-lg border border-neutral-200 p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-semibold text-neutral-900">#{order.orderNumber}</p>
                                    <p className="text-sm text-neutral-500">
                                        {buyer ? `${buyer.name} • ${buyer.email}` : 'Buyer info unavailable'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-neutral-900">₦{order.subOrder.subtotal.toFixed(2)}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${STATUS_STYLES[order.subOrder.status] ?? ''}`}>
                                        {order.subOrder.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1 mb-3">
                                {order.subOrder.items.map((item, i) => (
                                    <p key={i} className="text-sm text-neutral-600">
                                        {item.quantity}× {item.title} — ₦{item.price.toFixed(2)}
                                    </p>
                                ))}
                            </div>

                            {next ? (
                                <button
                                    onClick={() => handleAdvance(order._id, order.subOrder._id, next.value)}
                                    disabled={busyKey === key}
                                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
                                >
                                    {busyKey === key ? 'Updating...' : next.label}
                                </button>
                            ) : order.subOrder.status === 'shipped' ? (
                                <p className="text-xs text-neutral-400">Waiting for buyer to confirm delivery.</p>
                            ) : null}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}