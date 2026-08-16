import { apiFetch, ApiError, RequestOptions } from './api'
import { useAuthStore } from '@/store/auth'

// Wraps apiFetch with the current access token, and retries once after a
// silent refresh if the backend returns 401 (expired access token).
export async function authedFetch<T>(
    path: string,
    options: Omit<RequestOptions, 'token'> = {}
): Promise<T> {
    const { accessToken, refreshToken, refreshAccessToken } = useAuthStore.getState()

    try {
        return await apiFetch<T>(path, { ...options, token: accessToken })
    } catch (err) {
        if (err instanceof ApiError && err.status === 401 && refreshToken) {
            await refreshAccessToken()
            const newToken = useAuthStore.getState().accessToken
            return apiFetch<T>(path, { ...options, token: newToken })
        }
        throw err
    }
}
