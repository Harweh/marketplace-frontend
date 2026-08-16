'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'
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
        // Paystack appends ?reference=... (sometimes &trxref=...) to the
        // callback URL when it redirects the buyer back.
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
        <div className="max-w-md mx-auto px-4 py-24 text-center">
            {status === 'checking' && <p className="text-neutral-500">Confirming your payment...</p>}

            {status === 'success' && (
                <>
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">Payment Successful</h1>
                    <p className="text-neutral-600 mb-6">Your order has been placed.</p>
                    <Link href="/shop" className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg inline-block">
                        Continue Shopping
                    </Link>
                </>
            )}

            {status === 'failed' && (
                <>
                    <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">Payment Failed</h1>
                    <p className="text-neutral-600 mb-6">{message}</p>
                    <button
                        onClick={() => router.push('/cart')}
                        className="px-6 py-3 bg-neutral-900 text-white font-semibold rounded-lg"
                    >
                        Back to Cart
                    </button>
                </>
            )}
        </div>
    )
}