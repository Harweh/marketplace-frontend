// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { ArrowLeft, Mail, Phone, Calendar, MapPin, Store, Package } from 'lucide-react'
// import { useAuthStore } from '@/store/auth'
// import { getUserDetail, updateUserRole, UserDetail } from '@/lib/admin'

// const ROLES = ['buyer', 'seller', 'admin', 'super_admin', 'support']

// const VENDOR_STATUS_STYLES: Record<string, string> = {
//     pending: 'bg-orange-100 text-orange-700',
//     approved: 'bg-green-100 text-green-700',
//     suspended: 'bg-neutral-200 text-neutral-600',
//     rejected: 'bg-red-100 text-red-700',
// }

// export default function AdminUserDetailPage() {
//     const params = useParams()
//     const router = useRouter()
//     const id = params.id as string

//     const currentUser = useAuthStore(state => state.user)
//     const isSuperAdmin = currentUser?.role === 'super_admin'

//     const [detail, setDetail] = useState<UserDetail | null>(null)
//     const [loading, setLoading] = useState(true)
//     const [savingRole, setSavingRole] = useState(false)

//     useEffect(() => {
//         getUserDetail(id).then(setDetail).finally(() => setLoading(false))
//     }, [id])

//     const handleRoleChange = async (role: string) => {
//         setSavingRole(true)
//         try {
//             const updated = await updateUserRole(id, role)
//             setDetail(prev => (prev ? { ...prev, user: { ...prev.user, role: updated.role } } : prev))
//         } finally {
//             setSavingRole(false)
//         }
//     }

//     if (loading) {
//         return <p className="text-neutral-500">Loading...</p>
//     }
//     if (!detail) {
//         return <p className="text-neutral-500">User not found.</p>
//     }

//     const { user, vendor, orderCount } = detail
//     const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

//     return (
//         <div>
//             <button
//                 onClick={() => router.back()}
//                 className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6"
//             >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back to Users
//             </button>

//             {/* Header */}
//             <div className="flex items-center gap-4 mb-8">
//                 <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
//                     {initials}
//                 </div>
//                 <div className="flex-1">
//                     <h1 className="text-2xl font-bold text-neutral-900">{user.name}</h1>
//                     <p className="text-neutral-500 text-sm">{user.email}</p>
//                 </div>
//                 {isSuperAdmin ? (
//                     <select
//                         value={user.role}
//                         disabled={savingRole || user._id === currentUser?.id}
//                         onChange={e => handleRoleChange(e.target.value)}
//                         className="text-sm border border-neutral-300 rounded-lg px-3 py-2 capitalize"
//                     >
//                         {ROLES.map(r => (
//                             <option key={r} value={r}>{r.replace('_', ' ')}</option>
//                         ))}
//                     </select>
//                 ) : (
//                     <span className="text-sm px-3 py-2 rounded-full bg-neutral-100 text-neutral-600 capitalize">
//                         {user.role.replace('_', ' ')}
//                     </span>
//                 )}
//             </div>

//             {/* Profile info */}
//             <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
//                 <h2 className="font-semibold text-neutral-900 mb-4">Profile</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
//                     <div className="flex items-center gap-2 text-neutral-600">
//                         <Mail className="w-4 h-4 text-neutral-400" />
//                         {user.email}
//                     </div>
//                     <div className="flex items-center gap-2 text-neutral-600">
//                         <Phone className="w-4 h-4 text-neutral-400" />
//                         {user.phone || 'Not provided'}
//                     </div>
//                     <div className="flex items-center gap-2 text-neutral-600">
//                         <Calendar className="w-4 h-4 text-neutral-400" />
//                         Joined {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
//                     </div>
//                 </div>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
//                 <div className="bg-white rounded-2xl border border-neutral-200 p-5">
//                     <Package className="w-5 h-5 text-neutral-400 mb-2" />
//                     <p className="text-2xl font-bold text-neutral-900">{orderCount}</p>
//                     <p className="text-sm text-neutral-500">Orders Placed</p>
//                 </div>
//                 <div className="bg-white rounded-2xl border border-neutral-200 p-5">
//                     <MapPin className="w-5 h-5 text-neutral-400 mb-2" />
//                     <p className="text-2xl font-bold text-neutral-900">{user.addresses?.length ?? 0}</p>
//                     <p className="text-sm text-neutral-500">Saved Addresses</p>
//                 </div>
//                 {vendor && (
//                     <div className="bg-white rounded-2xl border border-neutral-200 p-5">
//                         <Store className="w-5 h-5 text-neutral-400 mb-2" />
//                         <p className="text-2xl font-bold text-neutral-900 capitalize">{vendor.status}</p>
//                         <p className="text-sm text-neutral-500">Vendor Status</p>
//                     </div>
//                 )}
//             </div>

