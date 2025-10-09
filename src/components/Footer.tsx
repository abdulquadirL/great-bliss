"use client";
import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';



const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="bg-gray-900 text-white py-8 relative">
            {/* Scroll to top button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                    aria-label="Scroll to top"
                >
                    <svg 
                        className="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Great Bliss</h3>
                        <p className="text-gray-400">
                            Your trusted destination for quality products and exceptional service.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                            <li><Link href="/products" className="text-gray-400 hover:text-white">Products</Link></li>
                            <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
                        <ul className="space-y-2">
                            <li><Link href="/shipping" className="text-gray-400 hover:text-white">Shipping Info</Link></li>
                            <li><Link href="/returns" className="text-gray-400 hover:text-white">Returns</Link></li>
                            <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <div className="text-gray-400 space-y-2">
                            <p>Email: info@greatbliss.com</p>
                            <p>Phone: (555) 123-4567</p>
                            <p>Address: 123 Commerce St, City, State 12345</p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>&copy; {currentYear} Great Bliss. All rights reserved.</p>
                </div>
        
            </div>
        </footer>
    );
};

export default Footer;
