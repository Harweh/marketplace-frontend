'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { authedFetch } from '@/lib/authedApi'
import { ApiError } from '@/lib/api'

const NAV_ITEMS = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Product Approvals', href: '/admin/products' },
    { name: 'Add Product', href: '/admin/products/new' },
    { name: 'Categories', href: '/admin/categories' },
    { name: 'Vendors', href: '/admin/vendors' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Users', href: '/admin/users' },
]

const REAUTH_KEY = 'admin-reauth-verified'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { user, isAuthenticated, fetchMe, accessToken } = useAuthStore()
    const [checked, setChecked] = useState(false)
    const [reauthed, setReauthed] = useState(false)
    const [password, setPassword] = useState('')
    const [reauthError, setReauthError] = useState<string | null>(null)
    const [verifying, setVerifying] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined' && sessionStorage.getItem(REAUTH_KEY) === '1') {
            setReauthed(true)
        }
    }, [])

    const handleReauth = async (e: React.FormEvent) => {
        e.preventDefault()
        setReauthError(null)
        setVerifying(true)
        try {
            await authedFetch('/auth/verify-password', { method: 'POST', body: { password } })
            sessionStorage.setItem(REAUTH_KEY, '1')
            setReauthed(true)
        } catch (err) {
            setReauthError(err instanceof ApiError ? err.message : 'Could not verify password.')
        } finally {
            setVerifying(false)
        }
    }

    useEffect(() => {
        // If we have a token but no user loaded yet (e.g. page refresh),
        // fetch the current user before deciding whether to allow access.
        const check = async () => {
            if (accessToken && !user) {
                try {
                    await fetchMe()
                } catch {
                    // token invalid/expired — fetchMe failing just means we fall
                    // through to the redirect below
                }
            }
            setChecked(true)
        }
        check()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!checked) return
        const allowed = isAuthenticated && (user?.role === 'admin' || user?.role === 'super_admin')
        if (!allowed) {
            router.replace('/login')
        }
    }, [checked, isAuthenticated, user, router])

    if (!checked) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500">Loading...</p>
            </div>
        )
    }

    const allowed = isAuthenticated && (user?.role === 'admin' || user?.role === 'super_admin')
    if (!allowed) {
        return null
    }

    // Extra confirmation step for the highest-privilege role, once per
    // browser session — protects against someone using an unattended,
    // already-logged-in browser to reach super_admin actions.
    if (user?.role === 'super_admin' && !reauthed) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <form onSubmit={handleReauth} className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl p-6">
                    <h2 className="font-bold text-lg text-neutral-900 mb-1">Confirm it&apos;s you</h2>
                    <p className="text-sm text-neutral-500 mb-5">
                        Re-enter your password to access the admin area.
                    </p>
                    {reauthError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {reauthError}
                        </div>
                    )}
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoFocus
                        placeholder="Password"
                        className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 text-sm mb-4"
                    />
                    <button
                        type="submit"
                        disabled={verifying}
                        className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
                    >
                        {verifying ? 'Verifying...' : 'Continue'}
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex">
            <aside className="w-56 bg-white border-r border-neutral-200 min-h-screen p-4 pt-36 md:pt-40">
                <h2 className="font-bold text-lg mb-6 text-neutral-900">Admin</h2>
                <nav className="flex flex-col gap-1">
                    {NAV_ITEMS.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100 font-medium"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 p-8 pt-36 md:pt-40">{children}</main>
        </div>
    )
}