'use client'

import { useState } from 'react'
import { CartItem, Customer } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { CreditCard, MapPin, User, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'

interface CheckoutProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  total: number
  onSubmit: (customer: Customer, paymentMethod: string) => Promise<void>
}

export default function Checkout({ isOpen, onClose, cartItems, total, onSubmit }: CheckoutProps) {
  const [customerData, setCustomerData] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState('transfer')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof Customer, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!customerData.name || !customerData.email || !customerData.phone || !customerData.address || !customerData.city || !customerData.state) {
      toast.error('Please fill in all required fields')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(customerData, paymentMethod)
      // Reset form
      setCustomerData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: ''
      })
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsSubmitting(false)
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
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Checkout</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.priceType}`} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={item.priceType === 'wholesale' ? 'default' : 'secondary'} className="text-xs">
                        {item.priceType}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {formatPrice(getItemPrice(item))} × {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-medium">{formatPrice(getItemTotal(item))}</span>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <Input
                    type="text"
                    value={customerData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1"> <Mail/>Email Address *</label>
                  <Input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1"><Phone/>Phone Number *</label>
                <Input
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+234 800 000 0000"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Address *</label>
                <Input
                  type="text"
                  value={customerData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street, Area Name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <Input
                    type="text"
                    value={customerData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Lagos"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <Input
                    type="text"
                    value={customerData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Lagos State"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary"
                  />
                  <span>Bank Transfer</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary"
                  />
                  <span>Debit/Credit Card</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
            </Button>
            
            <p className="text-sm text-gray-600 text-center">
              By placing this order, you agree to our Terms of Service and Privacy Policy.
              You will receive a WhatsApp confirmation message shortly.
            </p>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}