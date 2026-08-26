'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { searchUsers, AdminUser } from '@/lib/admin'

const ROLE_TABS = [
    { key: '', label: 'All' },
    { key: 'buyer', label: 'Buyers' },
    { key: 'seller', label: 'Sellers' },
    { key: 'admin', label: 'Admins' },
    { key: 'support', label: 'Support' },
    { key: 'super_admin', label: 'Super Admins' },
]

const ROLE_STYLES: Record<string, string> = {
    buyer: 'bg-neutral-100 text-neutral-600',
    seller: 'bg-blue-100 text-blue-700',
    admin: 'bg-purple-100 text-purple-700',
    support: 'bg-teal-100 text-teal-700',
    super_admin: 'bg-black text-white',
}

export default function AdminUsersPage() {
    const currentUser = useAuthStore(state => state.user)
    const isSuperAdmin = currentUser?.role === 'super_admin'

    const [query, setQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)

    const load = (q: string, role: string) => {
        setLoading(true)
        searchUsers(q || undefined, role || undefined)
            .then(setUsers)
            .finally(() => setLoading(false))
    }

    useEffect(() => { load(query, roleFilter) }, [roleFilter])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        load(query, roleFilter)
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Users</h1>
            {!isSuperAdmin && (
                <p className="text-sm text-orange-600 mb-4">
                    Only a super_admin can change roles. You can view users but not edit them.
                </p>
            )}

            {/* Role category tabs — segments the platform's people into
                clear groups: normal buyers, sellers/vendors, and staff. */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {ROLE_TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setRoleFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            roleFilter === tab.key ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="flex-1 border border-neutral-300 rounded-lg px-4 py-2"
                />
                <button type="submit" className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-medium">
                    Search
                </button>
            </form>

            {loading && <p className="text-neutral-500">Loading...</p>}
            {!loading && users.length === 0 && <p className="text-neutral-500">No users found.</p>}

            <div className="space-y-2">
                {users.map(user => (
                    <Link
                        key={user._id}
                        href={`/admin/users/${user._id}`}
                        className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center justify-between hover:border-neutral-300 transition-colors"
                    >
                        <div>
                            <p className="font-medium text-neutral-900">{user.name}</p>
                            <p className="text-sm text-neutral-500">{user.email}</p>
                        </div>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${ROLE_STYLES[user.role] ?? 'bg-neutral-100 text-neutral-600'}`}>
                            {user.role.replace('_', ' ')}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}