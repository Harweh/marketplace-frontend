'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, MapPin, Plus } from 'lucide-react'
import { useCartStore } from '@/store/Cart'
import { useAuthStore } from '@/store/auth'
import { startCheckout, previewCheckout, CheckoutPreview } from '@/lib/checkout'
import { ApiError } from '@/lib/api'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotalPrice } = useCartStore()
    const { isAuthenticated, user } = useAuthStore()

    const savedAddresses = user?.addresses ?? []
    const defaultAddress = savedAddresses.find(a => a.isDefault) ?? savedAddresses[0]

    const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress?._id ?? 'new')
    const [showNewAddressForm, setShowNewAddressForm] = useState(savedAddresses.length === 0)
    const [line1, setLine1] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [phone, setPhone] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const subtotal = getTotalPrice()

    // Real, distance-based shipping — fetched from the backend once a
    // usable address exists, instead of a guessed flat rate.
    const [preview, setPreview] = useState<CheckoutPreview | null>(null)
    const [previewLoading, setPreviewLoading] = useState(false)
    const [previewError, setPreviewError] = useState<string | null>(null)

    const currentAddress = selectedAddressId === 'new'
        ? (line1 && city && state ? { line1, city, state, phone } : null)
        : (() => {
            const addr = savedAddresses.find(a => a._id === selectedAddressId)
            return addr ? { line1: addr.line1, city: addr.city, state: addr.state, phone: addr.phone || phone } : null
        })()

    const fetchPreview = useCallback(async () => {
        if (!currentAddress || items.length === 0) {
            setPreview(null)
            return
        }
        setPreviewLoading(true)
        setPreviewError(null)
        try {
            const checkoutItems = items.map(item => ({
                productId: item.product._id,
                sku: item.selectedSku,
                quantity: item.quantity,
            }))
            const result = await previewCheckout(checkoutItems, currentAddress)
            setPreview(result)
        } catch (err) {
            setPreview(null)
            setPreviewError(err instanceof ApiError ? err.message : 'Could not calculate shipping for that address.')
        } finally {
            setPreviewLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAddressId, line1, city, state, phone])

    useEffect(() => {
        const timeout = setTimeout(fetchPreview, 500) // debounce while typing a new address
        return () => clearTimeout(timeout)
    }, [fetchPreview])

    const total = preview ? preview.total : subtotal

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 pt-36 md:pt-40">
                <div className="text-center max-w-sm">
                    <p className="text-neutral-600 mb-5">Please log in to check out.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full transition-colors"
                    >
                        Log In
                    </button>
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 pt-36 md:pt-40">
                <p className="text-neutral-600">Your cart is empty.</p>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const shippingAddress =
            selectedAddressId === 'new'
                ? { line1, city, state, phone }
                : (() => {
                    const addr = savedAddresses.find(a => a._id === selectedAddressId)
                    if (!addr) return null
                    return { line1: addr.line1, city: addr.city, state: addr.state, phone: addr.phone || phone }
                })()

        if (!shippingAddress || !shippingAddress.line1 || !shippingAddress.phone) {
            setError('Please provide a complete shipping address and phone number.')
            return
        }

        setSubmitting(true)
        try {
            const checkoutItems = items.map(item => ({
                productId: item.product._id,
                sku: item.selectedSku,
                quantity: item.quantity,
            }))

            const res = await startCheckout(checkoutItems, shippingAddress)
            sessionStorage.setItem('pendingOrderRef', res.order.orderNumber)
            window.location.href = res.authorizationUrl
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Checkout failed. Please try again.')
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-40 pb-16">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: address + submit */}
                    <div className="lg:col-span-2">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <MapPin className="w-4 h-4 text-neutral-400" />
                                    <h2 className="font-semibold text-neutral-900">Delivery Address</h2>
                                </div>

                                <div className="space-y-3">
                                    {savedAddresses.map(addr => (
                                        <label
                                            key={addr._id}
                                            className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                                                selectedAddressId === addr._id
                                                    ? 'border-neutral-900 bg-neutral-50'
                                                    : 'border-neutral-200 hover:border-neutral-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                checked={selectedAddressId === addr._id}
                                                onChange={() => { setSelectedAddressId(addr._id); setShowNewAddressForm(false) }}
                                                className="mt-1"
                                            />
                                            <div>
                                                <p className="font-medium text-neutral-900 text-sm">
                                                    {addr.label}
                                                    {addr.isDefault && (
                                                        <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Default</span>
                                                    )}
                                                </p>
                                                <p className="text-sm text-neutral-500 mt-0.5">{addr.line1}, {addr.city}, {addr.state}</p>
                                                {addr.phone && <p className="text-sm text-neutral-400">{addr.phone}</p>}
                                            </div>
                                        </label>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => { setSelectedAddressId('new'); setShowNewAddressForm(true) }}
                                        className={`flex items-center gap-2 w-full p-4 border rounded-xl text-sm font-medium transition-colors ${
                                            selectedAddressId === 'new'
                                                ? 'border-neutral-900 bg-neutral-50 text-neutral-900'
                                                : 'border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-400'
                                        }`}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Use a different address
                                    </button>
                                </div>

                                {showNewAddressForm && selectedAddressId === 'new' && (
                                    <div className="space-y-3 mt-5 pt-5 border-t border-neutral-100">
                                        <input
                                            value={line1}
                                            onChange={e => setLine1(e.target.value)}
                                            required
                                            className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm"
                                            placeholder="Street address"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                value={city}
                                                onChange={e => setCity(e.target.value)}
                                                required
                                                className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm"
                                                placeholder="City"
                                            />
                                            <input
                                                value={state}
                                                onChange={e => setState(e.target.value)}
                                                required
                                                className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm"
                                                placeholder="State"
                                            />
                                        </div>
                                        <input
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            required
                                            className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm"
                                            placeholder="Phone number for delivery"
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="hidden lg:block w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold rounded-full transition-colors"
                            >
                                {submitting ? 'Redirecting to payment...' : `Pay ₦${total.toFixed(2)}`}
                            </button>
                        </form>
                    </div>

                    {/* Right: order summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-24">
                            <h2 className="font-semibold text-neutral-900 mb-5">Order Summary</h2>

                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                                {items.map((item, i) => {
                                    const variant = item.selectedSku
                                        ? item.product.variants.find(v => v.sku === item.selectedSku)
                                        : undefined
                                    const unitPrice = variant ? variant.price : item.product.basePrice
                                    return (
                                        <div key={i} className="flex gap-3">
                                            <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                                                {item.product.images?.[0] && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                                                )}
                                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-neutral-900 text-white text-[10px] font-semibold rounded-full">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-neutral-800 line-clamp-1">{item.product.title}</p>
                                                <p className="text-xs text-neutral-400">₦{unitPrice.toFixed(2)} each</p>
                                            </div>
                                            <p className="text-sm font-medium text-neutral-900">₦{(unitPrice * item.quantity).toFixed(2)}</p>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="space-y-2.5 text-sm border-t border-neutral-100 pt-4 mb-4">
                                <div className="flex justify-between text-neutral-500">
                                    <span>Subtotal</span>
                                    <span className="text-neutral-900 font-medium">₦{subtotal.toFixed(2)}</span>
                                </div>

                                {!currentAddress && (
                                    <p className="text-xs text-neutral-400">Select or enter an address to calculate shipping.</p>
                                )}
                                {previewLoading && (
                                    <p className="text-xs text-neutral-400">Calculating shipping...</p>
                                )}
                                {previewError && (
                                    <p className="text-xs text-red-500">{previewError}</p>
                                )}

                                {preview && preview.vendors.map((v, i) => (
                                    <div key={i} className="flex justify-between text-neutral-500">
                                        <span>Shipping — {v.vendorName}</span>
                                        <span className="text-neutral-900 font-medium">
                                            {v.shippingFee === 0 ? 'Free' : `₦${v.shippingFee.toFixed(2)}`}
                                        </span>
                                    </div>
                                ))}

                                <div className="border-t border-neutral-100 pt-3 flex justify-between">
                                    <span className="font-semibold text-neutral-900">Total</span>
                                    <span className="font-bold text-neutral-900 text-lg">₦{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="lg:hidden w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold rounded-full transition-colors mb-4"
                            >
                                {submitting ? 'Redirecting to payment...' : `Pay ₦${total.toFixed(2)}`}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                                <ShieldCheck className="w-4 h-4" />
                                Secure checkout via Paystack
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}