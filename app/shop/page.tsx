'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useInView } from 'react-intersection-observer'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import { Product, Category } from '@/types'

const PAGE_SIZE = 20

export default function ShopPage() {
    const searchParams = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [showFilters, setShowFilters] = useState(false)

    const [category, setCategory] = useState(searchParams?.get('category') || 'all')
    const searchQuery = searchParams?.get('q') || ''

    const { ref, inView } = useInView({ threshold: 0 })
    const hasMore = page < totalPages

    // Category list for the filter sidebar, from the real hierarchical model.
    useEffect(() => {
        getCategories().then(setCategories).catch(() => setCategories([]))
    }, [])

    const loadPage = useCallback(async (pageNum: number, reset: boolean) => {
        setLoading(true)
        try {
        const result = await getProducts({
            category: category !== 'all' ? category : undefined,
            q: searchQuery || undefined,
            page: pageNum,
            limit: PAGE_SIZE,
        })
        setProducts(prev => reset ? result.products : [...prev, ...result.products])
        setTotalPages(result.pages)
        setPage(result.page)
        } catch {
        // Leave existing products in place; an empty/failed fetch just
        // stops pagination rather than clearing what's already shown.
        } finally {
        setLoading(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, searchQuery])

    // Reset to page 1 whenever the category or search query changes.
    useEffect(() => {
        loadPage(1, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, searchQuery])

    useEffect(() => {
        if (inView && hasMore && !loading) {
        loadPage(page + 1, false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView])

    const categoryOptions = ['all', ...categories.map(c => c.slug)]
    const categoryLabel = (slug: string) =>
        slug === 'all' ? 'All' : categories.find(c => c.slug === slug)?.name ?? slug

    return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-40 pb-8">
                <div className="mb-8">
                    <h1 className="font-display text-4xl text-neutral-800 pt-5 lg:pt-12 sm:text-5xl font-bold mb-2">
                        {category !== 'all' ? categoryLabel(category) : 'All Products'}
                    </h1>
                    <p className="text-neutral-600">
                        {products.length} products found
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg p-6 sticky top-24">
                            <h3 className="font-semibold text-neutral-600 text-lg mb-4">Filters</h3>
                            <div>
                                <h4 className="font-medium text-neutral-600 mb-3">Category</h4>
                                <div className="space-y-2">
                                    {categoryOptions.map(slug => (
                                        <label key={slug} className="flex items-center cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={category === slug}
                                                onChange={() => setCategory(slug)}
                                                className="w-4 h-4 text-primary-600 focus:ring-primary-600"
                                            />
                                            <span className="ml-2 text-neutral-700 group-hover:text-primary-600 transition-colors capitalize">
                                                {categoryLabel(slug)}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="lg:hidden">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-black rounded-lg border border-neutral-600"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            Filters
                        </button>
                    </div>

                    {showFilters && (
                        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
                            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white text-neutral-600 p-6 overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-lg">Filters</h3>
                                    <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3">Category</h4>
                                    <div className="space-y-2">
                                        {categoryOptions.map(slug => (
                                            <label key={slug} className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="category-mobile"
                                                    checked={category === slug}
                                                    onChange={() => {
                                                        setCategory(slug)
                                                        setShowFilters(false)
                                                    }}
                                                    className="w-4 h-4 text-primary-600"
                                                />
                                                <span className="ml-2 text-neutral-700 capitalize">{categoryLabel(slug)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-1">
                        {products.length === 0 && !loading ? (
                            <div className="text-center py-20">
                                <p className="text-neutral-600 text-lg">No products found</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product, index) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            priority={index < 6}
                                        />
                                    ))}
                                </div>

                                {hasMore && (
                                    <div ref={ref} className="mt-8 text-center">
                                        {loading ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} className="bg-white rounded-lg overflow-hidden">
                                                        <div className="aspect-square skeleton" />
                                                        <div className="p-4 space-y-3">
                                                            <div className="h-4 skeleton rounded w-3/4" />
                                                            <div className="h-4 skeleton rounded w-1/2" />
                                                            <div className="h-6 skeleton rounded w-1/3" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => loadPage(page + 1, false)}
                                                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                                            >
                                                Load More
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}