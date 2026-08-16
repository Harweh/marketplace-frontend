// 'use client'

// import { useEffect, useState } from 'react'
// import { getMyOrders, SellerOrder } from '@/lib/seller'

// export default function SellerOrdersPage() {
//     const [orders, setOrders] = useState<SellerOrder[]>([])
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         getMyOrders().then(setOrders).finally(() => setLoading(false))
//     }, [])

//     return (
//         <div>
//             <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Orders</h1>

//             {loading && <p className="text-neutral-500">Loading...</p>}
//             {!loading && orders.length === 0 && <p className="text-neutral-500">No orders yet.</p>}

//             <div className="space-y-4">
//                 {orders.map(order => {
//                     const buyer = typeof order.buyer === 'string' ? null : order.buyer
//                     return (
//                         <div key={order._id} className="bg-white rounded-lg border border-neutral-200 p-4">
//                             <div className="flex justify-between items-start mb-3">
//                                 <div>
//                                     <p className="font-semibold text-neutral-900">#{order.orderNumber}</p>
//                                     <p className="text-sm text-neutral-500">
//                                         {buyer ? `${buyer.name} • ${buyer.email}` : 'Buyer info unavailable'}
//                                     </p>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="font-bold text-neutral-900">${order.subOrder.subtotal.toFixed(2)}</p>
//                                     <p className="text-xs text-neutral-500 capitalize">{order.subOrder.status.replace('_', ' ')}</p>
//                                 </div>
//                             </div>
//                             <div className="space-y-1">
//                                 {order.subOrder.items.map((item, i) => (
//                                     <p key={i} className="text-sm text-neutral-600">
//                                         {item.quantity}× {item.title} — ${item.price.toFixed(2)}
//                                     </p>
//                                 ))}
//                             </div>
//                         </div>
//                     )
//                 })}
//             </div>
//         </div>
//     )
// }




// 'use client'

// import { useEffect, useState } from 'react'
// import { getMyOrders, SellerOrder } from '@/lib/seller'

// export default function SellerOrdersPage() {
//     const [orders, setOrders] = useState<SellerOrder[]>([])
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         getMyOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false))
//     }, [])

//     return (
//         <div>
//             <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Orders</h1>

//             {loading && <p className="text-neutral-500">Loading...</p>}
//             {!loading && orders.length === 0 && <p className="text-neutral-500">No orders yet.</p>}

//             <div className="space-y-4">
//                 {orders.map(order => {
//                     const buyer = typeof order.buyer === 'string' ? null : order.buyer
//                     return (
//                         <div key={order._id} className="bg-white rounded-lg border border-neutral-200 p-4">
//                             <div className="flex justify-between items-start mb-3">
//                                 <div>
//                                     <p className="font-semibold text-neutral-900">#{order.orderNumber}</p>
//                                     <p className="text-sm text-neutral-500">
//                                         {buyer ? `${buyer.name} • ${buyer.email}` : 'Buyer info unavailable'}
//                                     </p>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="font-bold text-neutral-900">${order.subOrder.subtotal.toFixed(2)}</p>
//                                     <p className="text-xs text-neutral-500 capitalize">{order.subOrder.status.replace('_', ' ')}</p>
//                                 </div>
//                             </div>
//                             <div className="space-y-1">
//                                 {order.subOrder.items.map((item, i) => (
//                                     <p key={i} className="text-sm text-neutral-600">
//                                         {item.quantity}× {item.title} — ${item.price.toFixed(2)}
//                                     </p>
//                                 ))}
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
import { getMyOrders, SellerOrder } from '@/lib/seller'

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState<SellerOrder[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false))
    }, [])

    return (
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Orders</h1>

            {loading && <p className="text-neutral-500">Loading...</p>}
            {!loading && orders.length === 0 && <p className="text-neutral-500">No orders yet.</p>}

            <div className="space-y-4">
                {orders.map(order => {
                    const buyer = typeof order.buyer === 'string' ? null : order.buyer
                    return (
                        <div key={order._id} className="bg-white rounded-lg border border-neutral-200 p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-semibold text-neutral-900">#{order.orderNumber}</p>
                                    <p className="text-sm text-neutral-500">
                                        {buyer ? `${buyer.name} • ${buyer.email}` : 'Buyer info unavailable'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-neutral-900">${order.subOrder.subtotal.toFixed(2)}</p>
                                    <p className="text-xs text-neutral-500 capitalize">{order.subOrder.status.replace('_', ' ')}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                {order.subOrder.items.map((item, i) => (
                                    <p key={i} className="text-sm text-neutral-600">
                                        {item.quantity}× {item.title} — ${item.price.toFixed(2)}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}