'use client'

import { useState } from 'react'
import { RotateCcw, X } from 'lucide-react'
import { requestReturn, uploadReturnPhotos } from '@/lib/returns'
import { ApiError } from '@/lib/api'

interface ReturnRequestFormProps {
    orderId: string
    subOrderId: string
    onSuccess?: () => void
}

// Drop this next to a delivered sub-order's status pill. It handles its
// own open/closed state, so the parent just renders it — no wiring needed
// beyond passing the two IDs.
export default function ReturnRequestForm({ orderId, subOrderId, onSuccess }: ReturnRequestFormProps) {
    const [open, setOpen] = useState(false)
    const [reason, setReason] = useState('')
    const [files, setFiles] = useState<File[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [done, setDone] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            const photoUrls = files.length > 0 ? await uploadReturnPhotos(files) : []
            await requestReturn(orderId, subOrderId, reason, photoUrls)
            setDone(true)
            onSuccess?.()
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not submit return request.')
        } finally {
            setSubmitting(false)
        }
    }

    if (done) {
        return (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                Return requested — we&apos;ll notify you once it&apos;s reviewed.
            </p>
        )
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 font-medium mt-2"
            >
                <RotateCcw className="w-3.5 h-3.5" />
                Request Return
            </button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="mt-3 p-4 bg-neutral-50 border border-neutral-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-800">Request a Return</p>
                <button type="button" onClick={() => setOpen(false)}>
                    <X className="w-4 h-4 text-neutral-400" />
                </button>
            </div>

            {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">{error}</div>
            )}

            <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
                minLength={5}
                rows={3}
                placeholder="What's the issue with this order?"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
            />

            <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Photos (optional, up to 5)</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => setFiles(Array.from(e.target.files ?? []).slice(0, 5))}
                    className="text-sm"
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
            >
                {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
        </form>
    )
}