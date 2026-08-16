'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Power } from 'lucide-react'
import {
    getAllCategories, createCategory, updateCategory, deleteCategory, AdminCategory,
} from '@/lib/admin'
import { ApiError } from '@/lib/api'

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<AdminCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [name, setName] = useState('')
    const [parentId, setParentId] = useState('')
    const [creating, setCreating] = useState(false)

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')

    const load = () => {
        setLoading(true)
        getAllCategories().then(setCategories).finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const topLevel = categories.filter(c => !c.parentCategory)
    const nameOf = (id?: string) => categories.find(c => c._id === id)?.name

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setCreating(true)
        try {
            await createCategory(name, parentId || undefined)
            setName('')
            setParentId('')
            load()
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not create category.')
        } finally {
            setCreating(false)
        }
    }

    const handleToggleActive = async (cat: AdminCategory) => {
        await updateCategory(cat._id, { isActive: !cat.isActive })
        load()
    }

    const handleDelete = async (id: string) => {
        setError(null)
        try {
            await deleteCategory(id)
            load()
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not delete category.')
        }
    }

    const startEdit = (cat: AdminCategory) => {
        setEditingId(cat._id)
        setEditName(cat.name)
    }

    const saveEdit = async (id: string) => {
        await updateCategory(id, { name: editName })
        setEditingId(null)
        load()
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Categories</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Create form */}
            <form onSubmit={handleCreate} className="bg-white rounded-lg border border-neutral-200 p-4 mb-6 flex gap-3 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Category Name</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        minLength={2}
                        placeholder="e.g. Electronics"
                        className="w-full border border-neutral-300 text-black rounded-lg px-3 py-2 text-sm"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Parent (optional)</label>
                    <select
                        value={parentId}
                        onChange={e => setParentId(e.target.value)}
                        className="w-full border border-neutral-300  text-black rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">None — top-level category</option>
                        {topLevel.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={creating}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
                >
                    <Plus className="w-4 h-4" />
                    {creating ? 'Adding...' : 'Add'}
                </button>
            </form>

            {loading && <p className="text-neutral-500">Loading...</p>}
            {!loading && categories.length === 0 && (
                <p className="text-neutral-500">No categories yet. Add one above.</p>
            )}

            <div className="space-y-2">
                {categories.map(cat => (
                    <div
                        key={cat._id}
                        className={`bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-between ${
                            !cat.isActive ? 'opacity-50' : ''
                        }`}
                    >
                        <div>
                            {editingId === cat._id ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        className="border border-neutral-300 rounded-lg px-3 py-1.5 text-sm"
                                    />
                                    <button onClick={() => saveEdit(cat._id)} className="text-sm text-primary-600 font-medium">
                                        Save
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="text-sm text-neutral-500">
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => startEdit(cat)} className="text-left">
                                    <p className="font-medium text-neutral-900">{cat.name}</p>
                                    <p className="text-xs text-neutral-500">
                                        {cat.slug}
                                        {cat.parentCategory && ` · under ${nameOf(cat.parentCategory) ?? 'unknown'}`}
                                        {!cat.isActive && ' · inactive'}
                                    </p>
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleToggleActive(cat)}
                                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${
                                    cat.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-600'
                                }`}
                            >
                                <Power className="w-3 h-3" />
                                {cat.isActive ? 'Active' : 'Inactive'}
                            </button>
                            <button
                                onClick={() => handleDelete(cat._id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}