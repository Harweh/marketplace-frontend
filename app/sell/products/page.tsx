'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getMyProducts, delistMyProduct } from '@/lib/seller'
import { Product } from '@/types'

const STATUS_COLORS: Record<string, string> = {
    approved: 'bg-green-100 text-green-700',
    pending_review: 'bg-orange-100 text-orange-700',
    rejected: 'bg-red-100 text-red-700',
    delisted: 'bg-neutral-200 text-neutral-600',
}

export default function SellerProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [busyId, setBusyId] = useState<string | null>(null)

    const load = () => {
        setLoading(true)
        getMyProducts().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleDelist = async (id: string) => {
        if (!window.confirm('Delist this product? It will stop showing in the shop, but stays in your records.')) return
        setBusyId(id)
        try {
            await delistMyProduct(id)
            load()
        } finally {
            setBusyId(null)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Your Products</h1>
                <Link
                    href="/sell/products/new"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg"
                >
                    + Add Product
                </Link>
            </div>

            {loading && <p className="text-neutral-500">Loading...</p>}
            {!loading && products.length === 0 && (
                <p className="text-neutral-500">You haven&apos;t listed any products yet.</p>
            )}

            <div className="space-y-3">
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
                            <p className="text-sm text-neutral-500">
                                {product.category} • ₦{product.basePrice.toFixed(2)} • {product.totalStock} in stock
                            </p>
                            {product.status === 'rejected' && product.rejectionReason && (
                                <p className="text-sm text-red-600 mt-1">Reason: {product.rejectionReason}</p>
                            )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[product.status] ?? ''}`}>
                            {product.status.replace('_', ' ')}
                        </span>
                        {product.status !== 'delisted' && (
                            <div className="flex gap-2">
                                <Link
                                    href={`/sell/products/${product._id}/edit`}
                                    className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-sm font-medium rounded-lg"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelist(product._id)}
                                    disabled={busyId === product._id}
                                    className="px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg disabled:opacity-50"
                                >
                                    Delist
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}