//             {/* Vendor / store info */}
//             {vendor && (
//                 <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
//                     <div className="flex items-center justify-between mb-4">
//                         <h2 className="font-semibold text-neutral-900">Vendor Store</h2>
//                         <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${VENDOR_STATUS_STYLES[vendor.status]}`}>
//                             {vendor.status}
//                         </span>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                             <p className="text-neutral-400">Store Name</p>
//                             <p className="text-neutral-900 font-medium">{vendor.storeName}</p>
//                         </div>
//                         <div>
//                             <p className="text-neutral-400">Store Slug</p>
//                             <p className="text-neutral-900 font-medium">{vendor.storeSlug}</p>
//                         </div>
//                         <div>
//                             <p className="text-neutral-400">Commission Rate</p>
//                             <p className="text-neutral-900 font-medium">{vendor.commissionRate}%</p>
//                         </div>
//                         <div>
//                             <p className="text-neutral-400">Applied On</p>
//                             <p className="text-neutral-900 font-medium">
//                                 {new Date(vendor.createdAt).toLocaleDateString()}
//                             </p>
//                         </div>
//                     </div>
//                     <Link
//                         href="/admin/vendors"
//                         className="inline-block mt-4 text-sm text-primary-600 font-medium"
//                     >
//                         Manage in Vendors →
//                     </Link>
//                 </div>
//             )}

//             {/* Addresses */}
//             <div className="bg-white rounded-2xl border border-neutral-200 p-6">
//                 <h2 className="font-semibold text-neutral-900 mb-4">Saved Addresses</h2>
//                 {(!user.addresses || user.addresses.length === 0) && (
//                     <p className="text-sm text-neutral-500">No saved addresses.</p>
//                 )}
//                 <div className="grid sm:grid-cols-2 gap-4">
//                     {(user.addresses ?? []).map(addr => (
//                         <div key={addr._id} className="border border-neutral-200 rounded-xl p-4">
//                             <p className="font-medium text-neutral-900 text-sm mb-1">
//                                 {addr.label}
//                                 {addr.isDefault && (
//                                     <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Default</span>
//                                 )}
//                             </p>
//                             <p className="text-sm text-neutral-500">{addr.line1}, {addr.city}, {addr.state}</p>
//                             {addr.phone && <p className="text-sm text-neutral-400">{addr.phone}</p>}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }


'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Store, Package } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { getUserDetail, updateUserRole, UserDetail } from '@/lib/admin'

const ROLES = ['buyer', 'seller', 'admin', 'super_admin', 'support']

const VENDOR_STATUS_STYLES: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-700',
    approved: 'bg-green-100 text-green-700',
    suspended: 'bg-neutral-200 text-neutral-600',
    rejected: 'bg-red-100 text-red-700',
}

