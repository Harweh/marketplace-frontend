// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { uploadProductImages } from '@/lib/uploads'
// import { createProduct } from '@/lib/products'
// import { ApiError } from '@/lib/api'

// interface VariantRow {
//     sku: string
//     color: string
//     size: string
//     price: string
//     stock: string
// }

// export default function NewProductPage() {
//     const router = useRouter()

//     const [title, setTitle] = useState('')
//     const [description, setDescription] = useState('')
//     const [category, setCategory] = useState('')
//     const [basePrice, setBasePrice] = useState('')
//     const [hasVariants, setHasVariants] = useState(false)
//     const [variants, setVariants] = useState<VariantRow[]>([
//         { sku: '', color: '', size: '', price: '', stock: '' },
//     ])

//     const [files, setFiles] = useState<File[]>([])
//     const [previews, setPreviews] = useState<string[]>([])

//     const [submitting, setSubmitting] = useState(false)
//     const [error, setError] = useState<string | null>(null)

//     const handleFilesSelected = (selected: FileList | null) => {
//         if (!selected) return
//         const list = Array.from(selected).slice(0, 6) // main image + up to 5 sub-images
//         setFiles(list)
//         setPreviews(list.map(f => URL.createObjectURL(f)))
//     }

//     const updateVariant = (index: number, field: keyof VariantRow, value: string) => {
//         setVariants(prev => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)))
//     }

//     const addVariantRow = () => {
//         setVariants(prev => [...prev, { sku: '', color: '', size: '', price: '', stock: '' }])
//     }

//     const removeVariantRow = (index: number) => {
//         setVariants(prev => prev.filter((_, i) => i !== index))
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         setError(null)

//         if (files.length === 0) {
//             setError('Please add at least one product image.')
//             return
//         }
//         if (!basePrice || Number(basePrice) <= 0) {
//             setError('Please enter a valid base price.')
//             return
//         }

//         setSubmitting(true)
//         try {
//             // 1. Upload images to Cloudinary first — the product record needs
//             //    real hosted URLs, not local file objects.
//             const imageUrls = await uploadProductImages(files)

//             // 2. Build the variants array only if "has variants" is checked.
//             const builtVariants = hasVariants
//                 ? variants
//                         .filter(v => v.sku && v.price && v.stock !== '')
//                         .map(v => ({
//                             sku: v.sku,
//                             attributes: {
//                                 ...(v.color ? { color: v.color } : {}),
//                                 ...(v.size ? { size: v.size } : {}),
//                             },
//                             price: Number(v.price),
//                             stock: Number(v.stock),
//                         }))
//                 : []

//             // 3. Create the product — it goes straight into the admin
//             //    moderation queue as "pending_review".
//             await createProduct({
//                 title,
//                 description,
//                 category,
//                 images: imageUrls,
//                 basePrice: Number(basePrice),
//                 hasVariants,
//                 variants: builtVariants,
//             })

//             router.push('/sell/products?submitted=1')
//         } catch (err) {
//             if (err instanceof ApiError) {
//                 setError(err.message)
//             } else {
//                 setError('Something went wrong. Please try again.')
//             }
//         } finally {
//             setSubmitting(false)
//         }
//     }

//     return (
//         <div className="max-w-3xl mx-auto px-4 mt-30 py-10">
//             <h1 className="text-2xl font-bold text-neutral-900 mb-2">Add a Product</h1>
//             <p className="text-neutral-500 mb-8">
//                 New listings go to an admin for review before they appear in the shop.
//             </p>

//             {error && (
//                 <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
//                     {error}
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                     <label className="block font-medium text-neutral-800 mb-2">Title</label>
//                     <input
//                         value={title}
//                         onChange={e => setTitle(e.target.value)}
//                         required
//                         minLength={3}
//                         className="w-full border border-neutral-300 text-neutral-800 rounded-lg px-4 py-2.5"
//                         placeholder="e.g. Minimalist Leather Tote"
//                     />
//                 </div>

//                 <div>
//                     <label className="block font-medium text-neutral-800 mb-2">Description</label>
//                     <textarea
//                         value={description}
//                         onChange={e => setDescription(e.target.value)}
//                         required
//                         minLength={10}
//                         rows={4}
//                         className="w-full border border-neutral-300 text-neutral-800 rounded-lg px-4 py-2.5"
//                         placeholder="Describe the product..."
//                     />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="block font-medium text-neutral-800 mb-2">Category</label>
//                         <input
//                             value={category}
//                             onChange={e => setCategory(e.target.value)}
//                             required
//                             className="w-full border border-neutral-300 text-neutral-800 rounded-lg px-4 py-2.5"
//                             placeholder="e.g. Bags"
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-medium text-neutral-800 mb-2">Base Price ($)</label>
//                         <input
//                             type="number"
//                             step="0.01"
//                             min="0.01"
//                             value={basePrice}
//                             onChange={e => setBasePrice(e.target.value)}
//                             required
//                             className="w-full border border-neutral-300 text-neutral-800 rounded-lg px-4 py-2.5"
//                             placeholder="49.99"
//                         />
//                     </div>
//                 </div>

