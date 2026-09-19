// 'use client'

// import { useEffect, useState } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { CheckCircle, XCircle } from 'lucide-react'
// import { verifyPayment } from '@/lib/checkout'
// import { useCartStore } from '@/store/Cart'
// import { ApiError } from '@/lib/api'

// export default function CheckoutCallbackPage() {
//     const searchParams = useSearchParams()
//     const router = useRouter()
//     const clearCart = useCartStore(state => state.clearCart)

//     const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking')
//     const [message, setMessage] = useState('')

//     useEffect(() => {
//         // Paystack appends ?reference=... (sometimes &trxref=...) to the
//         // callback URL when it redirects the buyer back.
//         const reference = searchParams.get('reference') || searchParams.get('trxref')

//         if (!reference) {
//             setStatus('failed')
//             setMessage('No payment reference found.')
//             return
//         }

//         verifyPayment(reference)
//             .then(() => {
//                 clearCart()
//                 setStatus('success')
//             })
//             .catch(err => {
//                 setStatus('failed')
//                 setMessage(err instanceof ApiError ? err.message : 'Could not verify payment.')
//             })
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])

//     return (
//         <div className="max-w-md mx-auto px-4 py-24 text-center">
//             {status === 'checking' && <p className="text-neutral-500">Confirming your payment...</p>}

//             {status === 'success' && (
//                 <>
//                     <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
//                     <h1 className="text-2xl font-bold text-neutral-900 mb-2">Payment Successful</h1>
//                     <p className="text-neutral-600 mb-6">Your order has been placed.</p>
//                     <Link href="/shop" className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg inline-block">
//                         Continue Shopping
//                     </Link>
//                 </>
//             )}

//             {status === 'failed' && (
//                 <>
//                     <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
//                     <h1 className="text-2xl font-bold text-neutral-900 mb-2">Payment Failed</h1>
//                     <p className="text-neutral-600 mb-6">{message}</p>
//                     <button
//                         onClick={() => router.push('/cart')}
//                         className="px-6 py-3 bg-neutral-900 text-white font-semibold rounded-lg"
//                     >
//                         Back to Cart
//                     </button>
//                 </>
//             )}
//         </div>
//     )
// }

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { verifyPayment } from '@/lib/checkout'
import { useCartStore } from '@/store/Cart'
import { ApiError } from '@/lib/api'

export default function CheckoutCallbackPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const clearCart = useCartStore(state => state.clearCart)

    const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const reference = searchParams.get('reference') || searchParams.get('trxref')

        if (!reference) {
            setStatus('failed')
            setMessage('No payment reference found.')
            return
        }

        verifyPayment(reference)
            .then(() => {
                clearCart()
                setStatus('success')
            })
            .catch(err => {
                setStatus('failed')
                setMessage(err instanceof ApiError ? err.message : 'Could not verify payment.')
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 pt-32 pb-10">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 sm:p-10 text-center">
                    {status === 'checking' && (
                        <>
                            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-5">
                                <Loader2 className="w-7 h-7 text-neutral-500 animate-spin" />
                            </div>
                            <h1 className="text-xl font-bold text-neutral-900 mb-2">Confirming your payment</h1>
                            <p className="text-neutral-500 text-sm">This will only take a moment...</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5">
                                <CheckCircle className="w-7 h-7 text-green-600" />
                            </div>
                            <h1 className="text-xl font-bold text-neutral-900 mb-2">Payment Successful</h1>
                            <p className="text-neutral-500 text-sm mb-7">
                                Your order has been placed. We&apos;ll notify you as it moves through fulfillment.
                            </p>
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/shop"
                                    className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                                <Link
                                    href="/account?tab=orders"
                                    className="w-full py-3.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-medium rounded-xl transition-colors"
                                >
                                    View Order
                                </Link>
                            </div>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                                <XCircle className="w-7 h-7 text-red-600" />
                            </div>
                            <h1 className="text-xl font-bold text-neutral-900 mb-2">Payment Failed</h1>
                            <p className="text-neutral-500 text-sm mb-7">{message}</p>
                            <button
                                onClick={() => router.push('/cart')}
                                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-colors"
                            >
                                Back to Cart
                            </button>
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}