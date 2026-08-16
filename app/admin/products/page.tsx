'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadProductImages } from '@/lib/uploads'
import { createProduct } from '@/lib/products'
import { ApiError } from '@/lib/api'

interface VariantRow {
    sku: string
    color: string
    size: string
    price: string
    stock: string
}

export default function NewProductPage() {
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [basePrice, setBasePrice] = useState('')
    const [hasVariants, setHasVariants] = useState(false)
    const [variants, setVariants] = useState<VariantRow[]>([
        { sku: '', color: '', size: '', price: '', stock: '' },
    ])

    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFilesSelected = (selected: FileList | null) => {
        if (!selected) return
        const list = Array.from(selected).slice(0, 6) // main image + up to 5 sub-images
        setFiles(list)
        setPreviews(list.map(f => URL.createObjectURL(f)))
    }

    const updateVariant = (index: number, field: keyof VariantRow, value: string) => {
        setVariants(prev => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)))
    }

    const addVariantRow = () => {
        setVariants(prev => [...prev, { sku: '', color: '', size: '', price: '', stock: '' }])
    }

    const removeVariantRow = (index: number) => {
        setVariants(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (files.length === 0) {
            setError('Please add at least one product image.')
            return
        }
        if (!basePrice || Number(basePrice) <= 0) {
            setError('Please enter a valid base price.')
            return
        }

        setSubmitting(true)
        try {
            // 1. Upload images to Cloudinary first — the product record needs
            //    real hosted URLs, not local file objects.
            const imageUrls = await uploadProductImages(files)

            // 2. Build the variants array only if "has variants" is checked.
            const builtVariants = hasVariants
                    ? variants
                        .filter(v => v.sku && v.price && v.stock !== '')
                        .map(v => ({
                            sku: v.sku,
                            attributes: {
                                ...(v.color ? { color: v.color } : {}),
                                ...(v.size ? { size: v.size } : {}),
                            },
                            price: Number(v.price),
                            stock: Number(v.stock),
                        }))
                    : []

            // 3. Create the product — it goes straight into the admin
            //    moderation queue as "pending_review".
            await createProduct({
                title,
                description,
                category,
                images: imageUrls,
                basePrice: Number(basePrice),
                hasVariants,
                variants: builtVariants,
            })

            router.push('/sell/products?submitted=1')
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError('Something went wrong. Please try again.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-3xl mt-30 mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Add a Product</h1>
            <p className="text-neutral-900 mb-8">
                New listings go to an admin for review before they appear in the shop.
            </p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-medium text-neutral-900 mb-2">Title</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        minLength={3}
                        className="w-full border border-neutral-500 text-black rounded-lg px-4 py-2.5"
                        placeholder="e.g. Minimalist Leather Tote"
                    />
                </div>

                <div>
                    <label className="block font-medium text-neutral-800 mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        minLength={10}
                        rows={4}
                        className="w-full border border-neutral-500 text-black rounded-lg px-4 py-2.5"
                        placeholder="Describe the product..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-neutral-800 mb-2">Category</label>
                        <input
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            required
                            className="w-full border border-neutral-500 text-black rounded-lg px-4 py-2.5"
                            placeholder="e.g. Bags"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-neutral-800 mb-2">Base Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={basePrice}
                            onChange={e => setBasePrice(e.target.value)}
                            required
                            className="w-full border border-neutral-500 text-black rounded-lg px-4 py-2.5"
                            placeholder="49.99"
                        />
                    </div>
                </div>

                {/* Images */}
                <div>
                    <label className="block font-medium text-neutral-800 mb-2">
                        Images (first = main image, rest = sub-images, up to 6)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => handleFilesSelected(e.target.files)}
                        className="block border-neutral-500 text-black"
                    />
                    {previews.length > 0 && (
                        <div className="flex gap-3 mt-3 flex-wrap">
                            {previews.map((src, i) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    key={i}
                                    src={src}
                                    alt={`preview ${i}`}
                                    className={`w-20 h-20 object-cover rounded-lg border-2 ${
                                        i === 0 ? 'border-primary-600' : 'border-neutral-200'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Variants */}
                <div>
                    <label className="flex items-center gap-2 font-medium text-neutral-800 mb-3">
                        <input
                            type="checkbox"
                            checked={hasVariants}
                            onChange={e => setHasVariants(e.target.checked)}
                        />
                        This product has variants (color, size, etc.)
                    </label>

                    {hasVariants && (
                        <div className="space-y-3">
                            {variants.map((v, i) => (
                                <div key={i} className="grid grid-cols-5 gap-2 items-center">
                                    <input
                                        placeholder="SKU"
                                        value={v.sku}
                                        onChange={e => updateVariant(i, 'sku', e.target.value)}
                                        className="border border-neutral-500 text-black rounded-lg px-3 py-2 text-sm"
                                    />
                                    <input
                                        placeholder="Color"
                                        value={v.color}
                                        onChange={e => updateVariant(i, 'color', e.target.value)}
                                        className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                    <input
                                        placeholder="Size"
                                        value={v.size}
                                        onChange={e => updateVariant(i, 'size', e.target.value)}
                                        className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Price"
                                        value={v.price}
                                        onChange={e => updateVariant(i, 'price', e.target.value)}
                                        className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Stock"
                                            value={v.stock}
                                            onChange={e => updateVariant(i, 'stock', e.target.value)}
                                            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm flex-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeVariantRow(i)}
                                            className="text-red-600 text-sm px-2"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addVariantRow}
                                className="text-sm text-primary-600 font-medium"
                            >
                                + Add another variant
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-lg"
                >
                    {submitting ? 'Submitting...' : 'Submit for Review'}
                </button>
            </form>
        </div>
    )
}