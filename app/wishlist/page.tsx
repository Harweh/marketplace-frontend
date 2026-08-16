'use client'

import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { useWishlistStore } from '@/store/Wishlist'
import ProductCard from '@/components/ProductCard'

export default function WishlistPage() {
    const items = useWishlistStore(state => state.items)

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 pt-36 md:pt-40">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                        <Heart className="w-9 h-9 text-neutral-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your wishlist is empty</h1>
                    <p className="text-neutral-500 mb-8">Save items you love to find them here later.</p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Browse Products
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-40 pb-10">
                <div className="flex items-baseline justify-between mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Your Wishlist</h1>
                    <span className="text-sm text-neutral-500">{items.length} item{items.length === 1 ? '' : 's'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </main>
        </div>
    )
}