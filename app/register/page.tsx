/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2 } from 'lucide-react'
import Header from '@/components/Navbar'
import { useAuthStore } from '@/store/auth'

export default function RegisterPage() {
    const router = useRouter()
    const register = useAuthStore(state => state.register)
    
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            throw new Error('Please fill in all fields')
        }

        if (formData.name.length < 2) {
            throw new Error('Name must be at least 2 characters')
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            throw new Error('Please enter a valid email')
        }

        if (formData.password.length < 6) {
            throw new Error('Password must be at least 6 characters')
        }

        if (formData.password !== formData.confirmPassword) {
            throw new Error('Passwords do not match')
        }

        await register(formData.name, formData.email, formData.password)
        router.push('/')
        } catch (err: any) {
        setError(err.message || 'Registration failed. Please try again.')
        } finally {
        setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-300">
        {/* <Header /> */}

        <main className="max-w-md mx-auto px-4 lg:px-0 py-60 md:40 mt-20">
            <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
                <h1 className="font-display text-3xl text-black font-bold mb-2">Create Account</h1>
                <p className="text-neutral-600">Join our community today</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-neutral-600" />
                    </div>
                    <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="block text-black w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all"
                    placeholder="Emmy Awe"
                    required
                    />
                </div>
                </div>

                {/* Email */}
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-600" />
                    </div>
                    <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="block text-black w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all"
                    placeholder="you@example.com"
                    required
                    />
                </div>
                </div>

                {/* Password */}
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-600" />
                    </div>
                    <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="block text-black w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all"
                    placeholder="••••••••"
                    required
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                    ) : (
                        <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                    )}
                    </button>
                </div>
                </div>

                {/* Confirm Password */}
                <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-600" />
                    </div>
                    <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="block text-black w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all"
                    placeholder="••••••••"
                    required
                    />
                    <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                    {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-neutral-500 hover:text-neutral-600" />
                    ) : (
                        <Eye className="h-5 w-5 text-neutral-500 hover:text-neutral-600" />
                    )}
                    </button>
                </div>
                </div>

                {/* Terms */}
                <div className="flex items-start">
                <input
                    id="terms"
                    type="checkbox"
                    required
                    className="w-4 h-4 mt-1 text-primary-600 focus:ring-primary-600 border-neutral-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-neutral-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                    Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                    Privacy Policy
                    </Link>
                </label>
                </div>

                {/* Submit Button */}
                <button
                type="submit"
                disabled={loading}
                className="w-full bg-black flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-semibold rounded-lg transition-colors"
                >
                {loading ? (
                    <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                    </>
                ) : (
                    'Create Account'
                )}
                </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-sm text-neutral-600 mt-6">
                Already have an account?{' '}
                <Link
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                Sign in
                </Link>
            </p>
            </div>
        </main>
        </div>
    )
}