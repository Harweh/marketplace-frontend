// // /* eslint-disable react/no-unescaped-entities */
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // 'use client'

// // import { useState } from 'react'
// // import { useRouter } from 'next/navigation'
// // import Link from 'next/link'
// // import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
// // import Header from '@/components/Navbar'
// // import { useAuthStore } from '@/store/auth'

// // export default function LoginPage() {
// //     const router = useRouter()
// //     const login = useAuthStore(state => state.login)
    
// //     const [showPassword, setShowPassword] = useState(false)
// //     const [loading, setLoading] = useState(false)
// //     const [error, setError] = useState('')
    
// //     const [formData, setFormData] = useState({
// //         email: '',
// //         password: '',
// //     })

// //     const handleSubmit = async (e: React.FormEvent) => {
// //         e.preventDefault()
// //         setError('')
// //         setLoading(true)

// //         try {
// //         // Basic validation
// //         if (!formData.email || !formData.password) {
// //             throw new Error('Please fill in all fields')
// //         }

// //         if (!/\S+@\S+\.\S+/.test(formData.email)) {
// //             throw new Error('Please enter a valid email')
// //         }

// //         await login(formData.email, formData.password)
// //         router.push('/')
// //         } catch (err: any) {
// //         setError(err.message || 'Login failed. Please try again.')
// //         } finally {
// //         setLoading(false)
// //         }
// //     }

// //     return (
// //         <div className="min-h-screen bg-neutral-300">

// //         <main className="max-w-md mx-auto px-4 py-60 md:40 mt-20">
// //             <div className="bg-white rounded-lg shadow-lg p-6 lg:8">
// //             <div className="text-center mb-8">
// //                 <h1 className="font-display text-3xl text-black font-bold mb-2">Welcome Back</h1>
// //                 <p className="text-neutral-600">Sign in to your account</p>
// //             </div>

// //             {error && (
// //                 <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
// //                 <p className="text-red-600 text-sm">{error}</p>
// //                 </div>
// //             )}

// //             <form onSubmit={handleSubmit} className="space-y-6">
// //                 {/* Email */}
// //                 <div>
// //                 <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
// //                     Email
// //                 </label>
// //                 <div className="relative">
// //                     <div className="absolute  inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                     <Mail className="h-5 w-5 text-neutral-600" />
// //                     </div>
// //                     <input
// //                     id="email"
// //                     type="email"
// //                     value={formData.email}
// //                     onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
// //                     className="block text-black w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all"
// //                     placeholder="you@example.com"
// //                     required
// //                     />
// //                 </div>
// //                 </div>

// //                 {/* Password */}
// //                 <div>
// //                 <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
// //                     Password
// //                 </label>
// //                 <div className="relative">
// //                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                     <Lock className="h-5 w-5 text-neutral-600" />
// //                     </div>
// //                     <input
// //                     id="password"
// //                     type={showPassword ? 'text' : 'password'}
// //                     value={formData.password}
// //                     onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
// //                     className="block text-black w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all"
// //                     placeholder="••••••••"
// //                     required
// //                     />
// //                     <button
// //                     type="button"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
// //                     >
// //                     {showPassword ? (
// //                         <EyeOff className="h-5 w-5 text-neutral-500 hover:text-neutral-600" />
// //                     ) : (
// //                         <Eye className="h-5 w-5 text-neutral-600 hover:text-neutral-600" />
// //                     )}
// //                     </button>
// //                 </div>
// //                 </div>

// //                 {/* Remember Me & Forgot Password */}
// //                 <div className="flex items-center justify-between">
// //                 <label className="flex items-center">
// //                     <input
// //                     type="checkbox"
// //                     className="w-4 h-4 text-primary-600 focus:ring-primary-600 border-neutral-300 rounded"
// //                     />
// //                     <span className="ml-2 text-sm text-neutral-700">Remember me</span>
// //                 </label>
// //                 <Link
// //                     href="/forgot-password"
// //                     className="text-sm text-neutral-700 text-primary-600 hover:text-primary-700 font-medium"
// //                 >
// //                     Forgot password?
// //                 </Link>
// //                 </div>

// //                 {/* Submit Button */}
// //                 <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className="w-full bg-black flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-semibold rounded-lg transition-colors"
// //                 >
// //                 {loading ? (
// //                     <>
// //                     <Loader2 className="w-5 h-5 mr-2 animate-spin" />
// //                     Signing in...
// //                     </>
// //                 ) : (
// //                     'Sign In'
// //                 )}
// //                 </button>
// //             </form>

