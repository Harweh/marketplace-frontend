import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WishlistState } from '@/types'
import { useAuthStore } from './auth'
import { getServerWishlist, syncServerWishlist } from '@/lib/cartSync'

function pushToServer(items: { _id: string }[]) {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) return
    syncServerWishlist(items.map(i => i._id)).catch(() => {
        // Non-fatal — local state is still correct, next mutation will retry.
    })
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
        items: [],

        addItem: (product) => {
            const items = get().items
            if (!items.find(item => item._id === product._id)) {
            const newItems = [...items, product]
            set({ items: newItems })
            pushToServer(newItems)
            }
        },

        removeItem: (productId) => {
            const newItems = get().items.filter(item => item._id !== productId)
            set({ items: newItems })
            pushToServer(newItems)
        },

        isInWishlist: (productId) => {
            return get().items.some(item => item._id === productId)
        },

        // Called once after login: pulls the account's saved wishlist and
        // merges it with anything saved locally as a guest, so nothing
        // gets silently lost either way.
        syncFromServer: async () => {
            const localItems = get().items
            let serverItems: typeof localItems = []
            try {
            serverItems = await getServerWishlist()
            } catch {
            return
            }

            const merged = new Map<string, (typeof localItems)[number]>()
            for (const item of serverItems) merged.set(item._id, item)
            for (const item of localItems) if (!merged.has(item._id)) merged.set(item._id, item)

            const mergedItems = Array.from(merged.values())
            set({ items: mergedItems })
            pushToServer(mergedItems)
        },
        }),
        {
        name: 'wishlist-storage',
        }
    )
)