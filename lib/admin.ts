import { authedFetch } from './authedApi'
import { Product, PaginatedProducts } from '@/types'

// ─── Types for the admin-only data this file fetches ───
export interface Vendor {
    _id: string
    user: { _id: string; name: string; email: string } | string
    storeName: string
    storeSlug: string
    description?: string
    status: 'pending' | 'approved' | 'suspended' | 'rejected'
    commissionRate: number
    createdAt: string
}

export interface OrderItem {
    product: string
    sku?: string
    title: string
    price: number
    quantity: number
}

export interface SubOrder {
    _id: string
    vendor: { _id: string; storeName: string; storeSlug: string } | string
    items: OrderItem[]
    subtotal: number
    status: string
    trackingNumber?: string
}

export interface AdminOrder {
    _id: string
    orderNumber: string
    buyer: { _id: string; name: string; email: string; phone?: string } | string
    subOrders: SubOrder[]
    totalAmount: number
    shippingAddress: { line1: string; city: string; state: string; phone: string }
    paymentStatus: string
    createdAt: string
}

export interface PaginatedOrders {
    orders: AdminOrder[]
    total: number
    page: number
    pages: number
}

// ─── Product moderation ───
export function getModerationQueue(): Promise<Product[]> {
    return authedFetch<Product[]>('/products/admin/queue')
}

export function getAllProductsAdmin(status?: string): Promise<Product[]> {
    const qs = status ? `?status=${status}` : ''
    return authedFetch<Product[]>(`/products/admin/all${qs}`)
}

export function moderateProduct(
    id: string,
    action: 'approve' | 'reject',
    rejectionReason?: string
): Promise<Product> {
    return authedFetch<Product>(`/products/${id}/moderate`, {
        method: 'POST',
        body: { action, rejectionReason },
    })
}

// ─── Vendor approval ───
export function getVendors(status?: string): Promise<Vendor[]> {
    const qs = status ? `?status=${status}` : ''
    return authedFetch<Vendor[]>(`/vendors/admin${qs}`)
}

export function moderateVendor(
    id: string,
    action: 'approve' | 'reject' | 'suspend'
): Promise<Vendor> {
    return authedFetch<Vendor>(`/vendors/${id}/moderate`, {
        method: 'PATCH',
        body: { action },
    })
}

export interface SalesPeriod {
    total: number
    count: number
}

export interface SalesStats {
    today: SalesPeriod
    week: SalesPeriod
    month: SalesPeriod
    allTime: SalesPeriod
}

export function getSalesStats(): Promise<SalesStats> {
    return authedFetch<SalesStats>('/orders/admin/stats')
}

// ─── Order oversight ───
export function getAllOrders(page = 1, status?: string): Promise<PaginatedOrders> {
    const params = new URLSearchParams({ page: String(page) })
    if (status) params.set('status', status)
    return authedFetch<PaginatedOrders>(`/orders/admin?${params.toString()}`)
}

export function getOrderById(id: string): Promise<AdminOrder> {
    return authedFetch<AdminOrder>(`/orders/admin/${id}`)
}

export function updateOrderStatus(
    orderId: string,
    subOrderId: string,
    status: string
): Promise<AdminOrder> {
    return authedFetch<AdminOrder>(`/orders/admin/${orderId}/suborders/${subOrderId}/status`, {
        method: 'PATCH',
        body: { status },
    })
}

// ─── User management (super_admin can change roles) ───
export interface AdminUser {
    _id: string
    name: string
    email: string
    role: string
    phone?: string
    createdAt: string
}

export function searchUsers(q?: string, role?: string): Promise<AdminUser[]> {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (role) params.set('role', role)
    const qs = params.toString()
    return authedFetch<AdminUser[]>(`/users/admin${qs ? `?${qs}` : ''}`)
}

export function updateUserRole(id: string, role: string): Promise<AdminUser> {
    return authedFetch<AdminUser>(`/users/${id}/role`, {
        method: 'PATCH',
        body: { role },
    })
}

export interface AdminUserAddress {
    _id: string
    label: string
    line1: string
    city: string
    state: string
    phone?: string
    isDefault: boolean
}

export interface AdminUserFull extends AdminUser {
    addresses?: AdminUserAddress[]
}

export interface AdminUserVendor {
    _id: string
    storeName: string
    storeSlug: string
    status: 'pending' | 'approved' | 'suspended' | 'rejected'
    commissionRate: number
    createdAt: string
}

export interface UserDetail {
    user: AdminUserFull
    vendor: AdminUserVendor | null
    orderCount: number
}

export function getUserDetail(id: string): Promise<UserDetail> {
    return authedFetch<UserDetail>(`/users/admin/${id}`)
}

// ─── Deeper stats breakdown ───
export interface VendorBreakdown {
    vendorId: string
    storeName: string
    total: number
    count: number
}

export interface CategoryBreakdown {
    category: string
    total: number
    count: number
}

export interface DailyBreakdown {
    date: string
    total: number
    count: number
}

export interface SalesBreakdown {
    byVendor: VendorBreakdown[]
    byCategory: CategoryBreakdown[]
    daily: DailyBreakdown[]
}

export function getSalesBreakdown(): Promise<SalesBreakdown> {
    return authedFetch<SalesBreakdown>('/orders/admin/stats/breakdown')
}

// ─── Category management ───
export interface AdminCategory {
    _id: string
    name: string
    slug: string
    parentCategory?: string
    isActive: boolean
}

export function getAllCategories(): Promise<AdminCategory[]> {
    return authedFetch<AdminCategory[]>('/categories/admin')
}

export function createCategory(name: string, parentCategory?: string): Promise<AdminCategory> {
    return authedFetch<AdminCategory>('/categories', {
        method: 'POST',
        body: { name, parentCategory },
    })
}

export function updateCategory(
    id: string,
    updates: { name?: string; parentCategory?: string; isActive?: boolean }
): Promise<AdminCategory> {
    return authedFetch<AdminCategory>(`/categories/${id}`, {
        method: 'PATCH',
        body: updates,
    })
}

export function deleteCategory(id: string): Promise<{ deleted: boolean }> {
    return authedFetch<{ deleted: boolean }>(`/categories/${id}`, {
        method: 'DELETE',
    })
}