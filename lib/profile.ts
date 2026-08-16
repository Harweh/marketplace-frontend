import { authedFetch } from './authedApi'
import { User, Address } from '@/types'

export interface UpdateProfileInput {
    name?: string
    email?: string
    phone?: string
}

export function updateProfile(input: UpdateProfileInput): Promise<User> {
    return authedFetch<User>('/users/me', {
        method: 'PATCH',
        body: input,
    })
}

export interface AddressInput {
    label?: string
    line1: string
    city: string
    state: string
    phone?: string
    isDefault?: boolean
}

export function addAddress(input: AddressInput): Promise<User> {
    return authedFetch<User>('/users/me/addresses', {
        method: 'POST',
        body: input,
    })
}

export function updateAddress(id: string, input: Partial<AddressInput>): Promise<User> {
    return authedFetch<User>(`/users/me/addresses/${id}`, {
        method: 'PATCH',
        body: input,
    })
}

export function deleteAddress(id: string): Promise<User> {
    return authedFetch<User>(`/users/me/addresses/${id}`, {
        method: 'DELETE',
    })
}

export interface MyOrder {
    _id: string
    orderNumber: string
    totalAmount: number
    paymentStatus: string
    createdAt: string
    subOrders: { status: string; items: { title: string; quantity: number }[] }[]
}

export function getMyOrders(): Promise<MyOrder[]> {
    return authedFetch<MyOrder[]>('/orders/mine')
}

export type { Address }