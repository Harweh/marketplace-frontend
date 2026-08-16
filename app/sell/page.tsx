// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { getMyProducts, getMyOrders } from '@/lib/seller'
// import { Product } from '@/types'
// import { SellerOrder } from '@/lib/seller'

// export default function SellerDashboard() {
//     const [products, setProducts] = useState<Product[]>([])
//     const [orders, setOrders] = useState<SellerOrder[]>([])
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         Promise.all([getMyProducts(), getMyOrders()])
//             .then(([p, o]) => {
//                 setProducts(p)
//                 setOrders(o)
//             })
//             .finally(() => setLoading(false))
//     }, [])

//     const approved = products.filter(p => p.status === 'approved').length
//     const pending = products.filter(p => p.status === 'pending_review').length
//     const totalEarnings = orders.reduce((sum, o) => sum + (o.subOrder?.subtotal ?? 0), 0)

//     return (
//         <div>
//             <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Store</h1>

//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
//                 <div className="p-6 rounded-xl bg-neutral-900 text-white">
//                     <p className="text-sm text-neutral-300 mb-2">Total Earnings</p>
//                     <p className="text-2xl font-bold">{loading ? '…' : `$${totalEarnings.toFixed(2)}`}</p>
//                 </div>
//                 <Link href="/sell/products" className="p-6 rounded-xl bg-green-50 text-green-700">
//                     <p className="text-sm font-medium mb-2">Approved Products</p>
//                     <p className="text-2xl font-bold">{loading ? '…' : approved}</p>
//                 </Link>
//                 <Link href="/sell/products" className="p-6 rounded-xl bg-orange-50 text-orange-700">
//                     <p className="text-sm font-medium mb-2">Pending Review</p>
//                     <p className="text-2xl font-bold">{loading ? '…' : pending}</p>
//                 </Link>
//                 <Link href="/sell/orders" className="p-6 rounded-xl bg-blue-50 text-blue-700">
//                     <p className="text-sm font-medium mb-2">Total Orders</p>
//                     <p className="text-2xl font-bold">{loading ? '…' : orders.length}</p>
//                 </Link>
//             </div>

//             <Link
//                 href="/sell/products/new"
//                 className="inline-block px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg"
//             >
//                 + Add a Product
//             </Link>
//         </div>
//     )
// }


'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getMyProducts, getMyOrders, getMyVendorProfile } from '@/lib/seller'
import { Product } from '@/types'
import { SellerOrder } from '@/lib/seller'

export default function SellerDashboard() {
    const [products, setProducts] = useState<Product[]>([])
    const [orders, setOrders] = useState<SellerOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [hasVendorProfile, setHasVendorProfile] = useState(true)

    useEffect(() => {
        getMyVendorProfile().catch(() => setHasVendorProfile(false))
        getMyProducts().then(setProducts).catch(() => setProducts([]))
        getMyOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false))
    }, [])

    const approved = products.filter(p => p.status === 'approved').length
    const pending = products.filter(p => p.status === 'pending_review').length
    const totalEarnings = orders.reduce((sum, o) => sum + (o.subOrder?.subtotal ?? 0), 0)

    return (
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Store</h1>

            {!loading && !hasVendorProfile && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-800">
                    You don&apos;t have a seller profile yet.{' '}
                    <Link href="/sell/apply" className="font-semibold underline">Apply to become a seller</Link>{' '}
                    to start listing products.
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                <div className="p-6 rounded-xl bg-neutral-900 text-white">
                    <p className="text-sm text-neutral-300 mb-2">Total Earnings</p>
                    <p className="text-2xl font-bold">{loading ? '…' : `$${totalEarnings.toFixed(2)}`}</p>
                </div>
                <Link href="/sell/products" className="p-6 rounded-xl bg-green-50 text-green-700">
                    <p className="text-sm font-medium mb-2">Approved Products</p>
                    <p className="text-2xl font-bold">{loading ? '…' : approved}</p>
                </Link>
                <Link href="/sell/products" className="p-6 rounded-xl bg-orange-50 text-orange-700">
                    <p className="text-sm font-medium mb-2">Pending Review</p>
                    <p className="text-2xl font-bold">{loading ? '…' : pending}</p>
                </Link>
                <Link href="/sell/orders" className="p-6 rounded-xl bg-blue-50 text-blue-700">
                    <p className="text-sm font-medium mb-2">Total Orders</p>
                    <p className="text-2xl font-bold">{loading ? '…' : orders.length}</p>
                </Link>
            </div>

            {hasVendorProfile && (
                <Link
                    href="/sell/products/new"
                    className="inline-block px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg"
                >
                    + Add a Product
                </Link>
            )}
        </div>
    )
}