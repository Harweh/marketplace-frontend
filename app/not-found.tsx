// /* eslint-disable react/no-unescaped-entities */
// import Link from 'next/link'
// import { Home, ArrowLeft, Compass } from 'lucide-react'

// export default function NotFound() {
//     return (
//         <div className="min-h-screen bg-gradient-to-br fro-black-900 via-gray-900/20 to-black-900 flex items-center justify-center px-4">
//             <div className="max-w-md w-full text-center space-y-6">
//                 <div className="flex justify-center">
//                     <div className="w-20 h-20 bg-gray-500/10 border border-green-500/20 rounded-full flex items-center justify-center">
//                         <Compass className="text-gray" size={40} />
//                     </div>
//                 </div>

//                 <h1 className="text-6xl md:text-7xl font-bold text-white">404</h1>
//                 <h2 className="text-xl md:text-2xl font-semibold text-white">Page Not Found</h2>
//                 <p className="text-gray-400">
//                     The page you're looking for doesn't exist or may have been moved.
//                 </p>

//                 <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
//                     <Link
//                         href="/"
//                         className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-black to-black text-white font-semibold rounded-xl hover:scale-105 transition-all"
//                     >
//                         <Home size={18} />
//                         Back Home
//                     </Link>
//                     <Link
//                         href="/shop"
//                         className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-lg border border-white/10 text-white font-semibold rounded-xl hover:border-white/20 transition-all"
//                     >
//                         <ArrowLeft size={18} />
//                         Shop
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     )
// }


import Link from 'next/link'
import { SearchX, Home, ShoppingBag } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 pt-36 md:pt-40 pb-20">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                    <SearchX className="w-11 h-11 text-neutral-400" />
                </div>
                <p className="text-sm font-semibold text-primary-600 mb-2">404</p>
                <h1 className="text-3xl font-bold text-neutral-900 mb-3">Page not found</h1>
                <p className="text-neutral-500 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or may have been moved.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-full transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-semibold rounded-full transition-colors"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Browse Shop
                    </Link>
                </div>
            </div>
        </div>
    )
}