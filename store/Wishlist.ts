import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WishlistState } from '@/types'

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
        items: [],

        addItem: (product) => {
            const items = get().items
            if (!items.find(item => item.id === product.id)) {
            set({ items: [...items, product] })
            }
        },

        removeItem: (productId) => {
            set({ items: get().items.filter(item => item.id !== productId) })
        },

        isInWishlist: (productId) => {
            return get().items.some(item => item.id === productId)
        },
        }),
        {
        name: 'wishlist-storage',
        }
    )
)