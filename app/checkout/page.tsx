// 'use client'

// import Link from 'next/link'
// import { ArrowLeft, Construction } from 'lucide-react'
// import { useCartStore } from '@/store/Cart'

// export default function CheckoutPage() {
//     const { items, getTotalPrice } = useCartStore()
//     const subtotal = getTotalPrice()

//     return (
//         <div className="min-h-screen bg-neutral-50">
//             <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
//                 <Link
//                     href="/cart"
//                     className="inline-flex items-center text-neutral-700 hover:text-primary-600 font-medium mb-8"
//                 >
//                     <ArrowLeft className="w-5 h-5 mr-2" />
//                     Back to Cart
//                 </Link>

//                 <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//                     <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <Construction className="w-8 h-8 text-primary-600" />
//                     </div>
//                     <h1 className="font-display text-2xl font-bold text-neutral-900 mb-2">
//                         Checkout is coming soon
//                     </h1>
//                     <p className="text-neutral-600 mb-6">
//                         Payment integration isn&apos;t wired up yet. Here&apos;s a summary of what&apos;s
//                         in your cart in the meantime.
//                     </p>

//                     {items.length === 0 ? (
//                         <p className="text-neutral-500">Your cart is empty.</p>
//                     ) : (
//                         <div className="text-left border-t border-neutral-200 pt-6 space-y-3">
//                             {items.map(item => (
//                                 <div
//                                     key={`${item.product.id}-${item.selectedColor ?? ''}-${item.selectedSize ?? ''}`}
//                                     className="flex justify-between text-sm text-neutral-700"
//                                 >
//                                     <span>{item.product.name} × {item.quantity}</span>
//                                     <span>${(item.product.price * item.quantity).toFixed(2)}</span>
//                                 </div>
//                             ))}
//                             <div className="flex justify-between font-bold text-neutral-900 border-t border-neutral-200 pt-3">
//                                 <span>Subtotal</span>
//                                 <span>${subtotal.toFixed(2)}</span>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </main>
//         </div>
//     )
// }






// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useCartStore } from '@/store/Cart'
// import { useAuthStore } from '@/store/auth'
// import { startCheckout } from '@/lib/checkout'
// import { ApiError } from '@/lib/api'

// export default function CheckoutPage() {
//     const router = useRouter()
//     const { items, getTotalPrice } = useCartStore()
//     const isAuthenticated = useAuthStore(state => state.isAuthenticated)

//     const [line1, setLine1] = useState('')
//     const [city, setCity] = useState('')
//     const [state, setState] = useState('')
//     const [phone, setPhone] = useState('')
//     const [submitting, setSubmitting] = useState(false)
//     const [error, setError] = useState<string | null>(null)

//     if (!isAuthenticated) {
//         return (
//             <div className="max-w-md mx-auto px-4 py-20 mt-150 text-center">
//                 <p className="text-neutral-600 mb-4">Please log in to check out.</p>
//                 <button
//                     onClick={() => router.push('/login')}
//                     className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg"
//                 >
//                     Log In
//                 </button>
//             </div>
//         )
//     }

//     if (items.length === 0) {
//         return (
//             <div className="max-w-md mx-auto px-4 py-20 mt-150 text-center">
//                 <p className="text-neutral-600">Your cart is empty.</p>
//             </div>
//         )
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         setError(null)
//         setSubmitting(true)
//         try {
//             const checkoutItems = items.map(item => ({
//                 productId: item.product._id,
//                 sku: item.selectedSku,
//                 quantity: item.quantity,
//             }))

//             const res = await startCheckout(checkoutItems, { line1, city, state, phone })

//             // Remember the reference so the callback page knows which
//             // order to verify once Paystack redirects back.
//             sessionStorage.setItem('pendingOrderRef', res.order.orderNumber)

//             // Send the buyer to Paystack to actually pay.
//             window.location.href = res.authorizationUrl
//         } catch (err) {
//             setError(err instanceof ApiError ? err.message : 'Checkout failed. Please try again.')
//             setSubmitting(false)
//         }
//     }

//     return (
//         <div className="max-w-xl mx-auto px-4 py-12">
//             <h1 className="text-2xl font-bold text-neutral-900 mb-6">Checkout</h1>

//             <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
//                 <h2 className="font-semibold text-neutral-900 mb-3">Order Summary</h2>
//                 {items.map((item, i) => {
//                     const variant = item.selectedSku
//                         ? item.product.variants.find(v => v.sku === item.selectedSku)
//                         : undefined
//                     const unitPrice = variant ? variant.price : item.product.basePrice
//                     return (
//                         <div key={i} className="flex justify-between text-sm text-neutral-600 mb-1">
//                             <span>{item.quantity}× {item.product.title}</span>
//                             <span>${(unitPrice * item.quantity).toFixed(2)}</span>
//                         </div>
//                     )
//                 })}
//                 <div className="flex justify-between font-bold text-neutral-900 pt-3 mt-3 border-t border-neutral-200">
//                     <span>Total</span>
//                     <span>${getTotalPrice().toFixed(2)}</span>
//                 </div>
//             </div>