//                 {/* Images */}
//                 <div>
//                     <label className="block font-medium text-neutral-800 mb-2">
//                         Images (first = main image, rest = sub-images, up to 6)
//                     </label>
//                     <input
//                         type="file"
//                         accept="image/*"
//                         multiple
//                         onChange={e => handleFilesSelected(e.target.files)}
//                         className="block text-neutral-500" 
//                     />
//                     {previews.length > 0 && (
//                         <div className="flex gap-3 mt-3 flex-wrap">
//                             {previews.map((src, i) => (
//                                 // eslint-disable-next-line @next/next/no-img-element
//                                 <img
//                                     key={i}
//                                     src={src}
//                                     alt={`preview ${i}`}
//                                     className={`w-20 h-20 object-cover rounded-lg border-2 ${
//                                         i === 0 ? 'border-primary-600' : 'border-neutral-200'
//                                     }`}
//                                 />
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* Variants */}
//                 <div>
//                     <label className="flex items-center gap-2 font-medium text-neutral-800 mb-3">
//                         <input
//                             type="checkbox"
//                             checked={hasVariants}
//                             onChange={e => setHasVariants(e.target.checked)}
//                         />
//                         This product has variants (color, size, etc.)
//                     </label>

//                     {hasVariants && (
//                         <div className="space-y-3">
//                             {variants.map((v, i) => (
//                                 <div key={i} className="grid grid-cols-5 gap-2 text-neutral-800 items-center">
//                                     <input
//                                         placeholder="SKU"
//                                         value={v.sku}
//                                         onChange={e => updateVariant(i, 'sku', e.target.value)}
//                                         className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
//                                     />
//                                     <input
//                                         placeholder="Color"
//                                         value={v.color}
//                                         onChange={e => updateVariant(i, 'color', e.target.value)}
//                                         className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
//                                     />
//                                     <input
//                                         placeholder="Size"
//                                         value={v.size}
//                                         onChange={e => updateVariant(i, 'size', e.target.value)}
//                                         className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
//                                     />
//                                     <input
//                                         type="number"
//                                         step="0.01"
//                                         placeholder="Price"
//                                         value={v.price}
//                                         onChange={e => updateVariant(i, 'price', e.target.value)}
//                                         className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
//                                     />
//                                     <div className="flex gap-2">
//                                         <input
//                                             type="number"
//                                             placeholder="Stock"
//                                             value={v.stock}
//                                             onChange={e => updateVariant(i, 'stock', e.target.value)}
//                                             className="border border-neutral-300 rounded-lg px-3 py-2 text-sm flex-1"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => removeVariantRow(i)}
//                                             className="text-red-600 text-sm px-2"
//                                         >
//                                             ✕
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                             <button
//                                 type="button"
//                                 onClick={addVariantRow}
//                                 className="text-sm text-primary-600 font-medium"
//                             >
//                                 + Add another variant
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={submitting}
//                     className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-lg"
//                 >
//                     {submitting ? 'Submitting...' : 'Submit for Review'}
//                 </button>
//             </form>
//         </div>
//     )
// }


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { uploadProductImages } from '@/lib/uploads'
import { createProduct } from '@/lib/products'
import { ApiError } from '@/lib/api'

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface VariantRow {
    sku: string
    color: string
    size: string
    price: string
    stock: string
}

