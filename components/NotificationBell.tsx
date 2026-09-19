'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Bell, Check } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { getMyNotifications, markAsRead, markAllAsRead, Notification } from '@/lib/notifications'

function timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

export default function NotificationBell() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)
    const [open, setOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const load = () => {
        getMyNotifications()
            .then(res => {
                setNotifications(res.notifications)
                setUnreadCount(res.unreadCount)
            })
            .finally(() => setLoaded(true))
    }

    useEffect(() => {
        if (!isAuthenticated) return
        load()
        const interval = setInterval(load, 60000)
        return () => clearInterval(interval)
    }, [isAuthenticated])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const handleOpen = () => {
        setOpen(v => !v)
        if (!loaded) load()
    }

    const handleNotificationClick = async (n: Notification) => {
        if (!n.read) {
            setNotifications(prev => prev.map(x => x._id === n._id ? { ...x, read: true } : x))
            setUnreadCount(c => Math.max(0, c - 1))
            markAsRead(n._id).catch(() => {})
        }
        setOpen(false)
    }

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
        markAllAsRead().catch(() => {})
    }

    if (!isAuthenticated) return null

    return (
        <div ref={containerRef} className="relative flex items-center">
            <button
                onClick={handleOpen}
                className="relative flex items-center justify-center text-gray-700 hover:text-black transition-colors p-0 bg-transparent border-0"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-80 max-h-[28rem] overflow-y-auto bg-white rounded-2xl shadow-lg border border-neutral-200 z-50 top-full">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                        <p className="font-semibold text-neutral-900 text-sm">Notifications</p>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="flex items-center gap-1 text-xs text-primary-600 font-medium"
                            >
                                <Check className="w-3 h-3" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <p className="text-sm text-neutral-400 text-center py-10">No notifications yet.</p>
                    ) : (
                        <div className="divide-y divide-neutral-100">
                            {notifications.map(n => {
                                const content = (
                                    <div
                                        className={`px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer ${
                                            !n.read ? 'bg-primary-50/40' : ''
                                        }`}
                                        onClick={() => handleNotificationClick(n)}
                                    >
                                        <div className="flex items-start gap-2">
                                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5 flex-shrink-0" />}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                                                <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{n.message}</p>
                                                <p className="text-xs text-neutral-400 mt-1">{timeAgo(n.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                                return n.link ? (
                                    <Link key={n._id} href={n.link}>{content}</Link>
                                ) : (
                                    <div key={n._id}>{content}</div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}