// //             {/* Divider */}
// //             <div className="relative my-6">
// //                 <div className="absolute inset-0 flex items-center">
// //                 <div className="w-full border-t border-neutral-300" />
// //                 </div>
// //                 <div className="relative flex justify-center text-sm">
// //                 <span className="px-2 bg-white text-neutral-500">Or continue with</span>
// //                 </div>
// //             </div>

// //             {/* Social Login */}
// //             <div className="grid grid-cols-2 gap-4">
// //                 <button className="flex text-neutral-800 items-center justify-center px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
// //                     <svg className="w-5 h-5 text-amber-800 mr-2" viewBox="0 0 24 24">
// //                         <path
// //                         fill="currentColor"
// //                         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
// //                         />
// //                         <path
// //                         fill="currentColor"
// //                         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
// //                         />
// //                         <path
// //                         fill="currentColor"
// //                         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
// //                         />
// //                         <path
// //                         fill="currentColor"
// //                         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
// //                         />
// //                     </svg>
// //                     Google
// //                 </button>
// //                 <button className="flex text-neutral-800 items-center justify-center px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
// //                 <svg className="w-5 h-5 mr-2" color='blue' fill="currentColor" viewBox="0 0 24 24">
// //                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
// //                 </svg>
// //                 Facebook
// //                 </button>
// //             </div>

// //             {/* Sign Up Link */}
// //             <p className="text-center text-sm text-neutral-600 mt-6">
// //                 Don't have an account?{' '}
// //                 <Link
// //                 href="/register"
// //                 className="text-primary-600 hover:text-primary-700 font-semibold"
// //                 >
// //                 Sign up
// //                 </Link>
// //             </p>
// //             </div>
// //         </main>
// //         </div>
// //     )
// // }




// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { User, Store, ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react'
// import { useAuthStore } from '@/store/auth'
// import { ApiError } from '@/lib/api'

// type LoginAs = 'user' | 'seller' | 'admin'

// const OPTIONS: { key: LoginAs; label: string; icon: typeof User }[] = [
//     { key: 'user', label: 'User', icon: User },
//     { key: 'seller', label: 'Seller', icon: Store },
//     { key: 'admin', label: 'Admin', icon: ShieldCheck },
// ]

// export default function LoginPage() {
//     const router = useRouter()
//     const login = useAuthStore(state => state.login)

//     const [loginAs, setLoginAs] = useState<LoginAs>('user')
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [showPassword, setShowPassword] = useState(false)
//     const [submitting, setSubmitting] = useState(false)
//     const [error, setError] = useState<string | null>(null)

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         setError(null)
//         setSubmitting(true)
//         try {
//             await login(email, password)
//             const role = useAuthStore.getState().user?.role

//             if (loginAs === 'admin') {
//                 if (role === 'admin' || role === 'super_admin') {
//                     router.push('/admin')
//                 } else {
//                     setError("This account doesn't have admin access.")
//                     setSubmitting(false)
//                     return
//                 }
//             } else if (loginAs === 'seller') {
//                 if (role === 'seller' || role === 'admin' || role === 'super_admin') {
//                     router.push('/sell')
//                 } else {
//                     router.push('/sell/apply')
//                 }
//             } else {
//                 router.push('/')
//             }
//         } catch (err) {
//             setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.')
//             setSubmitting(false)
//         }
//     }

//     return (
//         <main className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 pt-32 pb-10">
//             <div className="w-full max-w-md">
//                 <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 sm:p-10">
//                     {/* Brand mark */}
//                     <div className="flex justify-center mb-6">
//                         <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center">
//                             <span className="text-white font-bold text-lg">A</span>
//                         </div>
//                     </div>

//                     <h1 className="text-2xl font-bold text-neutral-900 text-center mb-1">Welcome back</h1>
//                     <p className="text-neutral-500 text-center text-sm mb-7">Log in to continue to Awelewa</p>

