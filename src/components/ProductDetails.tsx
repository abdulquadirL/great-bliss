'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, Minus, ShoppingCart } from 'lucide-react'
import Image from 'next/image'

interface ProductDetailsProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product, quantity: number, priceType: 'retail' | 'wholesale') => void
}

export default function ProductDetails({ product, onClose, onAddToCart }: ProductDetailsProps) {
  const [selectedPriceType, setSelectedPriceType] = useState<'retail' | 'wholesale'>('retail')
  const [quantity, setQuantity] = useState(1)

  const minQuantity = selectedPriceType === 'wholesale' ? product.minimumWholesaleQuantity : 1

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= minQuantity && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity)
    }
  }

  const handlePriceTypeChange = (priceType: 'retail' | 'wholesale') => {
    setSelectedPriceType(priceType)
    if (priceType === 'wholesale') {
      setQuantity(Math.max(quantity, product.minimumWholesaleQuantity))
    } else {
      setQuantity(1)
    }
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedPriceType)
    onClose()
  }

  const currentPrice = selectedPriceType === 'wholesale' ? product.wholesalePrice : product.retailPrice
  const totalPrice = currentPrice * quantity

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${product.name}`}
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">{product.name}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close product details">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg"
                  width={384}
                  height={320}
                  priority
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
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-20 h-20 object-cover rounded border cursor-pointer hover:border-primary"
                      width={80}
                      height={80}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <Badge variant="outline" className="mb-2">
                  {product.category}
                </Badge>
                <p className="text-gray-600">{product.description}</p>
              </div>
              {/* Benefits */}
              {product.benefits?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Key Benefits:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {product.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Ingredients */}
              {product.ingredients?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Key Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="secondary">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {/* Stock Info */}
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm">
                  <span className="font-medium">Stock: </span>
                  {product.inStock ? `${product.stockQuantity} units available` : 'Out of stock'}
                </p>
              </div>
              {/* Pricing */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Retail Price</p>
                    <p className="text-lg font-semibold">{formatPrice(product.retailPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Wholesale Price</p>
                    <p className="text-lg font-semibold text-green-600">{formatPrice(product.wholesalePrice)}</p>
                    <p className="text-xs text-gray-500">Min. {product.minimumWholesaleQuantity} units</p>
                  </div>
                </div>
                {/* Price Type Selection */}
                <div className="flex gap-2">
                  <Button
                    variant={selectedPriceType === 'retail' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handlePriceTypeChange('retail')}
                    aria-pressed={selectedPriceType === 'retail'}
                  >
                    Retail
                  </Button>
                  <Button
                    variant={selectedPriceType === 'wholesale' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handlePriceTypeChange('wholesale')}
                    aria-pressed={selectedPriceType === 'wholesale'}
                  >
                    Wholesale
                  </Button>
                </div>
                {/* Quantity Selection */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= minQuantity}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stockQuantity}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {/* Total Price */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                {/* Add to Cart Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  aria-disabled={!product.inStock}
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}