//             {error && (
//                 <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
//                     {error}
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label className="block font-medium text-neutral-800 mb-2">Address</label>
//                     <input
//                         value={line1}
//                         onChange={e => setLine1(e.target.value)}
//                         required
//                         className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
//                         placeholder="Street address"
//                     />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                     <input
//                         value={city}
//                         onChange={e => setCity(e.target.value)}
//                         required
//                         className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
//                         placeholder="City"
//                     />
//                     <input
//                         value={state}
//                         onChange={e => setState(e.target.value)}
//                         required
//                         className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
//                         placeholder="State"
//                     />
//                 </div>
//                 <input
//                     value={phone}
//                     onChange={e => setPhone(e.target.value)}
//                     required
//                     className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
//                     placeholder="Phone number"
//                 />

//                 <button
//                     type="submit"
//                     disabled={submitting}
//                     className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-lg"
//                 >
//                     {submitting ? 'Redirecting to payment...' : 'Proceed to Payment'}
//                 </button>
//             </form>
//         </div>
//     )
// }





'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/Cart'
import { useAuthStore } from '@/store/auth'
import { startCheckout } from '@/lib/checkout'
import { ApiError } from '@/lib/api'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotalPrice } = useCartStore()
    const { isAuthenticated, user } = useAuthStore()

    const savedAddresses = user?.addresses ?? []
    const defaultAddress = savedAddresses.find(a => a.isDefault) ?? savedAddresses[0]

    const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress?._id ?? 'new')
    const [line1, setLine1] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [phone, setPhone] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <p className="text-neutral-600 mb-4">Please log in to check out.</p>
                <button
                    onClick={() => router.push('/login')}
                    className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg"
                >
                    Log In
                </button>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
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
        <div className="max-w-xl mx-auto px-4 py-12">
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Checkout</h1>

            <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
                <h2 className="font-semibold text-neutral-900 mb-3">Order Summary</h2>
                {items.map((item, i) => {
                    const variant = item.selectedSku
                        ? item.product.variants.find(v => v.sku === item.selectedSku)
                        : undefined
                    const unitPrice = variant ? variant.price : item.product.basePrice
                    return (
                        <div key={i} className="flex justify-between text-sm text-neutral-600 mb-1">
                            <span>{item.quantity}× {item.product.title}</span>
                            <span>${(unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                    )
                })}
                <div className="flex justify-between font-bold text-neutral-900 pt-3 mt-3 border-t border-neutral-200">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium text-neutral-800 mb-2">Delivery Address</label>
                    <div className="space-y-2">
                        {savedAddresses.map(addr => (
                            <label
                                key={addr._id}
                                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer ${
                                    selectedAddressId === addr._id ? 'border-primary-600 bg-primary-50' : 'border-neutral-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    checked={selectedAddressId === addr._id}
                                    onChange={() => setSelectedAddressId(addr._id)}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="font-medium text-neutral-900">{addr.label}</p>
                                    <p className="text-sm text-neutral-600">{addr.line1}, {addr.city}, {addr.state}</p>
                                    {addr.phone && <p className="text-sm text-neutral-500">{addr.phone}</p>}
                                </div>
                            </label>
                        ))}
                        <label
                            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer ${
                                selectedAddressId === 'new' ? 'border-primary-600 bg-primary-50' : 'border-neutral-300'
                            }`}
                        >
                            <input
                                type="radio"
                                checked={selectedAddressId === 'new'}
                                onChange={() => setSelectedAddressId('new')}
                                className="mt-1"
                            />
                            <p className="font-medium text-neutral-900">Use a different address</p>
                        </label>
                    </div>
                </div>

                {selectedAddressId === 'new' && (
                    <div className="space-y-4 border-t border-neutral-200 pt-4">
                        <input
                            value={line1}
                            onChange={e => setLine1(e.target.value)}
                            required
                            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                            placeholder="Street address"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                required
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                                placeholder="City"
                            />
                            <input
                                value={state}
                                onChange={e => setState(e.target.value)}
                                required
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                                placeholder="State"
                            />
                        </div>
                        <input
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                            placeholder="Phone number for delivery"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-lg"
                >
                    {submitting ? 'Redirecting to payment...' : 'Proceed to Payment'}
                </button>
            </form>
        </div>
    )
}