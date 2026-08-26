'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Truck, Shield, ArrowLeft, Check, Star, Trash2 } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { getProductBySlug, getProducts } from '@/lib/products'
import { getReviews, createReview, deleteReview, getReviewEligibility, Review } from '@/lib/reviews'
import { useCartStore } from '@/store/Cart'
import { useWishlistStore } from '@/store/Wishlist'
import { useAuthStore } from '@/store/auth'
import { ApiError } from '@/lib/api'
import { Product } from '@/types'

export default function ProductDetailPage() {
    const params = useParams()
    const slug = params.slug as string

    const [product, setProduct] = useState<Product | null>(null)
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [notFound, setNotFound] = useState(false)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSku, setSelectedSku] = useState<string | undefined>(undefined)
    const [quantity, setQuantity] = useState(1)
    const [showAddedToCart, setShowAddedToCart] = useState(false)

    const addToCart = useCartStore(state => state.addItem)
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
    const inWishlist = product ? isInWishlist(product._id) : false
    const currentUser = useAuthStore(state => state.user)

    const [reviews, setReviews] = useState<Review[]>([])
    const [reviewsLoaded, setReviewsLoaded] = useState(false)
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewComment, setReviewComment] = useState('')
    const [submittingReview, setSubmittingReview] = useState(false)
    const [reviewError, setReviewError] = useState<string | null>(null)
    const [reviewEligible, setReviewEligible] = useState(false)

    useEffect(() => {
        setProduct(null)
        setNotFound(false)
        setSelectedImage(0)
        setQuantity(1)
        setReviews([])
        setReviewsLoaded(false)

        getProductBySlug(slug)
        .then(p => {
            setProduct(p)
            setSelectedSku(p.hasVariants ? p.variants[0]?.sku : undefined)
            getReviews(p._id).then(setReviews).finally(() => setReviewsLoaded(true))
            if (currentUser) {
                getReviewEligibility(p._id)
                    .then(res => setReviewEligible(res.eligible))
                    .catch(() => setReviewEligible(false))
            }
            return getProducts({ category: p.category, limit: 5 })
        })
        .then(result => {
            setRelatedProducts(result.products.filter(p => p.slug !== slug).slice(0, 4))
        })
        .catch(() => setNotFound(true))
    }, [slug])

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!product) return
        setReviewError(null)
        setSubmittingReview(true)
        try {
            const review = await createReview(product._id, reviewRating, reviewComment)
            setReviews(prev => [review, ...prev])
            setReviewComment('')
            setReviewRating(5)
            const refreshed = await getProductBySlug(slug)
            setProduct(refreshed)
        } catch (err) {
            setReviewError(err instanceof ApiError ? err.message : 'Could not submit review.')
        } finally {
            setSubmittingReview(false)
        }
    }

    const handleDeleteReview = async (reviewId: string) => {
        if (!product) return
        await deleteReview(product._id, reviewId)
        setReviews(prev => prev.filter(r => r._id !== reviewId))
        const refreshed = await getProductBySlug(slug)
        setProduct(refreshed)
    }

    const myReview = reviews.find(r => {
        const buyerId = typeof r.buyer === 'string' ? r.buyer : r.buyer._id
        return buyerId === currentUser?.id
    })

    const selectedVariant = product?.variants.find(v => v.sku === selectedSku)
    const displayPrice = selectedVariant ? selectedVariant.price : product?.basePrice ?? 0
    const availableStock = selectedVariant ? selectedVariant.stock : product?.totalStock ?? 0

    // Group variant attribute keys (e.g. "color", "size") so each can be
    // rendered as its own selector row.
    const attributeKeys = product
        ? Array.from(new Set(product.variants.flatMap(v => Object.keys(v.attributes))))
        : []

    const handleAddToCart = () => {
        if (!product) return
        addToCart(product, quantity, selectedSku)
        setShowAddedToCart(true)
        setTimeout(() => setShowAddedToCart(false), 2000)
    }

    if (notFound) {
        return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-40 pb-20 text-center">
            <h1 className="font-display text-black text-3xl font-bold mb-4">Product Not Found</h1>
            <Link
                href="/shop"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Shop
            </Link>
            </main>
        </div>
        )
    }

    if (!product) {
        return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-40 pb-20 text-center">
            <p className="text-neutral-500">Loading...</p>
            </main>
        </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-40 pb-8">
                <Link
                    href="/shop"
                    className="inline-flex items-center text-neutral-700 hover:text-primary-600 font-medium mb-8"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Shop
                </Link>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Images */}
                    <div>
                        <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4">
                            <Image
                                src={product.images[selectedImage] ?? product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img, i) => (
                                    <button
                                        key={img + i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                            selectedImage === i ? 'border-primary-600' : 'border-transparent'
                                        }`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <h1 className="font-display text-3xl font-bold text-neutral-900 mb-2">
                            {product.title}
                        </h1>

                        {product.reviewCount > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < Math.round(product.ratingAverage)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-neutral-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-neutral-500">
                                    {product.ratingAverage.toFixed(1)} ({product.reviewCount} review{product.reviewCount === 1 ? '' : 's'})
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl font-bold text-neutral-900">
                                ₦{displayPrice.toFixed(2)}
                            </span>
                            {availableStock === 0 ? (
                                <span className="text-red-600 text-sm font-medium">Out of stock</span>
                            ) : availableStock <= 3 ? (
                                <span className="text-red-600 text-sm font-medium">Only a few left</span>
                            ) : availableStock <= 10 ? (
                                <span className="text-orange-600 text-sm font-medium">Low stock</span>
                            ) : null}
                        </div>

                        <p className="text-neutral-600 mb-6 leading-relaxed">{product.description}</p>

                        {/* Variant selectors */}
                        {attributeKeys.map(key => {
                            const values = Array.from(
                                new Set(product.variants.map(v => v.attributes[key]).filter(Boolean))
                            )
                            return (
                                <div key={key} className="mb-6">
                                    <h4 className="font-medium text-neutral-800 mb-2 capitalize">{key}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {values.map(value => {
                                            // Pick the first variant matching this value for this
                                            // attribute (and matching already-selected other
                                            // attributes, where possible) when the user clicks it.
                                            const matchingVariant = product.variants.find(v =>
                                                v.attributes[key] === value
                                            )
                                            const isSoldOut = !matchingVariant || matchingVariant.stock === 0
                                            const isSelected = selectedVariant?.attributes[key] === value
                                            return (
                                                <button
                                                    key={value}
                                                    onClick={() => !isSoldOut && matchingVariant && setSelectedSku(matchingVariant.sku)}
                                                    disabled={isSoldOut}
                                                    title={isSoldOut ? `${value} is sold out` : undefined}
                                                    className={`relative px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                        isSoldOut
                                                            ? 'border-neutral-200 text-neutral-400 cursor-not-allowed line-through decoration-neutral-400'
                                                            : isSelected
                                                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                            : 'border-neutral-300 text-neutral-700 hover:border-neutral-400'
                                                    }`}
                                                >
                                                    {value}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Quantity */}
                        <div className="mb-6">
                            <h4 className="font-medium text-neutral-800 mb-2">Quantity</h4>
                            <div className="flex items-center border border-neutral-300 rounded-lg w-fit">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-4 py-2 hover:bg-neutral-100"
                                >
                                    −
                                </button>
                                <span className="px-4 py-2 font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => Math.min(availableStock || 1, q + 1))}
                                    className="px-4 py-2 hover:bg-neutral-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={availableStock === 0}
                                className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                            >
                                {showAddedToCart ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                                {showAddedToCart ? 'Added!' : 'Add to Cart'}
                            </button>
                            <button
                                onClick={() => inWishlist ? removeFromWishlist(product._id) : addToWishlist(product)}
                                className={`w-14 flex items-center justify-center rounded-lg border-2 transition-colors ${
                                    inWishlist ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-neutral-300 text-neutral-600'
                                }`}
                            >
                                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        <div className="border-t border-neutral-200 pt-6 space-y-3 text-sm text-neutral-600">
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                Shipping calculated by distance at checkout
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Secure checkout
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-16 border-t border-neutral-200 pt-10">
                    <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">
                        Reviews {product.reviewCount > 0 && `(${product.reviewCount})`}
                    </h2>

                    {currentUser && reviewEligible && !myReview && (
                        <form onSubmit={handleSubmitReview} className="bg-white border border-neutral-200 rounded-xl p-5 mb-6 max-w-lg">
                            {reviewError && (
                                <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                    {reviewError}
                                </div>
                            )}
                            <p className="text-sm font-medium text-neutral-700 mb-2">Your Rating</p>
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setReviewRating(n)}
                                    >
                                        <Star
                                            className={`w-6 h-6 ${
                                                n <= reviewRating ? 'text-yellow-400 fill-current' : 'text-neutral-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={reviewComment}
                                onChange={e => setReviewComment(e.target.value)}
                                required
                                minLength={3}
                                rows={3}
                                placeholder="Share your thoughts on this product..."
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm mb-3"
                            />
                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
                            >
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    {reviewsLoaded && reviews.length === 0 && (
                        <p className="text-neutral-500 text-sm mb-6">No reviews yet. Be the first to share your thoughts.</p>
                    )}

                    <div className="space-y-5 max-w-2xl">
                        {reviews.map(review => {
                            const buyer = typeof review.buyer === 'string' ? null : review.buyer
                            const isMine = buyer?._id === currentUser?.id
                            return (
                                <div key={review._id} className="border-b border-neutral-100 pb-5">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3.5 h-3.5 ${
                                                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-medium text-neutral-900">
                                                {buyer?.name ?? 'Anonymous'}
                                            </span>
                                        </div>
                                        {isMine && (
                                            <button
                                                onClick={() => handleDeleteReview(review._id)}
                                                className="text-neutral-400 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-neutral-600">{review.comment}</p>
                                    <p className="text-xs text-neutral-400 mt-1">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">
                            You might also like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}