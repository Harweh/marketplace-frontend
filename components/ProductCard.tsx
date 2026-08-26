'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/Cart'
import { useWishlistStore } from '@/store/Wishlist'

interface ProductCardProps {
    product: Product
    priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [showAddedToCart, setShowAddedToCart] = useState(false)

    const addToCart = useCartStore(state => state.addItem)
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
    const inWishlist = isInWishlist(product._id)

    // Colors, if this product has variants with a "color" attribute.
    const colors = Array.from(
        new Set(product.variants.map(v => v.attributes.color).filter(Boolean))
    ) as string[]

    const defaultSku = product.hasVariants ? product.variants[0]?.sku : undefined

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        addToCart(product, 1, defaultSku)
        setShowAddedToCart(true)
        setTimeout(() => setShowAddedToCart(false), 2000)
    }

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        if (inWishlist) {
            removeFromWishlist(product._id)
        } else {
            addToWishlist(product)
        }
    }

    return (
        <div
            className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/product/${product.slug}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    <Image
                        src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-cover transition-all duration-500 ${
                            isHovered ? 'scale-110' : 'scale-100'
                        } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        priority={priority}
                    />

                    {!imageLoaded && <div className="absolute inset-0 skeleton" />}

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button
                            onClick={handleToggleWishlist}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                                inWishlist
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white/50 text-neutral-700 hover:bg-primary-600 hover:text-gray-500 cursor-pointer'
                            } ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Add to Cart Button - Appears on Hover */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.totalStock === 0}
                        className={`absolute bottom-0 left-0 right-0 bg-primary-600 text-neutral-900 py-3 font-semibold transition-all duration-300 hover:bg-primary-700 disabled:opacity-50 ${
                            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                        }`}
                    >
                        <ShoppingBag className="w-5 h-5 text-neutral-900 inline mr-2" />
                        {product.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>

                    {showAddedToCart && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 animate-fade-in">
                            <div className="bg-white px-6 py-3 rounded-lg shadow-lg">
                                <p className="text-neutral-900 font-semibold">Added to cart!</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {product.title}
                    </h3>

                    {product.reviewCount > 0 && (
                        <div className="flex items-center gap-1.5 mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${
                                            i < Math.round(product.ratingAverage)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-neutral-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-neutral-500">({product.reviewCount})</span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-neutral-900">
                            ₦{product.basePrice.toFixed(2)}
                        </span>
                    </div>

                    {/* Colors */}
                    {colors.length > 0 && (
                        <div className="flex gap-1 mt-2">
                            {colors.slice(0, 4).map((color, index) => (
                                <div
                                    key={index}
                                    className="w-6 h-6 rounded-xl lg:rounded-lg border-2 border-neutral-400"
                                    style={{
                                        backgroundColor:
                                            color.toLowerCase() === 'white' ? '#ffffff' :
                                            color.toLowerCase() === 'black' ? '#000000' :
                                            color.toLowerCase() === 'brown' ? '#8B4513' :
                                            color.toLowerCase() === 'blue' ? '#3B82F6' :
                                            color.toLowerCase() === 'navy' ? '#000080' :
                                            color.toLowerCase()
                                    }}
                                    title={color}
                                />
                            ))}
                            {colors.length > 4 && (
                                <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs text-neutral-600">
                                    +{colors.length - 4}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        </div>
    )
}