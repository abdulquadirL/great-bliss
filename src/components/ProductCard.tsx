'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye } from 'lucide-react'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, quantity: number, priceType: 'retail' | 'wholesale') => void
  onProductClick: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart, onProductClick }: ProductCardProps) {
  const [selectedPriceType, setSelectedPriceType] = useState<'retail' | 'wholesale'>('retail')

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    const quantity = selectedPriceType === 'wholesale' ? product.minimumWholesaleQuantity : 1
    onAddToCart(product, quantity, selectedPriceType)
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    onProductClick(product)
  }

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={handleViewDetails}>
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-xl">
          <Image
            src={product.image || ""}
            alt={product.name}
            className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-200"
            width={384}
            height={192}
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500">
              Featured
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Out of Stock
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          {/* <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p> */}
          
          <div className="space-y-2">
            {/* <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Retail Price:</span>
              <span className="font-semibold">{formatPrice(product.retailPrice)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Wholesale Price:</span>
              <span className="font-semibold text-green-600">{formatPrice(product.wholesalePrice)}</span>
            </div> */}
            
            <p className="text-xs text-gray-500">
              Min. wholesale quantity: {product.minimumWholesaleQuantity}
            </p>
          </div>

          {/* Price Type Selection */}
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Button
                variant={selectedPriceType === 'retail' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedPriceType('retail')
                }}
              >
                Retail
              </Button>
              <Button
                variant={selectedPriceType === 'wholesale' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedPriceType('wholesale')
                }}
              >
                Wholesale
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-bold">
                {formatPrice(selectedPriceType === 'wholesale' ? product.wholesalePrice : product.retailPrice)}
              </p>
              {selectedPriceType === 'wholesale' && (
                <p className="text-xs text-gray-500">
                  Min. {product.minimumWholesaleQuantity} units
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 space-y-2 gap-2">
        <Button
          className="w-full bg-green-200 rounded-lg"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
        
        <Button
          variant="outline"
          className="w-3/4"
          onClick={handleViewDetails}
        >
          <Eye className="h-4 w-4 mr-2" />
          View 
        </Button>
      </CardFooter>
    </Card>
  )
}