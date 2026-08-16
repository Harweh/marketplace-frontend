'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'

const NAV_ITEMS = [
    { name: 'Dashboard', href: '/sell' },
    { name: 'Products', href: '/sell/products' },
    { name: 'Orders', href: '/sell/orders' },
]

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { user, isAuthenticated, fetchMe, accessToken } = useAuthStore()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        const check = async () => {
            if (accessToken && !user) {
                try {
                    await fetchMe()
                } catch {
                    // fall through to redirect below
                }
            }
            setChecked(true)
        }
        check()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!checked) return
        if (!isAuthenticated) {
            router.replace('/login')
            return
        }
        // Buyers who haven't applied yet get sent to the apply page instead
        // of being locked out entirely.
        const allowedRoles = ['seller', 'admin', 'super_admin']
        if (user && !allowedRoles.includes(user.role)) {
            router.replace('/sell/apply')
        }
    }, [checked, isAuthenticated, user, router])

    if (!checked || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-500">Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 mt-35 flex">
            <aside className="w-56 bg-white border-r border-neutral-200 min-h-screen p-4">
                <h2 className="font-bold text-lg mb-6 text-neutral-900">Seller Hub</h2>
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
            <main className="flex-1 p-8">{children}</main>
        </div>
    )
}