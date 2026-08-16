'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/products'
import { Product } from '@/types'

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getProducts({ limit: 12 })
            .then(res => setProducts(res.products))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-40 pb-8">
                <div className="text-center mb-12">
                    <h1 className="font-display text-4xl font-bold text-neutral-900 mb-3">
                        Welcome to E-Shop
                    </h1>
                    <p className="text-neutral-600">Discover products from independent sellers.</p>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900">New Arrivals</h2>
                    <Link href="/shop" className="text-primary-600 hover:text-primary-700 font-medium">
                        View all →
                    </Link>
                </div>

                {loading && <p className="text-neutral-500">Loading products...</p>}
                {!loading && products.length === 0 && (
                    <p className="text-neutral-500">No products available yet.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, i) => (
                        <ProductCard key={product._id} product={product} priority={i < 4} />
                    ))}
                </div>
            </main>
        </div>
    )
}