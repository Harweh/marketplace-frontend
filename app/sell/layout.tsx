// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { useAuthStore } from '@/store/auth'

// const NAV_ITEMS = [
//     { name: 'Dashboard', href: '/sell' },
//     { name: 'Products', href: '/sell/products' },
//     { name: 'Orders', href: '/sell/order' },
// ]

// export default function SellerLayout({ children }: { children: React.ReactNode }) {
//     const router = useRouter()
//     const { user, isAuthenticated, fetchMe, accessToken } = useAuthStore()
//     const [checked, setChecked] = useState(false)

//     useEffect(() => {
//         const check = async () => {
//             if (accessToken && !user) {
//                 try {
//                     await fetchMe()
//                 } catch {
//                     // fall through to redirect below
//                 }
//             }
//             setChecked(true)
//         }
//         check()
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])

//     useEffect(() => {
//         if (!checked) return
//         if (!isAuthenticated) {
//             router.replace('/login')
//             return
//         }
//         // Buyers who haven't applied yet get sent to the apply page instead
//         // of being locked out entirely.
//         const allowedRoles = ['seller', 'admin', 'super_admin']
//         if (user && !allowedRoles.includes(user.role)) {
//             router.replace('/sell/apply')
//         }
//     }, [checked, isAuthenticated, user, router])

//     if (!checked || !isAuthenticated) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <p className="text-neutral-500">Loading...</p>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-neutral-50 mt-35 flex">
//             <aside className="w-56 bg-white border-r border-neutral-200 min-h-screen p-4">
//                 <h2 className="font-bold text-lg mb-6 text-neutral-900">Seller Hub</h2>
//                 <nav className="flex flex-col gap-1">
//                     {NAV_ITEMS.map(item => (
//                         <Link
//                             key={item.href}
//                             href={item.href}
//                             className="px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100 font-medium"
//                         >
//                             {item.name}
//                         </Link>
//                     ))}
//                 </nav>
//             </aside>
//             <main className="flex-1 p-8">{children}</main>
//         </div>
//     )
// }


'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'

const NAV_ITEMS = [
    { name: 'Dashboard', href: '/sell' },
    { name: 'Products', href: '/sell/products' },
    { name: 'Orders', href: '/sell/order' },
    { name: 'Notifications', href: '/notifications' },
]

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { user, isAuthenticated, fetchMe, accessToken } = useAuthStore()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        const check = async () => {
            if (accessToken) {
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
        <div className="min-h-screen flex">
            <aside className="w-60 bg-neutral-900 min-h-screen p-4 pt-36 md:pt-40 flex-shrink-0">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">S</span>
                    </div>
                    <h2 className="font-bold text-white text-sm tracking-wide">SELLER HUB</h2>
                </div>
                <nav className="flex flex-col gap-0.5">
                    {NAV_ITEMS.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="px-3 py-2.5 rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 p-8 pt-36 md:pt-40 bg-neutral-50">{children}</main>
        </div>
    )
}