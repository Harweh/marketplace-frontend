'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { resetPassword } from '@/lib/passwordReset'
import { ApiError } from '@/lib/api'

export default function ResetPasswordPage() {
    const params = useParams()
    const router = useRouter()
    const token = params.token as string

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
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
        <main className="max-w-md mx-auto px-4 pt-36 md:pt-40 pb-20">
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Set a New Password</h1>

            {done ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                    Password updated. Redirecting to login...
                </div>
            ) : (
                <>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="New password"
                            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="Confirm new password"
                            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold rounded-lg"
                        >
                            {submitting ? 'Saving...' : 'Reset Password'}
                        </button>
                    </form>
                </>
            )}
        </main>
    )
}