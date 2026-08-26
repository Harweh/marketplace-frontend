import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartState, CartItem } from '@/types'
import { useAuthStore } from './auth'
import { getServerCart, syncServerCart } from '@/lib/cartSync'

// Pushes the current cart to the account, but only if logged in. Fire-and-
// forget — the UI already reflects the change locally, this just persists
// it so the same cart shows up on other devices.
function pushToServer(items: CartItem[]) {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) return
    syncServerCart(
        items.map(i => ({ productId: i.product._id, quantity: i.quantity, selectedSku: i.selectedSku }))
    ).catch(() => {
        // Non-fatal — local state is still correct, next mutation will retry.
    })
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
        items: [],

        addItem: (product, quantity = 1, sku) => {
            const items = get().items
            const existingItemIndex = items.findIndex(
            item => item.product._id === product._id && item.selectedSku === sku
            )

            let newItems: CartItem[]
            if (existingItemIndex > -1) {
            newItems = [...items]
            newItems[existingItemIndex] = {
                ...newItems[existingItemIndex],
                quantity: newItems[existingItemIndex].quantity + quantity,
            }
            } else {
            newItems = [...items, { product, quantity, selectedSku: sku }]
            }
            set({ items: newItems })
            pushToServer(newItems)
        },

        removeItem: (productId, sku) => {
            const newItems = get().items.filter(item =>
            !(item.product._id === productId && (sku === undefined || item.selectedSku === sku))
            )
            set({ items: newItems })
            pushToServer(newItems)
        },

        updateQuantity: (productId, quantity, sku) => {
            if (quantity <= 0) {
            get().removeItem(productId, sku)
            return
            }

            const items = get().items
            const itemIndex = items.findIndex(item =>
            item.product._id === productId &&
            (sku === undefined || item.selectedSku === sku)
            )

            if (itemIndex > -1) {
            const newItems = [...items]
            newItems[itemIndex] = { ...newItems[itemIndex], quantity }
            set({ items: newItems })
            pushToServer(newItems)
            }
        },

        clearCart: () => {
            set({ items: [] })
            pushToServer([])
        },

        getTotalPrice: () => {
            return get().items.reduce((total, item) => {
            const variant = item.selectedSku
                ? item.product.variants.find(v => v.sku === item.selectedSku)
                : undefined
            const unitPrice = variant ? variant.price : item.product.basePrice
            return total + unitPrice * item.quantity
            }, 0)
        },

        getTotalItems: () => {
            return get().items.reduce((total, item) => total + item.quantity, 0)
        },

        // Called once after login: pulls the account's saved cart, merges
        // it with whatever was in this browser's localStorage (e.g. items
        // added while browsing as a guest), and pushes the merged result
        // back so both sides agree.
        syncFromServer: async () => {
            const localItems = get().items
            let serverItems: CartItem[] = []
            try {
            const raw = await getServerCart()
            serverItems = raw.map(r => ({ product: r.product, quantity: r.quantity, selectedSku: r.selectedSku }))
            } catch {
            return
            }

            const merged = new Map<string, CartItem>()
            const keyOf = (i: CartItem) => `${i.product._id}::${i.selectedSku ?? ''}`

            for (const item of serverItems) merged.set(keyOf(item), item)
            for (const item of localItems) {
            const key = keyOf(item)
            const existing = merged.get(key)
            // Use the larger quantity rather than summing, so re-syncing
            // on the same device (e.g. refresh) never inflates counts.
            merged.set(key, existing
                ? { ...existing, quantity: Math.max(existing.quantity, item.quantity) }
                : item)
            }

            const mergedItems = Array.from(merged.values())
            set({ items: mergedItems })
            pushToServer(mergedItems)
        },
        }),
        {
        name: 'cart-storage',
        version: 1,
        // Old carts saved before the Product type had `variants`/`_id` in
        // its current shape would otherwise crash the cart page. On load,
        // drop any item that doesn't match what the app expects now.
        migrate: (persisted) => {
            const state = persisted as { items?: unknown[] } | undefined
            if (!state?.items) return { items: [] }
            const items = state.items.filter((item): item is CartItem => {
                const i = item as Partial<CartItem>
                return !!i.product && !!i.product._id && Array.isArray(i.product.variants)
            })
            return { items }
        },
        }
    )
)