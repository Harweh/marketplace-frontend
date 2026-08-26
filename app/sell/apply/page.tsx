'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMyVendorProfile, applyAsVendor, VendorProfile } from '@/lib/seller'
import { ApiError } from '@/lib/api'

export default function ApplySellerPage() {
    const router = useRouter()
    const [existing, setExisting] = useState<VendorProfile | null>(null)
    const [checking, setChecking] = useState(true)

    const [storeName, setStoreName] = useState('')
    const [description, setDescription] = useState('')
    const [storeAddress, setStoreAddress] = useState('')
    const [storeCity, setStoreCity] = useState('')
    const [storeState, setStoreState] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        getMyVendorProfile()
            .then(v => setExisting(v))
            .catch(() => setExisting(null))
            .finally(() => setChecking(false))
    }, [])

    useEffect(() => {
        if (existing?.status === 'approved') {
            router.replace('/sell')
        }
    }, [existing, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await applyAsVendor({ storeName, description, storeAddress, storeCity, storeState })
            setSubmitted(true)
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Something went wrong.')
        } finally {
            setSubmitting(false)
        }
    }

    if (checking) {
        return <div className="max-w-lg mx-auto px-4 pt-36 md:pt-40 pb-20 text-center text-neutral-500">Loading...</div>
    }

    if (submitted || (existing && existing.status !== 'rejected')) {
        const status = submitted ? 'pending' : existing?.status
        return (
            <div className="max-w-lg mx-auto px-4 pt-36 md:pt-40 pb-20 text-center">
                <h1 className="text-2xl font-bold text-neutral-900 mb-3">
                    {status === 'pending' ? 'Application Submitted' : 'Application Status'}
                </h1>
                <p className="text-neutral-600">
                    {status === 'pending'
                        ? "Your seller application is pending review. We'll notify you once an admin approves it."
                        : `Your application status: ${status}`}
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-lg mx-auto px-4 pt-36 md:pt-40 pb-20">
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Become a Seller</h1>
            <p className="text-neutral-500 mb-8">
                Fill this out to apply. An admin will review your application before you can list products.
            </p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {existing?.status === 'rejected' && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
                    Your previous application was rejected. You can apply again below.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block font-medium text-neutral-800 mb-2">Store Name</label>
                    <input
                        value={storeName}
                        onChange={e => setStoreName(e.target.value)}
                        required
                        minLength={2}
                        className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                        placeholder="e.g. Artisan Co."
                    />
                </div>
                <div>
                    <label className="block font-medium text-neutral-800 mb-2">Description (optional)</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                        placeholder="Tell us what you'll be selling..."
                    />
                </div>
                <div>
                    <label className="block font-medium text-neutral-800 mb-2">Store Address</label>
                    <p className="text-sm text-neutral-500 mb-2">
                        Used to calculate accurate shipping costs for your buyers — not shown publicly.
                    </p>
                    <input
                        value={storeAddress}
                        onChange={e => setStoreAddress(e.target.value)}
                        required
                        minLength={5}
                        className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 mb-3"
                        placeholder="Street address"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            value={storeCity}
                            onChange={e => setStoreCity(e.target.value)}
                            required
                            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                            placeholder="City"
                        />
                        <input
                            value={storeState}
                            onChange={e => setStoreState(e.target.value)}
                            required
                            className="w-full border border-neutral-300 rounded-lg px-4 py-2.5"
                            placeholder="State"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-lg"
                >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </div>
    )
}