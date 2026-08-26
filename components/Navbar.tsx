'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/Cart';
import { X, ShoppingCart, User, Search, MenuIcon } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function Navbar() {
    const router = useRouter()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const totalItems = useCartStore(state => state.getTotalItems())
    const { isAuthenticated } = useAuthStore()

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const q = searchTerm.trim()
        router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
        setIsSearchOpen(false)
    }

    // The cart/wishlist counts come from localStorage (via zustand persist),
    // which the server can't see. Rendering them only after mount avoids a
    // hydration mismatch between the server's "0" and the client's real count.
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navigation = [
        { name: 'Shop', href: '/shop' },
        { name: 'Catalog', href: '/catalog' },
        { name: 'New Arrivals', href: '/new' },
        { name: 'Sale', href: '/sale' },
    ]

    return (
        <header className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white shadow-md'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Top Banner */}
                <div className="flex items-center justify-center border-b border-gray-100">
                    <h2 className='text-black text-sm sm:text-base md:text-lg lg:text-xl py-3 md:py-4 font-bold text-center'> 
                        Welcome to your number one online commerce
                    </h2>
                </div>

                {/* Main Navigation */}
                <div className="flex items-center justify-between py-4 lg:py-4 px-1 lg:px-0">
                    
                    {/* Left Side - Mobile Menu & Search */}
                    <div className="flex items-center gap-3 md:hidden">
                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            className="text-black p- md:p-4"
                        >
                            {isMobileMenuOpen ? <X size={14} /> : <MenuIcon size={14} />}
                        </button>

                        {/* Mobile Search Button */}
                        <button 
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className='text-gray-700 pt-1 hover:text-black'
                        >
                            <Search size={12} />
                        </button>
                    </div>

                    {/* Logo */}
                    <Link 
                        href="/" 
                        className="text-3xl md:text-3xl font-bold text-black absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                        E-Shop
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-black font-medium transition-colors relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800" size={14} />
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search for products..."
                                className="w-full pl-12 pr-4 py-2.5 pt-3 text-black bg-gray-200 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-black/10"
                            />
                        </div>
                    </form>

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">
                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative text-gray-700 hover:text-black transition-colors"
                            aria-label="Shopping cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {mounted && totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* User Account */}
                        <Link
                            href={isAuthenticated ? '/account' : '/login'}
                            className="text-gray-700 hover:text-black transition-colors hidden sm:block"
                            aria-label="Account"
                        >
                            <User className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && (
                    <form onSubmit={handleSearchSubmit} className="md:hidden pb-2 animate-slide-up">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800" size={12} />
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-12 pr-4 py-2.5 text-black bg-gray-200 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-black/10"
                                autoFocus
                            />
                        </div>
                    </form>
                )}
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-80 h-[96vh] bg-white shadow-lg border-t border-gray-100">
                    <nav className="flex flex-col">
                        <Link 
                            href="/" 
                            className="text-black py-4 px-6 hover:bg-gray-50 transition border-b border-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        {navigation.map((item) => (
                            <Link 
                                key={item.name}
                                href={item.href} 
                                className="text-black py-4 px-6 hover:bg-gray-50 transition border-b border-gray-100"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link 
                            href="/contact" 
                            className="text-black py-4 px-6 hover:bg-gray-50 transition"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Contact
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}