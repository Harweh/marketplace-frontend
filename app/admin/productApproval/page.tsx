'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import { getModerationQueue, moderateProduct } from '@/lib/admin'

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [busyId, setBusyId] = useState<string | null>(null)

    const load = () => {
        setLoading(true)
        getModerationQueue()
            .then(setProducts)
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleApprove = async (id: string) => {
        setBusyId(id)
        try {
            await moderateProduct(id, 'approve')
            setProducts(prev => prev.filter(p => p._id !== id))
        } finally {
            setBusyId(null)
        }
    }

    const handleReject = async (id: string) => {
        const reason = window.prompt('Reason for rejecting this product:')
        if (!reason) return
        setBusyId(id)
        try {
            await moderateProduct(id, 'reject', reason)
            setProducts(prev => prev.filter(p => p._id !== id))
        } finally {
            setBusyId(null)
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Products Awaiting Approval</h1>
                <p className="text-sm text-neutral-500 mt-1">
                    New products submitted by sellers land here first. Approve to publish them to the shop, or reject with a reason.
                </p>
            </div>

            {loading && <p className="text-neutral-500">Loading...</p>}
            {!loading && products.length === 0 && (
                <p className="text-neutral-500">No products awaiting review.</p>
            )}

            <div className="space-y-4">
                {products.map(product => (
                    <div
                        key={product._id}
                        className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center gap-4"
                    >
                        <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.images[0] && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-neutral-900">{product.title}</p>
                            <p className="text-sm text-neutral-500">{product.category} • ${product.basePrice.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleApprove(product._id)}
                                disabled={busyId === product._id}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleReject(product._id)}
                                disabled={busyId === product._id}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}