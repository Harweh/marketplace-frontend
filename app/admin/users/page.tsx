'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { searchUsers, updateUserRole, AdminUser } from '@/lib/admin'

const ROLES = ['buyer', 'seller', 'admin', 'super_admin', 'support']

export default function AdminUsersPage() {
    const currentUser = useAuthStore(state => state.user)
    const isSuperAdmin = currentUser?.role === 'super_admin'

    const [query, setQuery] = useState('')
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [busyId, setBusyId] = useState<string | null>(null)

    const load = (q: string) => {
        setLoading(true)
        searchUsers(q || undefined)
            .then(setUsers)
            .finally(() => setLoading(false))
    }

    useEffect(() => { load('') }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        load(query)
    }

    const handleRoleChange = async (id: string, role: string) => {
        setBusyId(id)
        try {
            const updated = await updateUserRole(id, role)
            setUsers(prev => prev.map(u => (u._id === id ? updated : u)))
        } finally {
            setBusyId(null)
        }
    }

    return (
        <div className=''>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Users</h1>
            {!isSuperAdmin && (
                <p className="text-sm text-black mb-4">
                    Only a super_admin can change roles. You can view users but not edit them.
                </p>
            )}

            <form onSubmit={handleSearch} className="flex gap-2 mb-6 ">
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="flex-1 border border-neutral-900 text-black rounded-lg px-4 py-2"
                />
                <button type="submit" className="px-4 py-2 bg-neutral-900 text-neutral-300 rounded-lg font-medium">
                    Search
                </button>
            </form>

            {loading && <p className="text-neutral-900">Loading...</p>}
            {!loading && users.length === 0 && <p className="text-neutral-900">No users found.</p>}

            <div className="space-y-2">
                {users.map(user => (
                    <div
                        key={user._id}
                        className="bg-white border text-black border-neutral-300 rounded-lg p-4 flex items-center justify-between"
                    >
                        <div>
                            <p className="font-medium text-neutral-900">{user.name}</p>
                            <p className="text-sm text-neutral-500">{user.email}</p>
                        </div>
                        {isSuperAdmin ? (
                            <select
                                value={user.role}
                                disabled={busyId === user._id || user._id === currentUser?.id}
                                onChange={e => handleRoleChange(user._id, e.target.value)}
                                className="text-sm border border-neutral-300 text-black rounded-lg px-3 py-1.5 capitalize mt-10"
                            >
                                {ROLES.map(r => (
                                    <option key={r} value={r}>{r.replace('_', ' ')}</option>
                                ))}
                            </select>
                        ) : (
                            <span className="text-sm px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 capitalize">
                                {user.role.replace('_', ' ')}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}