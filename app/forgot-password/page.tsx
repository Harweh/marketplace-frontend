'use client'

import { useState } from 'react'
import Link from 'next/link'
import { forgotPassword } from '@/lib/passwordReset'
import { ApiError } from '@/lib/api'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await forgotPassword(email)
            setSent(true)
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Something went wrong.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="max-w-md mx-auto px-4 pt-36 md:pt-40 pb-20">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Forgot Password</h1>

            {sent ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                    If that email is registered, a reset link has been sent. Check your inbox.
                </div>
            ) : (
                <>
                    <p className="text-neutral-500 mb-6">Enter your email and we&apos;ll send you a reset link.</p>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold rounded-lg"
                        >
                            {submitting ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                </>
            )}

            <Link href="/login" className="block text-center text-sm text-primary-600 font-medium mt-6">
                Back to Login
            </Link>
        </main>
    )
}