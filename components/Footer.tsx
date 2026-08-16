import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'
import { FaInstagram, FaFacebook, FaXTwitter } from 'react-icons/fa6'

export default function Footer() {
    const footerLinks = {
        shop: [
        { name: 'All Products', href: '/shop' },
        { name: 'New Arrivals', href: '/new' },
        { name: 'Best Sellers', href: '/bestsellers' },
        { name: 'Sale', href: '/sale' },
        ],
        support: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQs', href: '/faq' },
        { name: 'Shipping & Returns', href: '/shipping' },
        { name: 'Size Guide', href: '/size-guide' },
        ],
        company: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Press', href: '/press' },
        ],
        legal: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        ],
    }

    return (
        <footer className="bg-neutral-900 text-neutral-300 mt-15 lg:mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2 sm:col-span-5">
                            <Link href="/" className="font-display text-3xl font-bold text-white block mb-4">
                            Emmy Commerce
                            </Link>
                            <p className="text-neutral-300 mb-6 max-w-sm">
                            Curated collections of premium, handcrafted products. 
                            Quality craftsmanship meets modern design.
                            </p>
                            
                            {/* Newsletter */}
                            <div className="mb-4 lg:mb-6">
                                <h3 className="text-white font-semibold mb-3 lg:mb-3">Stay Updated With Our News letter</h3>
                                <div className=" relative hidden lg:flex">
                                    <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 w-full px-4 py-3 lg:py-4 bg-neutral-800 border border-neutral-700 rounded-l-lg focus:outline-none focus:border-primary-600 transition-colors"
                                    />
                                    <button 
                                    type="submit"
                                    className="px-14 lg:px-6 py-2 bg-primary-600 cursor-pointer hover:bg-primary-700 text-white rounded-r-lg transition-colors">
                                    Join
                                    </button>
                                    {/* <button
                                        type="submit"
                                        className=" absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-gray-100 rounded-md transition">
                                        <ArrowRight className="w-5 h-5" />
                                    </button> */}
                                </div>

                                <form className="relative lg:hidden ">
                                    <input 
                                    type="email" 
                                    placeholder="Email address"
                                    className="w-[35vh] lg:w-[45vh] px-5 py-3 md:px-5 md:py-4 text-sm bg-neutral-800 text-white border border-neutral-700 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                    <button
                                    type="submit"
                                    className=" absolute right-35  md:right-3 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-gray-100 rounded-md transition">
                                    <ArrowRight className="w-7 h-7" />
                                    </button>
                                </form>
                            </div>

                            {/* Social */}
                            <div className="flex space-x-4 lg:space-x-6">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-primary-600 transition-colors"
                                aria-label="Instagram"
                            >
                                <FaInstagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-primary-600 transition-colors"
                                aria-label="Facebook"
                            >
                                <FaFacebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-primary-600 transition-colors"
                                aria-label="Twitter"
                            >
                                <FaXTwitter className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:hello@artisan.com"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-primary-600 transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                            </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-3 lg:mb-4">Shop</h3>
                        <ul className="space-y-1.5 lg:space-y-3">
                        {footerLinks.shop.map((link) => (
                            <li key={link.name}>
                            <Link
                                href={link.href}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-3 lg:mb-4">Support</h3>
                        <ul className="space-y-1.5 lg:space-y-3">
                        {footerLinks.support.map((link) => (
                            <li key={link.name}>
                            <Link
                                href={link.href}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-3 lg:mb-4">Company</h3>
                        <ul className="space-y-1.5 lg:space-y-3">
                        {footerLinks.company.map((link) => (
                            <li key={link.name}>
                            <Link
                                href={link.href}
                                className="text-neutral-400 hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>

                </div>

                <div className="border-t border-neutral-800 mt-8 lg:mt-12 pt-6 lg:pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-neutral-400 text-sm">
                        ©{new Date().getFullYear()}  Emmy Commerce. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        {footerLinks.legal.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-neutral400 hover:text-white text-sm transition-colors"
                        >
                            {link.name}
                        </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
