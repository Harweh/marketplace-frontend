'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { resetPassword } from '@/lib/passwordReset'
import { ApiError } from '@/lib/api'

export default function ResetPasswordPage() {
    const params = useParams()
    const router = useRouter()
    const token = params.token as string

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [done, setDone] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setSubmitting(true)
        try {
            await resetPassword(token, newPassword)
            setDone(true)
            setTimeout(() => router.push('/login'), 1500)
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
                    {done ? (
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5">
                                <CheckCircle className="w-7 h-7 text-green-600" />
                            </div>
                            <h1 className="text-xl font-bold text-neutral-900 mb-2">Password updated</h1>
                            <p className="text-neutral-500 text-sm">Redirecting you to login...</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-neutral-900 text-center mb-1">Set a new password</h1>
                            <p className="text-neutral-500 text-center text-sm mb-7">Make it something you&apos;ll remember.</p>

                            {error && (
                                <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative text-black">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-900" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        placeholder="New password"
                                        className="w-full pl-11 pr-11 py-3  bg-neutral-50 border border-neutral-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-900 hover:text-neutral-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                <div className="relative text-black">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-6900" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        placeholder="Confirm new password"
                                        className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-colors"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                                >
                                    {submitting ? 'Saving...' : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}