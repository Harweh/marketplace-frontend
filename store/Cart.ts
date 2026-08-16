import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartState, CartItem } from '@/types'

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
        items: [],

        addItem: (product, quantity = 1, sku) => {
            const items = get().items
            const existingItemIndex = items.findIndex(
            item => item.product._id === product._id && item.selectedSku === sku
            )

            if (existingItemIndex > -1) {
            const newItems = [...items]
            newItems[existingItemIndex].quantity += quantity
            set({ items: newItems })
            } else {
            set({
                items: [...items, { product, quantity, selectedSku: sku }],
            })
            }
        },

        removeItem: (productId, sku) => {
            set({
            items: get().items.filter(item =>
                !(item.product._id === productId &&
                    (sku === undefined || item.selectedSku === sku))
            ),
            })
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
            }
        },

        clearCart: () => {
            set({ items: [] })
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