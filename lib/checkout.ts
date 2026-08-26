import { authedFetch } from './authedApi'

export interface CheckoutItem {
    productId: string
    sku?: string
    quantity: number
}

export interface ShippingAddress {
    line1: string
    city: string
    state: string
    phone: string
}

export interface CheckoutResponse {
    order: { _id: string; orderNumber: string; totalAmount: number }
    authorizationUrl: string
}

export interface VendorShippingBreakdown {
    vendorName: string
    subtotal: number
    shippingFee: number
}

export interface CheckoutPreview {
    vendors: VendorShippingBreakdown[]
    subtotal: number
    totalShipping: number
    total: number
}

export function previewCheckout(
    items: CheckoutItem[],
    shippingAddress: ShippingAddress
): Promise<CheckoutPreview> {
    return authedFetch<CheckoutPreview>('/checkout/preview', {
        method: 'POST',
        body: { items, shippingAddress },
    })
}

export function startCheckout(
    items: CheckoutItem[],
    shippingAddress: ShippingAddress
): Promise<CheckoutResponse> {
    return authedFetch<CheckoutResponse>('/checkout', {
        method: 'POST',
        body: { items, shippingAddress },
    })
}

export function verifyPayment(reference: string): Promise<{ paymentStatus: string; orderNumber: string }> {
    return authedFetch(`/checkout/verify/${reference}`)
}