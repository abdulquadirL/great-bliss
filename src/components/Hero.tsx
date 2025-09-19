'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { Inter } from 'next/font/google'  
const inter = Inter({ subsets: ['latin'] })

export default function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative bg-gradient-to-r from-red-100 to-gray-50 py-20">
      <div className="container mx-auto px-4 text-center ">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Premium Skincare for 
          <span className="text-primary block"> Radiant Beauty</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover our collection of premium skincare products designed to nourish, 
          protect, and enhance your natural beauty with scientifically-proven ingredients.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" onClick={scrollToProducts} className="text-lg px-8 py-3">
            Shop Now
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-3">
            Learn More
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🌿</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Natural Ingredients</h3>
            <p className="text-gray-600">Carefully selected natural and organic ingredients for healthy skin</p>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🧪</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Scientifically Proven</h3>
            <p className="text-gray-600">Formulated with clinically tested ingredients for maximum effectiveness</p>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Visible Results</h3>
            <p className="text-gray-600">Experience noticeable improvements in your skin's health and appearance</p>
          </div>
        </div>
      </div>
    </section>
  )
}