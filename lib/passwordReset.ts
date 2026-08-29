import { apiFetch } from './api'

export function forgotPassword(email: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: { email },
    })
}

export function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: { token, newPassword },
    })
}