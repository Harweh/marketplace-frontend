'use client'

import { useEffect, useState } from 'react'
import { getPendingReturns, resolveReturn, PendingReturnOrder } from '@/lib/returns'

export default function AdminReturnsPage() {
    const [orders, setOrders] = useState<PendingReturnOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [busyKey, setBusyKey] = useState<string | null>(null)

    const load = () => {
        setLoading(true)
        getPendingReturns().then(setOrders).finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleResolve = async (orderId: string, subOrderId: string, approve: boolean) => {
        const key = `${orderId}-${subOrderId}`
        setBusyKey(key)
        try {
            await resolveReturn(orderId, subOrderId, approve)
            load()
        } finally {
            setBusyKey(null)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Return Requests</h1>
            <p className="text-sm text-neutral-500 mb-6">Approving triggers a real refund via Paystack.</p>

            {loading && <p className="text-neutral-500">Loading...</p>}
            {!loading && orders.length === 0 && <p className="text-neutral-500">No pending return requests.</p>}

            <div className="space-y-4">
                {orders.map(order => {
                    const buyer = typeof order.buyer === 'string' ? null : order.buyer
                    return order.subOrders
                        .filter(s => s.returnStatus === 'requested')
                        .map(sub => {
                            const vendor = typeof sub.vendor === 'string' ? null : sub.vendor
                            const key = `${order._id}-${sub._id}`
                            return (
                                <div key={key} className="bg-white rounded-lg border border-neutral-200 p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-semibold text-neutral-900">#{order.orderNumber}</p>
                                            <p className="text-sm text-neutral-500">
                                                {buyer ? `${buyer.name} • ${buyer.email}` : 'Buyer info unavailable'}
                                                {vendor && ` · Sold by ${vendor.storeName}`}
                                            </p>
                                        </div>
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
                                            Pending Review
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        {sub.items.map((item, i) => (
                                            <p key={i} className="text-sm text-neutral-600">
                                                {item.quantity}× {item.title} — ₦{item.price.toFixed(2)}
                                            </p>
                                        ))}
                                    </div>

                                    <div className="bg-neutral-50 rounded-lg p-3 mb-3">
                                        <p className="text-xs font-medium text-neutral-500 mb-1">Reason</p>
                                        <p className="text-sm text-neutral-800">{sub.returnReason}</p>
                                    </div>

                                    {sub.returnPhotos && sub.returnPhotos.length > 0 && (
                                        <div className="flex gap-2 mb-3">
                                            {sub.returnPhotos.map((url, i) => (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img key={i} src={url} alt={`Evidence ${i + 1}`} className="w-16 h-16 object-cover rounded-lg border border-neutral-200" />
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleResolve(order._id, sub._id, true)}
                                            disabled={busyKey === key}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
                                        >
                                            Approve & Refund
                                        </button>
                                        <button
                                            onClick={() => handleResolve(order._id, sub._id, false)}
                                            disabled={busyKey === key}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                })}
            </div>
        </div>
    )
}