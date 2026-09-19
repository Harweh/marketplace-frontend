'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
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
        <main className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 pt-32 pb-10">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 sm:p-10">
                    {sent ? (
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5">
                                <CheckCircle className="w-7 h-7 text-green-600" />
                            </div>
                            <h1 className="text-xl font-bold text-neutral-900 mb-2">Check your email</h1>
                            <p className="text-neutral-500 text-sm">
                                If <span className="font-medium text-neutral-700">{email}</span> is registered, a reset link is on its way.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-neutral-900 text-center mb-1">Forgot password?</h1>
                            <p className="text-neutral-500 text-center text-sm mb-7">
                                No worries — enter your email and we&apos;ll send you a reset link.
                            </p>

                            {error && (
                                <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        placeholder="Email address"
                                        className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-colors"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                                >
                                    {submitting ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <Link
                    href="/login"
                    className="flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 font-medium mt-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>
            </div>
        </main>
    )
}