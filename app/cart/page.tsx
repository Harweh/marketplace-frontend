'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Truck } from 'lucide-react'
import { useCartStore } from '@/store/Cart'

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()

    const subtotal = getTotalPrice()
    const freeShippingThreshold = 100
    const shipping = subtotal > freeShippingThreshold || subtotal === 0 ? 0 : 10
    const tax = subtotal * 0.1
    const total = subtotal + shipping + tax

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 pt-36 md:pt-40">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                        <ShoppingBag className="w-9 h-9 text-neutral-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h1>
                    <p className="text-neutral-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-40 pb-10">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                </Link>

                <div className="flex items-baseline justify-between mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Your Cart</h1>
                    <span className="text-sm text-neutral-500">{items.length} item{items.length === 1 ? '' : 's'}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Items */}
                    <div className="lg:col-span-2 divide-y divide-neutral-200 bg-white rounded-2xl border border-neutral-200">
                        {items.map((item) => {
                            const variant = item.product.variants?.find(v => v.sku === item.selectedSku)
                            const unitPrice = variant?.price ?? item.product.basePrice
                            const image = item.product.images?.[0]

                            return (
                                <div key={`${item.product._id}-${item.selectedSku ?? ''}`} className="p-5 flex gap-4">
                                    <Link
                                        href={`/product/${item.product.slug}`}
                                        className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100"
                                    >
                                        {image && (
                                            <Image src={image} alt={item.product.title} fill className="object-cover" />
                                        )}
                                    </Link>

                                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div className="min-w-0">
                                            <Link
                                                href={`/product/${item.product.slug}`}
                                                className="font-semibold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-1"
                                            >
                                                {item.product.title}
                                            </Link>
                                            {variant && Object.entries(variant.attributes).length > 0 && (
                                                <p className="text-sm text-neutral-500 mt-1 capitalize">
                                                    {Object.entries(variant.attributes)
                                                        .map(([key, value]) => `${key}: ${value}`)
                                                        .join(' · ')}
                                                </p>
                                            )}
                                            <p className="text-sm text-neutral-400 mt-1">${unitPrice.toFixed(2)} each</p>
                                        </div>

                                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
                                            <p className="font-bold text-neutral-900">${(unitPrice * item.quantity).toFixed(2)}</p>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-neutral-200 rounded-full">
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.selectedSku)}
                                                        className="p-2 hover:bg-neutral-50 rounded-l-full transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="w-3.5 h-3.5 text-neutral-600" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium text-neutral-800">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.selectedSku)}
                                                        className="p-2 hover:bg-neutral-50 rounded-r-full transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="w-3.5 h-3.5 text-neutral-600" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.product._id, item.selectedSku)}
                                                    className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        <div className="p-5">
                            <button
                                onClick={clearCart}
                                className="text-sm text-neutral-400 hover:text-red-600 transition-colors font-medium"
                            >
                                Clear cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-24">
                            <h2 className="font-semibold text-lg text-neutral-900 mb-5">Order Summary</h2>

                            <div className="space-y-3 mb-5 text-sm">
                                <div className="flex justify-between text-neutral-500">
                                    <span>Subtotal</span>
                                    <span className="text-neutral-900 font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-500">
                                    <span>Shipping</span>
                                    <span className="text-neutral-900 font-medium">
                                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-neutral-500">
                                    <span>Tax (10%)</span>
                                    <span className="text-neutral-900 font-medium">${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-neutral-200 pt-3 flex justify-between">
                                    <span className="font-semibold text-neutral-900">Total</span>
                                    <span className="font-bold text-neutral-900 text-lg">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {subtotal > 0 && subtotal < freeShippingThreshold && (
                                <div className="mb-5 p-3 bg-primary-50 rounded-xl text-sm text-primary-800 flex items-start gap-2">
                                    <Truck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Add <span className="font-semibold">${(freeShippingThreshold - subtotal).toFixed(2)}</span> more for free shipping
                                    </span>
                                </div>
                            )}

                            <Link
                                href="/checkout"
                                className="block w-full text-center px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full transition-colors mb-3"
                            >
                                Proceed to Checkout
                            </Link>

                            <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 mt-4">
                                <ShieldCheck className="w-4 h-4" />
                                Secure checkout via Paystack
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}