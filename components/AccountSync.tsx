'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/Cart'
import { useWishlistStore } from '@/store/Wishlist'

// Mounted once, globally. When the user transitions from logged-out to
// logged-in (fresh login, or a page refresh where a token was already
// stored), pulls their saved cart/wishlist from the account and merges
// it with whatever this browser had locally as a guest.
export default function AccountSync() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const syncCart = useCartStore(state => state.syncFromServer)
    const syncWishlist = useWishlistStore(state => state.syncFromServer)
    const hasSynced = useRef(false)

    useEffect(() => {
        if (isAuthenticated && !hasSynced.current) {
            hasSynced.current = true
            syncCart()
            syncWishlist()
        }
        if (!isAuthenticated) {
            hasSynced.current = false
        }
    }, [isAuthenticated, syncCart, syncWishlist])

    return null
}