//                     {/* Role selector — segmented control */}
//                     <div className="flex bg-neutral-100 rounded-xl p-1 mb-6">
//                         {OPTIONS.map(opt => {
//                             const Icon = opt.icon
//                             const active = loginAs === opt.key
//                             return (
//                                 <button
//                                     key={opt.key}
//                                     type="button"
//                                     onClick={() => setLoginAs(opt.key)}
//                                     className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
//                                         active
//                                             ? 'bg-white text-neutral-900 shadow-sm'
//                                             : 'text-neutral-500 hover:text-neutral-700'
//                                     }`}
//                                 >
//                                     <Icon className="w-4 h-4" />
//                                     {opt.label}
//                                 </button>
//                             )
//                         })}
//                     </div>

//                     {error && (
//                         <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
//                             {error}
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div className="relative">
//                             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
//                             <input
//                                 type="email"
//                                 value={email}
//                                 onChange={e => setEmail(e.target.value)}
//                                 required
//                                 placeholder="Email address"
//                                 className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-colors"
//                             />
//                         </div>

//                         <div className="relative">
//                             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-900" />
//                             <input
//                                 type={showPassword ? 'text' : 'password'}
//                                 value={password}
//                                 onChange={e => setPassword(e.target.value)}
//                                 required
//                                 placeholder="Password"
//                                 className="w-full pl-11 pr-11 py-3 text-black bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-colors"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(v => !v)}
//                                 className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-900 hover:text-neutral-600"
//                             >
//                                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                             </button>
//                         </div>

//                         <div className="flex justify-end">
//                             <Link href="/forgot-password" className="text-sm text-neutral-500 hover:text-neutral-900 font-medium">
//                                 Forgot password?
//                             </Link>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
//                         >
//                             {submitting ? 'Logging in...' : 'Log In'}
//                         </button>
//                     </form>
//                 </div>

//                 <p className="text-center text-sm text-neutral-500 mt-6">
//                     Don&apos;t have an account?{' '}
//                     <Link href="/register" className="text-neutral-900 font-semibold">Sign up</Link>
//                 </p>
//             </div>
//         </main>
//     )
// }



'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Store, ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { ApiError } from '@/lib/api'

type LoginAs = 'user' | 'seller' | 'admin'

const OPTIONS: { key: LoginAs; label: string; icon: typeof User; subtitle: string }[] = [
    { key: 'user', label: 'User', icon: User, subtitle: 'Log in to continue shopping' },
    { key: 'seller', label: 'Seller', icon: Store, subtitle: 'Log in to continue selling' },
    { key: 'admin', label: 'Admin', icon: ShieldCheck, subtitle: 'Log in to do your job' },
]

export default function LoginPage() {
    const router = useRouter()
    const login = useAuthStore(state => state.login)

    const [loginAs, setLoginAs] = useState<LoginAs>('user')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const activeOption = OPTIONS.find(o => o.key === loginAs)!

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await login(email, password)
            const role = useAuthStore.getState().user?.role

            if (loginAs === 'admin') {
                if (role === 'admin' || role === 'super_admin') {
                    router.push('/admin')
                } else {
                    setError("This account doesn't have admin access.")
                    setSubmitting(false)
                    return
                }
            } else if (loginAs === 'seller') {
                if (role === 'seller' || role === 'admin' || role === 'super_admin') {
                    router.push('/sell')
                } else {
                    router.push('/sell/apply')
                }
            } else {
                router.push('/')
            }
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.')
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 pt-32 pb-10">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8 sm:p-10">
                    {/* Brand mark */}
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-neutral-900 text-center mb-1">Welcome back</h1>
                    <p className="text-neutral-500 text-center text-sm mb-7">{activeOption.subtitle}</p>

                    {/* Role selector — segmented control */}
                    <div className="flex bg-neutral-100 rounded-xl p-1 mb-6">
                        {OPTIONS.map(opt => {
                            const Icon = opt.icon
                            const active = loginAs === opt.key
                            return (
                                <button
                                    key={opt.key}
                                    type="button"
                                    onClick={() => setLoginAs(opt.key)}
                                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                                        active
                                            ? 'bg-white text-neutral-900 shadow-sm'
                                            : 'text-neutral-500 hover:text-neutral-700'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {opt.label}
                                </button>
                            )
                        })}
                    </div>

                    {error && (
                        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="Email address"
                                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-colors"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                className="w-full pl-11 pr-11 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-sm text-neutral-500 hover:text-neutral-900 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                        >
                            {submitting ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-neutral-500 mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-neutral-900 font-semibold">Sign up</Link>
                </p>
            </div>
        </main>
    )
}