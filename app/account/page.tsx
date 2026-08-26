'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { User, MapPin, Package, LogOut, Star, Plus, Trash2, ShieldCheck, Heart } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useWishlistStore } from '@/store/Wishlist'
import { updateProfile, addAddress, updateAddress, deleteAddress, getMyOrders, MyOrder } from '@/lib/profile'
import { ApiError } from '@/lib/api'
import { Address } from '@/types'
import ProductCard from '@/components/ProductCard'

type Tab = 'overview' | 'profile' | 'addresses' | 'orders' | 'wishlist'

const STATUS_STYLES: Record<string, string> = {
    placed: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-blue-100 text-blue-700',
    packed: 'bg-amber-100 text-amber-700',
    shipped: 'bg-amber-100 text-amber-700',
    delivered: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    return_requested: 'bg-orange-100 text-orange-700',
    refunded: 'bg-neutral-200 text-neutral-600',
}

export default function AccountPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, isAuthenticated, fetchMe, logout } = useAuthStore()
    const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlistStore()
    const [checked, setChecked] = useState(false)
    const [tab, setTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'overview')

    useEffect(() => {
        fetchMe().finally(() => setChecked(true))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (checked && !isAuthenticated) router.replace('/login')
    }, [checked, isAuthenticated, router])

    // ── Orders (used on Overview + Orders tab) ──
    const [orders, setOrders] = useState<MyOrder[]>([])
    const [ordersLoaded, setOrdersLoaded] = useState(false)
    useEffect(() => {
        if (!isAuthenticated) return
        getMyOrders().then(setOrders).finally(() => setOrdersLoaded(true))
    }, [isAuthenticated])

    // ── Profile form ──
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [savingProfile, setSavingProfile] = useState(false)
    const [profileMsg, setProfileMsg] = useState<string | null>(null)
    const [profileError, setProfileError] = useState<string | null>(null)

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setPhone(user.phone ?? '')
        }
    }, [user])

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setProfileError(null)
        setProfileMsg(null)
        setSavingProfile(true)
        try {
            await updateProfile({ name, email, phone })
            await fetchMe()
            setProfileMsg('Profile updated successfully.')
        } catch (err) {
            setProfileError(err instanceof ApiError ? err.message : 'Could not update profile.')
        } finally {
            setSavingProfile(false)
        }
    }

    // ── Addresses ──
    const [showNewAddress, setShowNewAddress] = useState(false)
    const [label, setLabel] = useState('Home')
    const [line1, setLine1] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [addrPhone, setAddrPhone] = useState('')
    const [addrError, setAddrError] = useState<string | null>(null)
    const [savingAddr, setSavingAddr] = useState(false)

    const resetAddressForm = () => {
        setLabel('Home'); setLine1(''); setCity(''); setState(''); setAddrPhone('')
    }

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault()
        setAddrError(null)
        setSavingAddr(true)
        try {
            await addAddress({ label, line1, city, state, phone: addrPhone || undefined })
            await fetchMe()
            resetAddressForm()
            setShowNewAddress(false)
        } catch (err) {
            setAddrError(err instanceof ApiError ? err.message : 'Could not save address.')
        } finally {
            setSavingAddr(false)
        }
    }

    const handleSetDefault = async (addr: Address) => {
        await updateAddress(addr._id, { isDefault: true })
        await fetchMe()
    }

    const handleDeleteAddress = async (id: string) => {
        await deleteAddress(id)
        await fetchMe()
    }

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    if (!checked) {
        return <div className="min-h-screen flex items-center justify-center text-neutral-400">Loading...</div>
    }
    if (!user) return null

    const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    const defaultAddress = user.addresses?.find(a => a.isDefault) ?? user.addresses?.[0]

    const NAV: { id: Tab; label: string; icon: typeof User }[] = [
        { id: 'overview', label: 'Overview', icon: Star },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'orders', label: 'Orders', icon: Package },
    ]

    return (
        <div className="min-h-screen bg-neutral-50">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-40 pb-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                        {initials}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">{user.name}</h1>
                        <p className="text-neutral-500 text-sm">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <nav className="bg-white rounded-2xl border border-neutral-200 p-2 flex lg:flex-col gap-1 overflow-x-auto">
                            {NAV.map(item => {
                                const Icon = item.icon
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setTab(item.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                                            tab === item.id
                                                ? 'bg-neutral-900 text-white'
                                                : 'text-neutral-600 hover:bg-neutral-100'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                )
                            })}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </nav>
                    </aside>

                    {/* Main panel */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* ── OVERVIEW ── */}
                        {tab === 'overview' && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                                        <Package className="w-5 h-5 text-neutral-400 mb-3" />
                                        <p className="text-2xl font-bold text-neutral-900">{ordersLoaded ? orders.length : '…'}</p>
                                        <p className="text-sm text-neutral-500">Total Orders</p>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                                        <MapPin className="w-5 h-5 text-neutral-400 mb-3" />
                                        <p className="text-2xl font-bold text-neutral-900">{user.addresses?.length ?? 0}</p>
                                        <p className="text-sm text-neutral-500">Saved Addresses</p>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                                        <ShieldCheck className="w-5 h-5 text-neutral-400 mb-3" />
                                        <p className="text-lg font-bold text-neutral-900 capitalize">{user.role}</p>
                                        <p className="text-sm text-neutral-500">Account Type</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="font-semibold text-neutral-900">Recent Orders</h2>
                                        <button onClick={() => setTab('orders')} className="text-sm text-primary-600 font-medium">
                                            View all
                                        </button>
                                    </div>
                                    {ordersLoaded && orders.length === 0 && (
                                        <p className="text-sm text-neutral-500">No orders yet. <Link href="/shop" className="text-primary-600 font-medium">Start shopping</Link>.</p>
                                    )}
                                    <div className="space-y-3">
                                        {orders.slice(0, 3).map(order => (
                                            <div key={order._id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                                                <div>
                                                    <p className="font-medium text-neutral-900 text-sm">#{order.orderNumber}</p>
                                                    <p className="text-xs text-neutral-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <p className="font-semibold text-neutral-900 text-sm">₦{order.totalAmount.toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {defaultAddress && (
                                    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                                        <h2 className="font-semibold text-neutral-900 mb-3">Default Address</h2>
                                        <p className="text-sm text-neutral-600">
                                            <span className="font-medium text-neutral-900">{defaultAddress.label}</span> — {defaultAddress.line1}, {defaultAddress.city}, {defaultAddress.state}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ── PROFILE ── */}
                        {tab === 'profile' && (
                            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                                <h2 className="font-semibold text-lg text-neutral-900 mb-5">Personal Information</h2>

                                {profileError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{profileError}</div>
                                )}
                                {profileMsg && (
                                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">{profileMsg}</div>
                                )}

                                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
                                        <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email Address</label>
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone Number</label>
                                        <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm" />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={savingProfile}
                                        className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-semibold rounded-full"
                                    >
                                        {savingProfile ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* ── ADDRESSES ── */}
                        {tab === 'addresses' && (
                            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-semibold text-lg text-neutral-900">Saved Addresses</h2>
                                    <button
                                        onClick={() => setShowNewAddress(v => !v)}
                                        className="flex items-center gap-1.5 text-sm text-primary-600 font-semibold"
                                    >
                                        <Plus className="w-4 h-4" />
                                        {showNewAddress ? 'Cancel' : 'Add New'}
                                    </button>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                                    {(user.addresses ?? []).map(addr => (
                                        <div key={addr._id} className="border border-neutral-200 rounded-xl p-4 relative">
                                            {addr.isDefault && (
                                                <span className="absolute top-3 right-3 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                                                    Default
                                                </span>
                                            )}
                                            <p className="font-semibold text-neutral-900 text-sm mb-1">{addr.label}</p>
                                            <p className="text-sm text-neutral-500 mb-1">{addr.line1}, {addr.city}, {addr.state}</p>
                                            {addr.phone && <p className="text-sm text-neutral-400 mb-3">{addr.phone}</p>}
                                            <div className="flex gap-4 text-xs font-medium">
                                                {!addr.isDefault && (
                                                    <button onClick={() => handleSetDefault(addr)} className="text-primary-600">Set as Default</button>
                                                )}
                                                <button onClick={() => handleDeleteAddress(addr._id)} className="text-red-600 flex items-center gap-1">
                                                    <Trash2 className="w-3 h-3" /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {(!user.addresses || user.addresses.length === 0) && !showNewAddress && (
                                    <p className="text-sm text-neutral-500 mb-4">No saved addresses yet.</p>
                                )}

                                {showNewAddress && (
                                    <form onSubmit={handleAddAddress} className="space-y-3 border-t border-neutral-200 pt-5 max-w-md">
                                        {addrError && (
                                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{addrError}</div>
                                        )}
                                        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (e.g. Home, Office)" className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm" />
                                        <input value={line1} onChange={e => setLine1(e.target.value)} required placeholder="Street address" className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input value={city} onChange={e => setCity(e.target.value)} required placeholder="City" className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm" />
                                            <input value={state} onChange={e => setState(e.target.value)} required placeholder="State" className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm" />
                                        </div>
                                        <input value={addrPhone} onChange={e => setAddrPhone(e.target.value)} placeholder="Phone for this address (optional)" className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-sm" />
                                        <button type="submit" disabled={savingAddr} className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-semibold rounded-full">
                                            {savingAddr ? 'Saving...' : 'Save Address'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* ── WISHLIST ── */}
                        {tab === 'wishlist' && (
                            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-semibold text-lg text-neutral-900">Your Wishlist</h2>
                                    <span className="text-sm text-neutral-500">{wishlistItems.length} item{wishlistItems.length === 1 ? '' : 's'}</span>
                                </div>

                                {wishlistItems.length === 0 ? (
                                    <p className="text-sm text-neutral-500">
                                        Nothing saved yet. <Link href="/shop" className="text-primary-600 font-medium">Browse products</Link>.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {wishlistItems.map(product => (
                                            <div key={product._id} className="relative">
                                                <ProductCard product={product} />
                                                <button
                                                    onClick={() => removeFromWishlist(product._id)}
                                                    className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white text-neutral-600 hover:text-red-600 rounded-full shadow-sm transition-colors"
                                                    aria-label="Remove from wishlist"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── ORDERS ── */}
                        {tab === 'orders' && (
                            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                                <h2 className="font-semibold text-lg text-neutral-900 mb-5">Order History</h2>

                                {!ordersLoaded && <p className="text-sm text-neutral-500">Loading...</p>}
                                {ordersLoaded && orders.length === 0 && (
                                    <p className="text-sm text-neutral-500">
                                        No orders yet. <Link href="/shop" className="text-primary-600 font-medium">Start shopping</Link>.
                                    </p>
                                )}

                                <div className="space-y-3">
                                    {orders.map(order => (
                                        <div key={order._id} className="border border-neutral-200 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-semibold text-neutral-900 text-sm">#{order.orderNumber}</p>
                                                <p className="font-bold text-neutral-900 text-sm">₦{order.totalAmount.toFixed(2)}</p>
                                            </div>
                                            <p className="text-xs text-neutral-400 mb-3">
                                                {new Date(order.createdAt).toLocaleDateString()} · Payment: {order.paymentStatus}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {order.subOrders.map((sub, i) => (
                                                    <span key={i} className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_STYLES[sub.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                                                        {sub.status.replace('_', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}