export default function AdminUserDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const currentUser = useAuthStore(state => state.user)
    const isSuperAdmin = currentUser?.role === 'super_admin'

    const [detail, setDetail] = useState<UserDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [savingRole, setSavingRole] = useState(false)

    useEffect(() => {
        getUserDetail(id).then(setDetail).finally(() => setLoading(false))
    }, [id])

    const handleRoleChange = async (role: string) => {
        setSavingRole(true)
        try {
            const updated = await updateUserRole(id, role)
            setDetail(prev => (prev ? { ...prev, user: { ...prev.user, role: updated.role } } : prev))
        } finally {
            setSavingRole(false)
        }
    }

    if (loading) {
        return <p className="text-neutral-500">Loading...</p>
    }
    if (!detail) {
        return <p className="text-neutral-500">User not found.</p>
    }

    const { user, vendor, orderCount } = detail
    const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

    return (
        <div>
            <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Users
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {initials}
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-neutral-900">{user.name}</h1>
                    <p className="text-neutral-500 text-sm">{user.email}</p>
                </div>
                {isSuperAdmin ? (
                    <select
                        value={user.role}
                        disabled={savingRole || user._id === currentUser?.id}
                        onChange={e => handleRoleChange(e.target.value)}
                        className="text-sm border border-neutral-300 rounded-lg px-3 py-2 capitalize"
                    >
                        {ROLES.map(r => (
                            <option key={r} value={r}>{r.replace('_', ' ')}</option>
                        ))}
                    </select>
                ) : (
                    <span className="text-sm px-3 py-2 rounded-full bg-neutral-100 text-neutral-600 capitalize">
                        {user.role.replace('_', ' ')}
                    </span>
                )}
            </div>

            {/* Profile info */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Profile</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-neutral-600">
                        <Mail className="w-4 h-4 text-neutral-400" />
                        {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                        <Phone className="w-4 h-4 text-neutral-400" />
                        {user.phone || 'Not provided'}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        Joined {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                    <Package className="w-5 h-5 text-neutral-400 mb-2" />
                    <p className="text-2xl font-bold text-neutral-900">{orderCount}</p>
                    <p className="text-sm text-neutral-500">{vendor ? 'Orders Placed (as Buyer)' : 'Orders Placed'}</p>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                    <MapPin className="w-5 h-5 text-neutral-400 mb-2" />
                    <p className="text-2xl font-bold text-neutral-900">{user.addresses?.length ?? 0}</p>
                    <p className="text-sm text-neutral-500">Saved Addresses</p>
                </div>
                {vendor && (
                    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                        <Store className="w-5 h-5 text-neutral-400 mb-2" />
                        <p className="text-2xl font-bold text-neutral-900 capitalize">{vendor.status}</p>
                        <p className="text-sm text-neutral-500">Vendor Status</p>
                    </div>
                )}
            </div>

            {/* Vendor / store info */}
            {vendor && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-neutral-900">Vendor Store</h2>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${VENDOR_STATUS_STYLES[vendor.status]}`}>
                            {vendor.status}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-neutral-400">Store Name</p>
                            <p className="text-neutral-900 font-medium">{vendor.storeName}</p>
                        </div>
                        <div>
                            <p className="text-neutral-400">Store Slug</p>
                            <p className="text-neutral-900 font-medium">{vendor.storeSlug}</p>
                        </div>
                        <div>
                            <p className="text-neutral-400">Commission Rate</p>
                            <p className="text-neutral-900 font-medium">{vendor.commissionRate}%</p>
                        </div>
                        <div>
                            <p className="text-neutral-400">Applied On</p>
                            <p className="text-neutral-900 font-medium">
                                {new Date(vendor.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/vendors"
                        className="inline-block mt-4 text-sm text-primary-600 font-medium"
                    >
                        Manage in Vendors →
                    </Link>
                </div>
            )}

            {/* Addresses */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">Saved Addresses</h2>
                {(!user.addresses || user.addresses.length === 0) && (
                    <p className="text-sm text-neutral-500">No saved addresses.</p>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                    {(user.addresses ?? []).map(addr => (
                        <div key={addr._id} className="border border-neutral-200 rounded-xl p-4">
                            <p className="font-medium text-neutral-900 text-sm mb-1">
                                {addr.label}
                                {addr.isDefault && (
                                    <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Default</span>
                                )}
                            </p>
                            <p className="text-sm text-neutral-500">{addr.line1}, {addr.city}, {addr.state}</p>
                            {addr.phone && <p className="text-sm text-neutral-400">{addr.phone}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}