'use client'

import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronRight, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Types for our categories and brands
type Category = {
  id: string
  name: string
  icon: string
  count: number
}

type Brand = {
  id: string
  name: string
  logo: string
  description: string
}

// Sample data - Replace with your actual data
const categories: Category[] = [
  { id: '1', name: 'Cleansers', icon: '🧴', count: 12 },
  { id: '2', name: 'Moisturizers', icon: '💧', count: 15 },
  { id: '3', name: 'Serums', icon: '✨', count: 8 },
  { id: '4', name: 'Masks', icon: '🎭', count: 10 },
  { id: '5', name: 'Sunscreen', icon: '☀️', count: 6 },
]

const brands: Brand[] = [
  { id: '1', name: 'Simple', logo: '/brands/B3.png', description: 'Natural beauty solutions' },
  { id: '2', name: 'Lumina', logo: '/brands/SimpleGinger.png', description: 'Science-backed skincare' },
  { id: '3', name: 'Herbal Essence', logo: '/brands/Simple3.png', description: 'Organic formulations' },
]

export default function Hero() {
  const [currentBrand, setCurrentBrand] = useState(0)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Auto-rotate brands
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBrand((prev) => (prev + 1) % brands.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products')
    productsSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[60vh] md:min-h-[80vh] bg-gradient-to-r from-gray-50 to-primary/10">
      
      {/* Mobile Category Toggle */}

      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className='md:hidden fixed left-4 top-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg'
        aria-label="Toggle Categories"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Categories Sidebar - Mobile Responsive */}
      <div className={`
          fixed md:absolute left-0 top-0 md:top-1/2 h-full md:h-auto w-[280px]
          md:-translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-r-2xl shadow-lg
          transition-transform duration-300 z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      >
        <div className="p-4 pt-16 md:pt-4">
          <h3 className='text-lg font-semibold mb-4 text-gray-900'>Categories</h3>
          <div className='space-y-2'>
            {categories.map((category) => (
              <motion.div
                key={category.id}
                className='relative flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors'
                onHoverStart={() => setHoveredCategory(category.id)}
                onHoverEnd={() => setHoveredCategory(null)}

              >
                <span className='text-2xl'>{category.icon}</span>
                <div className='flex-1'>
                  <h4 className='font-medium text-gray-900'>{category.name}</h4>
                  <p className='text-sm text-gray-500'>{category.count} products</p>
                </div>
                <ChevronRight className='w-4 h-4 text-gray-400'/>

               {/* Category Hover Detail - Hidden on Mobile */}
               {hoveredCategory === category.id && (
                <motion.div
                  className='hidden md:block absolute left-full top-0 ml-2 bg-white rounded-lg shadow-xl p-4 w-[300px] z-10'
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h5 className='font-semibold mb-2' > {category.name}</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Explore our collection of {category.name}
                  </p>
                  <Button variant="outline" size="sm">
                      View All
                  </Button>

                </motion.div>
               )}

              </motion.div>
            )
            )}
          </div>
        </div>
      </div>

      
      {/* Categories Sidebar */}
      {/* <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-r-2xl shadow-lg p-4 max-w-[280px]">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="relative flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
              onHoverStart={() => setHoveredCategory(category.id)}
              onHoverEnd={() => setHoveredCategory(null)}
            >
              <span className="text-2xl">{category.icon}</span>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <p className="text-sm text-gray-500">{category.count} products</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              
              {hoveredCategory === category.id && (
                <motion.div
                  className="hidden md:block absolute left-full top-0 ml-2 bg-white rounded-lg shadow-xl p-4 w-[300px] z-10"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h5 className="font-semibold mb-2">{category.name}</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Explore our collection of {category.name.toLowerCase()}
                  </p>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        
      </div> */}

      {/* Main Content */}
       <div className="container mx-auto px-4 py-10 py-10 md:py-20 md:pl-[300px]">
        {/* Brand Slider */}
        <div className=" mt-8 md:mt-16 relative h-[250px] md:h-[400px] w-full overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentBrand}
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ type: 'tween', duration: 0.8 }}
              className="relative w-full h-full"
            >
              <Image
                  src={brands[currentBrand].logo}
                  alt={brands[currentBrand].name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={currentBrand === 0} // Prioritize first image
                  quality={90}
                />
              {/* Overlay with CTA */}
              <div className='absolute inset-0 flex items-center justify-center bg-black/10'>
                {/* <Button
                  size="lg"
                  onClick={scrollToProducts}
                  className='text-base md:text-lg px-6 md:px-8'
                >
                  View All
                </Button> */}
              </div>

              <Button size="lg" onClick={scrollToProducts} className="text-sm text-white md:text-lg px-8 absolute bottom-14 md:bottom-12 left-2/3 -translate-x-1/2 border rounded-2xl bg-transparent hover:bg-primary/90">
                Shop Now
              </Button>
            </motion.div>
          </AnimatePresence>

          {/* Brand Navigation Dots */}
          {/* <div className="absolute bottom-4 right-4 flex gap-2">
            {brands.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBrand(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentBrand === idx ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div> */}

          {/* Navigation Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3 z-10">
            <div className="flex gap-2">
              {brands.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBrand(idx)}
                  className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full transition-colors ${
                    currentBrand === idx 
                      ? 'bg-white scale-110' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to brand ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
        />
      )}
    </section>
  )
}