'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'

const NAV_ITEMS = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Product Approvals', href: '/admin/products' },
    { name: 'Categories', href: '/admin/categories' },
    { name: 'Vendors', href: '/admin/vendors' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Stats', href: '/admin/stats' },
    { name: 'Users', href: '/admin/users' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { user, isAuthenticated, fetchMe, accessToken } = useAuthStore()
    const [checked, setChecked] = useState(false)

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