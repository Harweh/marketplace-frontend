import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, User } from '@/types'
import { apiFetch } from '@/lib/api'

interface AuthResponse {
    user: User
    accessToken: string
    refreshToken: string
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                const res = await apiFetch<AuthResponse>('/auth/login', {
                    method: 'POST',
                    body: { email, password },
                })
                set({
                    user: res.user,
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                    isAuthenticated: true,
                })
            },

            register: async (name: string, email: string, password: string, phone?: string) => {
                const res = await apiFetch<AuthResponse>('/auth/register', {
                    method: 'POST',
                    body: { name, email, password, phone },
                })
                set({
                    user: res.user,
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                    isAuthenticated: true,
                })
            },

            logout: () => {
                set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
            },

            fetchMe: async () => {
                const { accessToken } = get()
                if (!accessToken) return
                const user = await apiFetch<User>('/auth/me', { token: accessToken })
                set({ user, isAuthenticated: true })
            },

            refreshAccessToken: async () => {
                const { refreshToken } = get()
                if (!refreshToken) {
                    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
                    throw new Error('No refresh token available')
                }
                try {
                    const res = await apiFetch<{ accessToken: string }>('/auth/refresh', {
                        method: 'POST',
                        body: { refreshToken },
                    })
                    set({ accessToken: res.accessToken })
                } catch (err) {
                    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
                    throw err
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
)