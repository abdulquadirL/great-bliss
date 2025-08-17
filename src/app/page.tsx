'use client'

import { useState, useEffect } from 'react'
import { Product, CartItem, Customer, Order } from '@/types'
import { productStorage, orderStorage } from '@/lib/storage'
import { generateOrderId, formatPrice, sendWhatsAppNotification } from '@/lib/utils'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductGrid from '@/components/ProductGrid'
import ProductDetails from '@/components/ProductDetails'
import Cart from '@/components/Cart'
import Checkout from '@/components/Checkout'
import { toast } from 'sonner'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setProducts(productStorage.getAll())
  }, [])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addToCart = (product: Product, quantity: number, priceType: 'retail' | 'wholesale') => {
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.priceType === priceType
    )

    if (existingItemIndex !== -1) {
      const updatedItems = [...cartItems]
      updatedItems[existingItemIndex].quantity += quantity
      setCartItems(updatedItems)
    } else {
      setCartItems([...cartItems, { product, quantity, priceType }])
    }

    toast.success(`${product.name} added to cart!`)
  }

  const updateCartItem = (productId: string, priceType: 'retail' | 'wholesale', quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, priceType)
      return
    }

    setCartItems(items =>
      items.map(item =>
        item.product.id === productId && item.priceType === priceType
          ? { ...item, quantity }
          : item
      )
    )
  }

  const removeFromCart = (productId: string, priceType: 'retail' | 'wholesale') => {
    setCartItems(items =>
      items.filter(item => !(item.product.id === productId && item.priceType === priceType))
    )
    toast.success('Item removed from cart')
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.priceType === 'wholesale' ? item.product.wholesalePrice : item.product.retailPrice
      return total + (price * item.quantity)
    }, 0)
  }

  const handleCheckout = async (customerData: Customer, paymentMethod: string) => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    const order: Order = {
      id: generateOrderId(),
      customer: customerData,
      items: cartItems,
      total: getTotalPrice(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentMethod,
      paymentStatus: 'pending'
    }

    try {
      orderStorage.add(order)
      
      // Send WhatsApp notification
      sendWhatsAppNotification(order)
      
      toast.success('Order placed successfully! Redirecting to WhatsApp...')
      
      clearCart()
      setIsCheckoutOpen(false)
      setIsCartOpen(false)
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
      console.error('Order submission error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main>
        <Hero />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
            <ProductGrid
              products={filteredProducts}
              onAddToCart={addToCart}
              onProductClick={setSelectedProduct}
            />
          </div>
        </section>
      </main>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartItem}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
        total={getTotalPrice()}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        total={getTotalPrice()}
        onSubmit={handleCheckout}
      />
    </div>
  )
}