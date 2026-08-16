    'use client'

    import { useSyncExternalStore } from 'react'
    import Link from 'next/link'
    import Image from 'next/image'
    import { ArrowRight, Sparkles, TrendingUp, Package } from 'lucide-react'
    import ProductCard from '@/components/ProductCard'
    import { MOCK_PRODUCTS } from '@/lib/products'
    import heaadset from '@/public/headphone.jpg'

    // Detects whether we've hydrated on the client yet, without the extra
    // render + lint issues that come from a useState/useEffect("mounted") pair.
    const emptySubscribe = () => () => {}
    function useMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    )
    }

    export default function HomePage() {
    const mounted = useMounted()

    const featuredProducts = MOCK_PRODUCTS.filter(p => p.featured).slice(0, 4)
    const newArrivals = MOCK_PRODUCTS.filter(p => p.new).slice(0, 4)
    const saleProducts = MOCK_PRODUCTS.filter(p => p.sale).slice(0, 4)

    const categories = [
        {
        name: 'Bags',
        image: 'https://res.cloudinary.com/drxf8zbyf/image/upload/v1771720157/bag_white_aduxbz.jpg',
        href: '/shop?category=Bags',
        },
        {
        name: 'Electronics',
        image: 'https://res.cloudinary.com/drxf8zbyf/image/upload/v1771720157/elect_yqa3g9.jpg',
        href: '/shop?category=Electronics',
        },
        {
        name: 'Home',
        image: 'https://res.cloudinary.com/drxf8zbyf/image/upload/v1771720177/home4_np9mbn.jpg',
        href: '/shop?category=Home',
        },
        {
        name: 'Clothing',
        image: 'https://res.cloudinary.com/drxf8zbyf/image/upload/v1765798796/samples/outdoor-woman.jpg',
        href: '/shop?category=Clothing',
        },
    ]

    if (!mounted) return null

    return (
        <div className="min-h-screen">

        <main>
            {/* Hero Section */}
            <section className="relative h-[40vh] lg:h-[55vh] bg-neutral-900 overflow-hidden mt-20 sm:mt-26">
            <div className="absolute inset-0">
                <Image
                src={heaadset}
                alt="Hero background"
                fill
                className="object-cover opacity-50"
                priority
                />
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="max-w-2xl animate-fade-in">
                {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 animate-slide-up">
                    <Sparkles className="w-4 h-4 text-primary-400" />
                    <span className="text-white text-sm font-medium">New Collection 2026</span>
                </div> */}
                
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up animate-delay-100">
                    Crafted for the Modern Life
                </h1>
                
                <p className="text-xl text-neutral-300 mb-8 animate-slide-up animate-delay-200">
                    Discover curated collections of premium, handcrafted products. 
                    Quality meets artistry in every piece.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animate-delay-300">
                    <Link
                    href="/shop"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                    <Link
                    href="/about"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg transition-all duration-300"
                    >
                    Learn More
                    </Link>
                </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                <div className="w-1 h-3 bg-white/50 rounded-full" />
                </div>
            </div> */}
            </section>

            {/* Features */}
            <section className="py-16 sm:py-10 bg-white border-y border-neutral-200 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid sm:grid-cols-3 lg:grid-col text-neutral-700 md:grid-cols-3 gap-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <Package className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
                    <p className="text-neutral-600">On orders over $100</p>
                </div>
                
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <TrendingUp className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
                    <p className="text-neutral-600">Curated collections</p>
                </div>
                
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Satisfaction Guaranteed</h3>
                    <p className="text-neutral-600">30-day returns</p>
                </div>
                </div>
            </div>
            </section>

            {/* Shop by Category */}
            <section className="py-20 bg-neutral-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                <h2 className="font-display text-neutral-800 text-4xl sm:text-5xl font-bold mb-4">
                    Shop by Category
                </h2>
                <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
                    Explore our carefully curated collections
                </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                    <Link
                    key={category.name}
                    href={category.href}
                    className="group relative aspect-square overflow-hidden rounded-lg animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    >
                    <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                        <h3 className="font-display text-2xl font-bold text-white">
                        {category.name}
                        </h3>
                    </div>
                    </Link>
                ))}
                </div>
            </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                <div>
                    <h2 className="font-display text-neutral-800 text-4xl sm:text-5xl font-bold mb-2">
                    Featured Products
                    </h2>
                    <p className="text-neutral-600 text-lg">
                    Handpicked favorites from our collection
                    </p>
                </div>
                <Link
                    href="/shop"
                    className="hidden sm:inline-flex items-center text-neutral-800 text-primary-600 hover:text-primary-700 font-semibold"
                >
                    View All
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product, index) => (
                    <div 
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    >
                    <ProductCard product={product} priority={index < 2} />
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* New Arrivals */}
            <section className="py-20 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                <div>
                    <h2 className="font-display text-neutral-800 text-4xl sm:text-5xl font-bold mb-2">
                    New Arrivals
                    </h2>
                    <p className="text-neutral-600 text-lg">
                    Fresh additions to our collection
                    </p>
                </div>
                <Link
                    href="/new"
                    className="hidden sm:inline-flex items-center text-neutral-800 text-primary-600 hover:text-primary-700 font-semibold"
                >
                    View All
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.map((product, index) => (
                    <div 
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    >
                    <ProductCard product={product} />
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* Sale Section */}
            {saleProducts.length > 0 && (
            <section className="py-20 bg-primary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                    <div>
                    <h2 className="font-display text-4xl sm:text-5xl font-bold mb-2 text-primary-900">
                        On Sale Now
                    </h2>
                    <p className="text-primary-700 text-lg">
                        Limited time offers on selected items
                    </p>
                    </div>
                    <Link
                    href="/sale"
                    className="hidden sm:inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
                    >
                    View All
                    <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {saleProducts.map((product, index) => (
                    <div 
                        key={product.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <ProductCard product={product} />
                    </div>
                    ))}
                </div>
                </div>
            </section>
            )}

            {/* Newsletter CTA */}
            <section className="py-20 bg-neutral-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                Join Our Community
                </h2>
                <p className="text-neutral-300 text-lg mb-8">
                Subscribe to get special offers, free giveaways, and exclusive deals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-lg text-white focus:outline-none border-1 border-neutral-700 focus:ring-2 focus:ring-primary-600"
                />
                <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                    Subscribe
                </button>
                </div>
            </div>
            </section>
        </main>

        </div>
    )
    }