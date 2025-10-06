'use client'

import { Product } from '@/types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product, quantity: number, priceType: 'retail' | 'wholesale') => void
  onProductClick: (product: Product) => void
}

export default function ProductGrid({ products, onAddToCart, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">No products found</p>
      </div>
    )
  }

  return (
    <div id="products" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  )
}