function slugPart(text: string) {
    return text.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function NewProductPage() {
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [basePrice, setBasePrice] = useState('')
    const [hasVariants, setHasVariants] = useState(false)

    // Colors are added as tags, sizes are picked from a fixed list — this
    // avoids the old free-text fields where two sellers (or the same
    // seller twice) could type "Small" vs "small" vs "S" and end up with
    // variants that don't group together on the product page.
    const [colorInput, setColorInput] = useState('')
    const [colors, setColors] = useState<string[]>([])
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [variants, setVariants] = useState<VariantRow[]>([])

    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFilesSelected = (selected: FileList | null) => {
        if (!selected) return
        const list = Array.from(selected).slice(0, 6)
        setFiles(list)
        setPreviews(list.map(f => URL.createObjectURL(f)))
    }

    const addColor = () => {
        const value = colorInput.trim()
        if (!value) return
        if (!colors.some(c => c.toLowerCase() === value.toLowerCase())) {
            setColors(prev => [...prev, value])
        }
        setColorInput('')
    }

    const removeColor = (color: string) => {
        setColors(prev => prev.filter(c => c !== color))
    }

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        )
    }

    // Builds one row per color × size combination (or just per color, or
    // just per size, if only one dimension is used). Existing rows for
    // combinations that still exist keep their price/stock — only new
    // combinations get blank fields, so re-clicking "Generate" after
    // adding one more size doesn't wipe out what was already entered.
    const generateVariants = () => {
        const combos: { color: string; size: string }[] = []

        if (colors.length > 0 && selectedSizes.length > 0) {
            for (const color of colors) {
                for (const size of selectedSizes) combos.push({ color, size })
            }
        } else if (colors.length > 0) {
            for (const color of colors) combos.push({ color, size: '' })
        } else if (selectedSizes.length > 0) {
            for (const size of selectedSizes) combos.push({ color: '', size })
        }

        setVariants(prev =>
            combos.map(combo => {
                const existing = prev.find(v => v.color === combo.color && v.size === combo.size)
                if (existing) return existing
                const skuParts = [slugPart(title || 'ITEM'), slugPart(combo.color), slugPart(combo.size)].filter(Boolean)
                return {
                    sku: skuParts.join('-'),
                    color: combo.color,
                    size: combo.size,
                    price: basePrice,
                    stock: '',
                }
            })
        )
    }

    const updateVariant = (index: number, field: 'price' | 'stock' | 'sku', value: string) => {
        setVariants(prev => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)))
    }

    const removeVariant = (index: number) => {
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
        if (hasVariants && variants.length === 0) {
            setError('Add at least one color or size, then click "Generate Variants".')
            return
        }
        if (hasVariants && variants.some(v => !v.sku || !v.price || v.stock === '')) {
            setError('Every variant needs a SKU, price, and stock quantity.')
            return
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

            router.push('/sell/products?submitted=1')
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
                New listings go to an admin for review before they appear in the shop.
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
                        className="w-full border border-neutral-300 text-neutral-950 rounded-lg px-4 py-2.5"
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
                        className="w-full border border-neutral-300 text-neutral-950 rounded-lg px-4 py-2.5"
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
                            className="w-full border border-neutral-300 text-neutral-950 rounded-lg px-4 py-2.5"
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
                            className="w-full border border-neutral-300 text-neutral-950 rounded-lg px-4 py-2.5"
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
                        className="block text-neutral-950"
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
                            onChange={e => {
                                setHasVariants(e.target.checked)
                                if (!e.target.checked) setVariants([])
                            }}
                        />
                        This product comes in different colors or sizes
                    </label>

                    {hasVariants && (
                        <div className="space-y-5 bg-neutral-50 rounded-lg p-4">
                            {/* Colors */}
                            <div>
                                <p className="text-sm font-medium text-neutral-700 mb-2">Colors</p>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        value={colorInput}
                                        onChange={e => setColorInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' || e.key === ',') {
                                                e.preventDefault()
                                                addColor()
                                            }
                                        }}
                                        placeholder="Type a color and press Enter (e.g. Red)"
                                        className="flex-1 border border-neutral-300 text-neutral-950 rounded-lg px-3 py-2 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={addColor}
                                        className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg"
                                    >
                                        Add
                                    </button>
                                </div>
                                {colors.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map(color => (
                                            <span
                                                key={color}
                                                className="flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-300 rounded-full text-sm"
                                            >
                                                {color}
                                                <button type="button" onClick={() => removeColor(color)}>
                                                    <X className="w-3 h-3 text-neutral-500" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Sizes — fixed list so everyone uses the same values */}
                            <div>
                                <p className="text-sm font-medium text-neutral-700 mb-2">Sizes</p>
                                <div className="flex flex-wrap gap-2">
                                    {SIZE_OPTIONS.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => toggleSize(size)}
                                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                selectedSizes.includes(size)
                                                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                    : 'border-neutral-300 text-neutral-950'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={generateVariants}
                                disabled={colors.length === 0 && selectedSizes.length === 0}
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white text-sm font-semibold rounded-lg"
                            >
                                Generate Variants
                            </button>

                            {/* Generated rows — price/stock/SKU editable, one row per combo */}
                            {variants.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-neutral-200">
                                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-neutral-950 px-1">
                                        <span className="col-span-4">Variant</span>
                                        <span className="col-span-3">SKU</span>
                                        <span className="col-span-2">Price</span>
                                        <span className="col-span-2">Stock</span>
                                    </div>
                                    {variants.map((v, i) => (
                                        <div key={`${v.color}-${v.size}`} className="grid grid-cols-12 gap-2 items-center">
                                            <span className="col-span-4 text-sm text-neutral-700">
                                                {[v.color, v.size].filter(Boolean).join(' / ') || '—'}
                                            </span>
                                            <input
                                                value={v.sku}
                                                onChange={e => updateVariant(i, 'sku', e.target.value)}
                                                className="col-span-3 border border-neutral-300 text-neutral-950 rounded-lg px-2 py-1.5 text-sm"
                                            />
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={v.price}
                                                onChange={e => updateVariant(i, 'price', e.target.value)}
                                                className="col-span-2 border border-neutral-300 text-neutral-950 rounded-lg px-2 py-1.5 text-sm"
                                            />
                                            <input
                                                type="number"
                                                value={v.stock}
                                                onChange={e => updateVariant(i, 'stock', e.target.value)}
                                                placeholder="Qty"
                                                className="col-span-2 border border-neutral-300 text-neutral-950 rounded-lg px-2 py-1.5 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(i)}
                                                className="col-span-1 text-red-500 text-sm"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
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