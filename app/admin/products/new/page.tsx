'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { uploadProductImages } from '@/lib/uploads'
import { createProduct } from '@/lib/products'
import { ApiError } from '@/lib/api'

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface VariantRow {
    sku: string
    color: string
    size: string
    price: string
    stock: string
}

function slugPart(text: string): string {
    return text.toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 12) || 'ITEM'
}

export default function NewProductPage() {
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [basePrice, setBasePrice] = useState('')
    const [hasVariants, setHasVariants] = useState(false)

    // ── Color chips ──
    const [colorInput, setColorInput] = useState('')
    const [colors, setColors] = useState<string[]>([])

    const addColor = () => {
        const c = colorInput.trim()
        if (c && !colors.includes(c)) setColors(prev => [...prev, c])
        setColorInput('')
    }
    const removeColor = (c: string) => setColors(prev => prev.filter(x => x !== c))

    // ── Sizes: preset picks + custom additions ──
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [customSizeInput, setCustomSizeInput] = useState('')
    const [customSizes, setCustomSizes] = useState<string[]>([])

    const toggleSize = (size: string) => {
        setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
    }
    const addCustomSize = () => {
        const s = customSizeInput.trim()
        if (s && !customSizes.includes(s) && !PRESET_SIZES.includes(s)) {
            setCustomSizes(prev => [...prev, s])
            setSelectedSizes(prev => [...prev, s])
        }
        setCustomSizeInput('')
    }

    const allSizes = [...PRESET_SIZES, ...customSizes]

    // ── Generated / manual variant rows ──
    const [variants, setVariants] = useState<VariantRow[]>([])

    const generateVariants = () => {
        const sizesToUse = selectedSizes.length > 0 ? selectedSizes : ['']
        const colorsToUse = colors.length > 0 ? colors : ['']

        const rows: VariantRow[] = []
        for (const color of colorsToUse) {
            for (const size of sizesToUse) {
                if (!color && !size) continue
                const skuParts = [slugPart(title || 'ITEM')]
                if (color) skuParts.push(slugPart(color))
                if (size) skuParts.push(slugPart(size))
                rows.push({
                    sku: skuParts.join('-'),
                    color,
                    size,
                    price: basePrice || '',
                    stock: '',
                })
            }
        }
        setVariants(rows)
    }

    const updateVariant = (index: number, field: 'price' | 'stock' | 'sku', value: string) => {
        setVariants(prev => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)))
    }
    const removeVariantRow = (index: number) => {
        setVariants(prev => prev.filter((_, i) => i !== index))
    }

    // ── Images ──
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])

    const handleFilesSelected = (selected: FileList | null) => {
        if (!selected) return
        const list = Array.from(selected).slice(0, 6)
        setFiles(list)
        setPreviews(list.map(f => URL.createObjectURL(f)))
    }

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

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
        if (hasVariants && variants.length === 0) {
            setError('Click "Generate Variants" to build your color/size combinations, or fill in stock for each one first.')
            return
        }
        if (hasVariants) {
            const incomplete = variants.some(v => !v.price || v.stock === '')
            if (incomplete) {
                setError('Please fill in price and stock for every variant.')
                return
            }
        }

        setSubmitting(true)
        try {
            const imageUrls = await uploadProductImages(files)

            const builtVariants = hasVariants
                ? variants.map(v => ({
                    sku: v.sku,
                    attributes: {
                        ...(v.color ? { color: v.color } : {}),
                        ...(v.size ? { size: v.size } : {}),
                    },
                    price: Number(v.price),
                    stock: Number(v.stock),
                }))
                : []

            await createProduct({
                title,
                description,
                category,
                images: imageUrls,
                basePrice: Number(basePrice),
                hasVariants,
                variants: builtVariants,
            })

            router.push('/admin/products?submitted=1')
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 pt-36 md:pt-40 pb-10">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Add a Product</h1>
            <p className="text-neutral-500 mb-8">
                As an admin, products you add are published immediately &mdash; no review needed.
            </p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-medium text-neutral-800 mb-2">Title</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        minLength={3}
                        className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
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
                        className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
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
                            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                            placeholder="e.g. Bags"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-neutral-800 mb-2">Base Price (₦)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={basePrice}
                            onChange={e => setBasePrice(e.target.value)}
                            required
                            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                            placeholder="4999"
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
                        className="block"
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
                    <label className="flex items-center gap-2 font-medium text-neutral-800 mb-4">
                        <input
                            type="checkbox"
                            checked={hasVariants}
                            onChange={e => {
                                setHasVariants(e.target.checked)
                                if (!e.target.checked) setVariants([])
                            }}
                        />
                        This product has variants (color, size, etc.)
                    </label>

                    {hasVariants && (
                        <div className="space-y-6 border border-neutral-200 rounded-lg p-4">
                            {/* Colors */}
                            <div>
                                <h4 className="text-sm font-semibold text-neutral-800 mb-2">Colors</h4>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        value={colorInput}
                                        onChange={e => setColorInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColor() } }}
                                        placeholder="e.g. Red — press Enter to add"
                                        className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                    <button type="button" onClick={addColor} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-sm font-medium rounded-lg">
                                        Add
                                    </button>
                                </div>
                                {colors.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map(c => (
                                            <span key={c} className="flex items-center gap-1.5 bg-neutral-100 text-neutral-700 text-sm px-3 py-1.5 rounded-full">
                                                {c}
                                                <button type="button" onClick={() => removeColor(c)}>
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Sizes — preset picker, so everyone uses the same labels
                                instead of typing inconsistent free text like "Small" vs "S". */}
                            <div>
                                <h4 className="text-sm font-semibold text-neutral-800 mb-2">Sizes</h4>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {allSizes.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => toggleSize(size)}
                                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                selectedSizes.includes(size)
                                                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                    : 'border-neutral-300 text-neutral-700 hover:border-neutral-400'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        value={customSizeInput}
                                        onChange={e => setCustomSizeInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSize() } }}
                                        placeholder="Custom size (e.g. One Size, 42)"
                                        className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                    <button type="button" onClick={addCustomSize} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-sm font-medium rounded-lg">
                                        Add Size
                                    </button>
                                </div>
                            </div>

                            {/* Generate */}
                            <div>
                                <button
                                    type="button"
                                    onClick={generateVariants}
                                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-lg"
                                >
                                    {variants.length > 0 ? 'Regenerate Variants' : 'Generate Variants'}
                                </button>
                                <p className="text-xs text-neutral-500 mt-2">
                                    Creates one row per color + size combination. You can still edit price/stock per row after — regenerating replaces the current rows.
                                </p>
                            </div>

                            {/* Generated rows */}
                            {variants.length > 0 && (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-5 gap-2 text-xs font-medium text-neutral-500 px-1">
                                        <span>SKU</span>
                                        <span>Color</span>
                                        <span>Size</span>
                                        <span>Price</span>
                                        <span>Stock</span>
                                    </div>
                                    {variants.map((v, i) => (
                                        <div key={i} className="grid grid-cols-5 gap-2 items-center">
                                            <input
                                                value={v.sku}
                                                onChange={e => updateVariant(i, 'sku', e.target.value)}
                                                className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                            />
                                            <span className="text-sm text-neutral-600">{v.color || '—'}</span>
                                            <span className="text-sm text-neutral-600">{v.size || '—'}</span>
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
                                                <button type="button" onClick={() => removeVariantRow(i)} className="text-red-600 text-sm px-2">
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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