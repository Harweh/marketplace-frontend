'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Wishlist now lives inside the account hub, alongside profile, addresses,
// and order history — this route just forwards anyone with the old link.
export default function WishlistRedirect() {
    const router = useRouter()
    useEffect(() => {
        router.replace('/account?tab=wishlist')
    }, [router])
    return null
}