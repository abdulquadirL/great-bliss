// 'use client'

// import { Button } from '@/components/ui/button'
// import React from 'react'
// import { Inter } from 'next/font/google'  
// const inter = Inter({ subsets: ['latin'] })

// export default function Hero() {
//   const scrollToProducts = () => {
//     const productsSection = document.getElementById('products')
//     if (productsSection) {
//       productsSection.scrollIntoView({ behavior: 'smooth' })
//     }
//   }

//   return (
//     <section className="relative bg-gradient-to-r from-gray-50 to-yellow-300 py-20">
//       <div className="container mx-auto px-4 text-center ">
//         <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
//           Premium Skincare for 
//           <span className="text-primary block"> Radiant Beauty</span>
//         </h1>
        
//         <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//           Discover our collection of premium skincare products designed to nourish, 
//           protect, and enhance your natural beauty with scientifically-proven ingredients.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//           <Button size="lg" onClick={scrollToProducts} className="text-lg px-8 py-3">
//             Shop Now
//           </Button>
//           <Button variant="outline" size="lg" className="text-lg px-8 py-3">
//             Learn More
//           </Button>
//         </div>

//         <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="text-center">
//             <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
//               <span className="text-2xl">🌿</span>
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Natural Ingredients</h3>
//             <p className="text-gray-600">Carefully selected natural and organic ingredients for healthy skin</p>
//           </div>

//           <div className="text-center">
//             <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
//               <span className="text-2xl">🧪</span>
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Scientifically Proven</h3>
//             <p className="text-gray-600">Formulated with clinically tested ingredients for maximum effectiveness</p>
//           </div>

//           <div className="text-center">
//             <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
//               <span className="text-2xl">✨</span>
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Visible Results</h3>
//             <p className="text-gray-600">Experience noticeable improvements in your skin's health and appearance</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

'use client'

import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
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
    <section className="relative min-h-[80vh] bg-gradient-to-r from-gray-50 to-primary/10">
      {/* Categories Sidebar */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-r-2xl shadow-lg p-4 max-w-[280px]">
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
                  className="absolute left-full top-0 ml-2 bg-white rounded-lg shadow-xl p-4 w-[300px] z-10"
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
        
      </div>

      {/* Main Content */}
       <div className="container mx-auto px-4 py-20 pl-[300px]">
        {/*<div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Premium Skincare for
            <span className="text-primary block">Radiant Beauty</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Discover our collection of premium skincare products designed to nourish,
            protect, and enhance your natural beauty.
          </p>

          <div className="flex gap-4">
            <Button size="lg" onClick={scrollToProducts} className="text-lg px-8">
              Shop Now
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div> */}

        {/* Brand Slider */}
        <div className="mt-16 relative h-[250px] md:h-[400px] overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm p-8">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentBrand}
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ type: 'tween', duration: 0.8 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <Image
                  src={brands[currentBrand].logo}
                  alt={brands[currentBrand].name}
                  fill
                  className="object-fit w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={currentBrand === 0} // Prioritize first image
                  quality={100}
                />
              {/* <div className="relative w-32 h-32">
                
              </div> */}
              {/* <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {brands[currentBrand].name}
                </h3>
                <p className="text-gray-600">
                  {brands[currentBrand].description}
                </p>
              </div> */}
              <Button size="lg" onClick={scrollToProducts} className="text-lg px-8">
                Shop Now
              </Button>
            </motion.div>
          </AnimatePresence>

          {/* Brand Navigation Dots */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {brands.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBrand(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentBrand === idx ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}