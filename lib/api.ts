import { ApiResponse } from '@/types'

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export class ApiError extends Error {
    status: number
    details?: unknown

    constructor(message: string, status: number, details?: unknown) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.details = details
    }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown
    token?: string | null
}

// Low-level fetch wrapper. Builds the full URL, JSON-encodes the body,
// attaches the Authorization header when a token is passed, and unwraps
// the backend's { success, data } / { success, error } envelope.
export async function apiFetch<T>(
    path: string,
    options: RequestOptions = {}
): Promise<T> {
    const { body, token, headers, ...rest } = options

    let res: Response
    try {
        res = await fetch(`${API_BASE_URL}${path}`, {
            ...rest,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers,
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        })
    } catch {
        throw new ApiError('Could not reach the server. Check your connection.', 0)
    }

    let json: ApiResponse<T>
    try {
        json = (await res.json()) as ApiResponse<T>
    } catch {
        throw new ApiError('Server returned an unexpected response.', res.status)
    }

    if (!json.success) {
        throw new ApiError(json.error.message, res.status, json.error.details)
    }

    return json.data
}
