'use client'

import { CartItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'

interface CartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (productId: string, priceType: 'retail' | 'wholesale', quantity: number) => void
  onRemoveItem: (productId: string, priceType: 'retail' | 'wholesale') => void
  onCheckout: () => void
  total: number
}

export default function Cart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  total
}: CartProps) {
  const handleQuantityChange = (item: CartItem, delta: number) => {
    const newQuantity = item.quantity + delta
    const minQuantity = item.priceType === 'wholesale' ? item.product.minimumWholesaleQuantity : 1
    
    if (newQuantity >= minQuantity) {
      onUpdateQuantity(item.product.id, item.priceType, newQuantity)
    }
  }

  const getItemPrice = (item: CartItem) => {
    return item.priceType === 'wholesale' ? item.product.wholesalePrice : item.product.retailPrice
  }

  const getItemTotal = (item: CartItem) => {
    return getItemPrice(item) * item.quantity
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({items.length} items)
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${item.priceType}`} className="bg-white border rounded-lg p-4">
                  <div className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm leading-tight">{item.product.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.product.id, item.priceType)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={item.priceType === 'wholesale' ? 'default' : 'secondary'}>
                          {item.priceType}
                        </Badge>
                        <span className="text-sm font-medium">
                          {formatPrice(getItemPrice(item))} each
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item, -1)}
                            disabled={item.quantity <= (item.priceType === 'wholesale' ? item.product.minimumWholesaleQuantity : 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item, 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <span className="font-semibold">
                          {formatPrice(getItemTotal(item))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={onCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}