'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Store, ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { ApiError } from '@/lib/api'

type LoginAs = 'user' | 'seller' | 'admin'

const OPTIONS: { key: LoginAs; label: string; icon: typeof User; subtitle: string }[] = [
    { key: 'user', label: 'User', icon: User, subtitle: 'Log in to continue shopping' },
    { key: 'seller', label: 'Seller', icon: Store, subtitle: 'Log in to continue selling' },
    { key: 'admin', label: 'Admin', icon: ShieldCheck, subtitle: 'Log in to do your job' },
]

export default function LoginPage() {
    const router = useRouter()
    const login = useAuthStore(state => state.login)

    const [loginAs, setLoginAs] = useState<LoginAs>('user')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const activeOption = OPTIONS.find(o => o.key === loginAs)!

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await login(email, password)
            const role = useAuthStore.getState().user?.role

            if (loginAs === 'admin') {
                if (role === 'admin' || role === 'super_admin') {
                    router.push('/admin')
                } else {
                    setError("This account doesn't have admin access.")
                    setSubmitting(false)
                    return
                }
            } else if (loginAs === 'seller') {
                if (role === 'seller' || role === 'admin' || role === 'super_admin') {
                    router.push('/sell')
                } else {
                    router.push('/sell/apply')
                }
            } else {
                router.push('/')
            }
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.')
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 pt-32 pb-10">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 sm:p-10">
                    {/* Brand mark */}
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">E</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-neutral-900 text-center mb-1">Welcome back</h1>
                    <p className="text-neutral-500 text-center text-sm mb-7">{activeOption.subtitle}</p>

                    {/* Role selector — segmented control */}
                    <div className="flex bg-neutral-100 rounded-xl p-1 mb-6">
                        {OPTIONS.map(opt => {
                            const Icon = opt.icon
                            const active = loginAs === opt.key
                            return (
                                <button
                                    key={opt.key}
                                    type="button"
                                    onClick={() => setLoginAs(opt.key)}
                                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                                        active
                                            ? 'bg-white text-neutral-900 shadow-sm'
                                            : 'text-neutral-500 hover:text-neutral-700'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {opt.label}
                                </button>
                            )
                        })}
                    </div>

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

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                className="w-full pl-11 pr-11 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-sm text-neutral-500 hover:text-neutral-900 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                        >
                            {submitting ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-neutral-500 mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-neutral-900 font-semibold">Sign up</Link>
                </p>
            </div>
        </main>
    )
}
