'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import { getAllProductsAdmin, moderateProduct } from '@/lib/admin'

const STATUS_STYLES: Record<string, string> = {
    approved: 'bg-green-100 text-green-700',
    pending_review: 'bg-orange-100 text-orange-700',
    rejected: 'bg-red-100 text-red-700',
    delisted: 'bg-neutral-200 text-neutral-600',
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [busyId, setBusyId] = useState<string | null>(null)
    const [filter, setFilter] = useState('pending_review')

    const load = (status: string) => {
        setLoading(true)
        getAllProductsAdmin(status === 'all' ? undefined : status)
            .then(setProducts)
            .finally(() => setLoading(false))
    }

    useEffect(() => { load(filter) }, [filter])

    const handleApprove = async (id: string) => {
        setBusyId(id)
        try {
            await moderateProduct(id, 'approve')
            if (filter === 'all' || filter === 'approved') {
                load(filter)
            } else {
                setProducts(prev => prev.filter(p => p._id !== id))
            }
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
            if (filter !== 'all' && filter !== 'rejected') {
                setProducts(prev => prev.filter(p => p._id !== id))
            } else {
                load(filter)
            }
        } finally {
            setBusyId(null)
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
                <p className="text-sm text-neutral-500 mt-1">
                    Full record of every product listed on the platform. New submissions land as &quot;Pending review&quot; — approve to publish, or reject with a reason.
                </p>
            </div>

            <div className="flex gap-2 mb-6">
                {[
                    { key: 'pending_review', label: 'Pending' },
                    { key: 'approved', label: 'Approved' },
                    { key: 'rejected', label: 'Rejected' },
                    { key: 'delisted', label: 'Delisted' },
                    { key: 'all', label: 'All' },
                ].map(s => (
                    <button
                        key={s.key}
                        onClick={() => setFilter(s.key)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            filter === s.key ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                        }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {loading && <p className="text-neutral-500">Loading...</p>}
            {!loading && products.length === 0 && (
                <p className="text-neutral-500">No products in this category.</p>
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
                            <p className="text-sm text-neutral-500">{product.category} • ₦{product.basePrice.toFixed(2)} • {product.totalStock} in stock</p>
                            <p className="text-xs text-neutral-400 mt-1">
                                Listed {new Date(product.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                            {product.status === 'rejected' && product.rejectionReason && (
                                <p className="text-sm text-red-600 mt-1">Reason: {product.rejectionReason}</p>
                            )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_STYLES[product.status] ?? ''}`}>
                            {product.status.replace('_', ' ')}
                        </span>
                        {product.status === 'pending_review' && (
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
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}