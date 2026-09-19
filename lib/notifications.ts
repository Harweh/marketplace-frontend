import { authedFetch } from './authedApi'

export interface Notification {
    _id: string
    type: string
    title: string
    message: string
    link?: string
    read: boolean
    createdAt: string
}

export interface NotificationsResponse {
    notifications: Notification[]
    unreadCount: number
}

export function getMyNotifications(): Promise<NotificationsResponse> {
    return authedFetch<NotificationsResponse>('/notifications/mine')
}

export function markAsRead(id: string): Promise<{ success: boolean }> {
    return authedFetch<{ success: boolean }>(`/notifications/${id}/read`, {
        method: 'PATCH',
    })
}

export function markAllAsRead(): Promise<{ success: boolean }> {
    return authedFetch<{ success: boolean }>('/notifications/read-all', {
        method: 'PATCH',
    })
}