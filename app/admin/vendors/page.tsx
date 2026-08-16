// 'use client'

// import { useEffect, useState } from 'react'
// import { getVendors, moderateVendor, Vendor } from '@/lib/admin'

// export default function AdminVendorsPage() {
//     const [vendors, setVendors] = useState<Vendor[]>([])
//     const [loading, setLoading] = useState(true)
//     const [busyId, setBusyId] = useState<string | null>(null)
//     const [filter, setFilter] = useState('pending')

//     const load = (status: string) => {
//         setLoading(true)
//         getVendors(status === 'all' ? undefined : status)
//             .then(setVendors)
//             .finally(() => setLoading(false))
//     }

//     useEffect(() => { load(filter) }, [filter])

//     const handleAction = async (id: string, action: 'approve' | 'reject' | 'suspend') => {
//         setBusyId(id)
//         try {
//             await moderateVendor(id, action)
//             setVendors(prev => prev.filter(v => v._id !== id))
//         } finally {
//             setBusyId(null)
//         }
//     }

//     return (
//         <div>
//             <h1 className="text-2xl font-bold text-neutral-900 mb-6">Vendor Applications</h1>

//             <div className="flex gap-2 mb-6">
//                 {['pending', 'approved', 'suspended', 'rejected', 'all'].map(s => (
//                     <button
//                         key={s}
//                         onClick={() => setFilter(s)}
//                         className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${
//                             filter === s ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
//                         }`}
//                     >
//                         {s}
//                     </button>
//                 ))}
//             </div>

//             {loading && <p className="text-neutral-500">Loading...</p>}
//             {!loading && vendors.length === 0 && (
//                 <p className="text-neutral-500">No vendors in this category.</p>
//             )}

//             <div className="space-y-4 ">
//                 {vendors.map(vendor => {
//                     const owner = typeof vendor.user === 'string' ? null : vendor.user
//                     return (
//                         <div
//                             key={vendor._id}
//                             className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center gap-4"
//                         >
//                             <div className="flex-1">
//                                 <p className="font-semibold text-neutral-900">{vendor.storeName}</p>
//                                 <p className="text-sm text-neutral-500">
//                                     {owner ? `${owner.name} • ${owner.email}` : 'Owner info unavailable'}
//                                 </p>
//                                 {vendor.description && (
//                                     <p className="text-sm text-neutral-600 mt-1">{vendor.description}</p>
//                                 )}
//                             </div>
//                             <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-600 capitalize">
//                                 {vendor.status}
//                             </span>
//                             <div className="flex gap-2">
//                                 {vendor.status !== 'approved' && (
//                                     <button
//                                         onClick={() => handleAction(vendor._id, 'approve')}
//                                         disabled={busyId === vendor._id}
//                                         className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
//                                     >
//                                         Approve
//                                     </button>
//                                 )}
//                                 {vendor.status === 'approved' ? (
//                                     <button
//                                         onClick={() => handleAction(vendor._id, 'suspend')}
//                                         disabled={busyId === vendor._id}
//                                         className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
//                                     >
//                                         Suspend
//                                     </button>
//                                 ) : (
//                                     <button
//                                         onClick={() => handleAction(vendor._id, 'reject')}
//                                         disabled={busyId === vendor._id}
//                                         className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
//                                     >
//                                         Reject
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     )
//                 })}
//             </div>
//         </div>
//     )
// }


'use client'

import { useEffect, useState } from 'react'
import { getVendors, moderateVendor, Vendor } from '@/lib/admin'

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-700',
    approved: 'bg-green-100 text-green-700',
    suspended: 'bg-neutral-200 text-neutral-600',
    rejected: 'bg-red-100 text-red-700',
}

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [loading, setLoading] = useState(true)
    const [busyId, setBusyId] = useState<string | null>(null)
    const [filter, setFilter] = useState('pending')

    const load = (status: string) => {
        setLoading(true)
        getVendors(status === 'all' ? undefined : status)
            .then(setVendors)
            .finally(() => setLoading(false))
    }

    useEffect(() => { load(filter) }, [filter])

    const handleAction = async (id: string, action: 'approve' | 'reject' | 'suspend') => {
        setBusyId(id)
        try {
            const updated = await moderateVendor(id, action)
            // Keep it in the list with its new status (so the admin sees
            // the result) rather than yanking it away instantly — but drop
            // it if it no longer matches the active filter.
            setVendors(prev =>
                prev.map(v => (v._id === id ? updated : v)).filter(v => filter === 'all' || v.status === filter)
            )
        } finally {
            setBusyId(null)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Vendor Applications</h1>

            <div className="flex gap-2 mb-6">
                {['pending', 'approved', 'suspended', 'rejected', 'all'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${
                            filter === s ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {loading && <p className="text-neutral-500">Loading...</p>}
            {!loading && vendors.length === 0 && (
                <p className="text-neutral-500">No vendors in this category.</p>
            )}

            <div className="space-y-4">
                {vendors.map(vendor => {
                    const owner = typeof vendor.user === 'string' ? null : vendor.user
                    return (
                        <div
                            key={vendor._id}
                            className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center gap-4"
                        >
                            <div className="flex-1">
                                <p className="font-semibold text-neutral-900">{vendor.storeName}</p>
                                <p className="text-sm text-neutral-500">
                                    {owner ? `${owner.name} • ${owner.email}` : 'Owner info unavailable'}
                                </p>
                                {vendor.description && (
                                    <p className="text-sm text-neutral-600 mt-1">{vendor.description}</p>
                                )}
                                <p className="text-xs text-neutral-400 mt-1">
                                    Joined {new Date(vendor.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_STYLES[vendor.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                                {vendor.status}
                            </span>

                            {/* Actions reflect a real state machine — no button
                                lets you redundantly repeat the current state. */}
                            <div className="flex gap-2">
                                {vendor.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleAction(vendor._id, 'approve')}
                                            disabled={busyId === vendor._id}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(vendor._id, 'reject')}
                                            disabled={busyId === vendor._id}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                {vendor.status === 'approved' && (
                                    <button
                                        onClick={() => handleAction(vendor._id, 'suspend')}
                                        disabled={busyId === vendor._id}
                                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
                                    >
                                        Suspend
                                    </button>
                                )}
                                {vendor.status === 'suspended' && (
                                    <button
                                        onClick={() => handleAction(vendor._id, 'approve')}
                                        disabled={busyId === vendor._id}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
                                    >
                                        Reinstate
                                    </button>
                                )}
                                {vendor.status === 'rejected' && (
                                    <button
                                        onClick={() => handleAction(vendor._id, 'approve')}
                                        disabled={busyId === vendor._id}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
                                    >
                                        Approve Anyway
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}