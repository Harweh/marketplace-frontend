'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getMyProducts, updateMyProduct } from '@/lib/seller'
import { ApiError } from '@/lib/api'
import { Product } from '@/types'

export default function EditProductPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [basePrice, setBasePrice] = useState('')
    const [variantPrices, setVariantPrices] = useState<Record<string, { price: string; stock: string }>>({})

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        getMyProducts().then(products => {
            const found = products.find(p => p._id === id)
            if (found) {
                setProduct(found)
                setTitle(found.title)
                setDescription(found.description)
                setCategory(found.category)
                setBasePrice(String(found.basePrice))
                const vp: Record<string, { price: string; stock: string }> = {}
                found.variants.forEach(v => {
                    vp[v.sku] = { price: String(v.price), stock: String(v.stock) }
                })
                setVariantPrices(vp)
            }
        }).finally(() => setLoading(false))
    }, [id])

    // Editing these fields sends the listing back for admin review — see
    // the backend for why. Flagged here so it's not a surprise.
    const trustSensitiveChanged = product && (
        title !== product.title ||
        description !== product.description ||
        category !== product.category
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!product) return
        setError(null)
        setSubmitting(true)
        try {
            const variants = product.hasVariants
                ? product.variants.map(v => ({
                    sku: v.sku,
                    attributes: v.attributes,
                    price: Number(variantPrices[v.sku]?.price ?? v.price),
                    stock: Number(variantPrices[v.sku]?.stock ?? v.stock),
                }))
                : []

            await updateMyProduct(product._id, {
                title,
                description,
                category,
                basePrice: Number(basePrice),
                variants,
            })
            setSaved(true)
            setTimeout(() => router.push('/sell/products'), 1200)
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not save changes.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <p className="text-neutral-500">Loading...</p>
    if (!product) return <p className="text-neutral-500">Product not found.</p>

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Edit Product</h1>
            <p className="text-neutral-500 mb-6">
                Price and stock changes apply immediately. Changing the title, description, or category sends this listing back for admin review before it&apos;s visible again.
            </p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
            )}
            {saved && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">Saved.</div>
            )}
            {trustSensitiveChanged && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                    Saving these changes will send this listing back for admin review.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block font-medium text-neutral-800 mb-2">Title</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                    />
                </div>
                <div>
                    <label className="block font-medium text-neutral-800 mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        rows={4}
                        className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                    />
                </div>
                <div>
                    <label className="block font-medium text-neutral-800 mb-2">Category</label>
                    <input
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        required
                        className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                    />
                </div>

                {!product.hasVariants && (
                    <div>
                        <label className="block font-medium text-neutral-800 mb-2">Base Price (₦)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={basePrice}
                            onChange={e => setBasePrice(e.target.value)}
                            required
                            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                        />
                    </div>
                )}

                {product.hasVariants && (
                    <div>
                        <label className="block font-medium text-neutral-800 mb-3">Variants — Price &amp; Stock</label>
                        <div className="space-y-2">
                            {product.variants.map(v => (
                                <div key={v.sku} className="grid grid-cols-3 gap-2 items-center">
                                    <span className="text-sm text-neutral-600">
                                        {Object.values(v.attributes).join(' / ') || v.sku}
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={variantPrices[v.sku]?.price ?? ''}
                                        onChange={e => setVariantPrices(prev => ({
                                            ...prev, [v.sku]: { ...prev[v.sku], price: e.target.value },
                                        }))}
                                        placeholder="Price"
                                        className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="number"
                                        value={variantPrices[v.sku]?.stock ?? ''}
                                        onChange={e => setVariantPrices(prev => ({
                                            ...prev, [v.sku]: { ...prev[v.sku], stock: e.target.value },
                                        }))}
                                        placeholder="Stock"
                                        className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-lg"
                >
                    {submitting ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    )
}