import { apiFetch } from './api'
import { Category } from '@/types'

// GET /api/categories — public.
export async function getCategories(): Promise<Category[]> {
    return apiFetch<Category[]>('/categories')
}
