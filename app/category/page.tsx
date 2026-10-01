'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Tag } from 'lucide-react'

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

export default function CategoryPage() {
    return (
        <main className="min-h-screen bg-white pt-32 md:pt-36">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
                        <Tag className="w-6 h-6 text-primary-600" />
                    </div>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
                        Browse Categories
                    </h1>
                    <p className="text-neutral-600 text-lg max-w-xl mx-auto">
                        Shop from our curated selection of premium handcrafted categories.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center mt-6 text-primary-600 hover:text-primary-700 font-semibold"
                    >
                        View all products
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group relative aspect-[4/5] overflow-hidden rounded-2xl animate-fade-in"
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                                <h3 className="font-display text-2xl font-bold text-white mb-1">
                                    {category.name}
                                </h3>
                                <p className="text-white/80 text-sm flex items-center group-hover:text-primary-200 transition-colors">
                                    Browse collection
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    )
}
