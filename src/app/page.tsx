'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Product, CartItem, Customer, Order } from '@/types'
import { productStorage, orderStorage } from '@/lib/storage'
import { generateOrderId, sendWhatsAppNotification } from '@/lib/utils'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductGrid from '@/components/ProductGrid'
import ProductDetails from '@/components/ProductDetails'
import Cart from '@/components/Cart'
import Checkout from '@/components/Checkout'
import { toast } from 'sonner'
import { createClient } from '@/lib/utils/supabase/server'
import { cookies } from 'next/headers'

const CART_STORAGE_KEY = 'gb_cart'

  // const cookieStore = await cookies()
  // const supabase = createClient(cookieStore)

  // const { data: todos } = await supabase.from('todos').select()





export default function HomePage() {
  // State Management
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Load products and cart data
  useEffect(() => {
    try {
      // Load products
      const loadedProducts = productStorage.getAll()
      setProducts(loadedProducts)

      // Load cart from localStorage
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast.error('Failed to load products')
    }
  }, [])

  // Persist cart changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return products

    return products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    )
  }, [products, searchQuery])

  // Cart operations
  const addToCart = useCallback((product: Product, quantity: number, priceType: 'retail' | 'wholesale') => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.priceType === priceType
      )

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      }

      return [...prevItems, { product, quantity, priceType }]
    })

    toast.success(
      <div className="flex items-center gap-2">
        <span className="font-medium">{product.name}</span>
        <span>added to cart!</span>
      </div>
    )
  }, [])

  const updateCartItem = useCallback((productId: string, priceType: 'retail' | 'wholesale', quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, priceType)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId && item.priceType === priceType
          ? { ...item, quantity }
          : item
      )
    )
  }, [])

  const removeFromCart = useCallback((productId: string, priceType: 'retail' | 'wholesale') => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.product.id === productId && item.priceType === priceType))
    )
    toast.success('Item removed from cart')
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }, [])

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.priceType === 'wholesale' 
        ? item.product.wholesalePrice 
        : item.product.retailPrice
      return total + (price * item.quantity)
    }, 0)
  }, [cartItems])

  const handleCheckout = async (customerData: Customer, paymentMethod: string) => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    const order: Order = {
      id: generateOrderId(),
      customer: customerData,
      items: cartItems,
      subTotal: getTotalPrice(),
      tax: 0,
      shippingFee: 0,
      total: getTotalPrice(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentMethod,
      paymentStatus: 'pending'
    }

    try {
      orderStorage.add(order)
      
      // Non-blocking notification
      sendWhatsAppNotification(order).catch(err => 
        console.warn('WhatsApp notification failed:', err)
      )
      
      toast.success('Order placed successfully!', {
        description: 'Redirecting to WhatsApp...',
        duration: 5000,
      })
      
      clearCart()
      setIsCheckoutOpen(false)
      setIsCartOpen(false)
    } catch (error) {
      console.error('Order submission error:', error)
      toast.error('Failed to place order', {
        description: 'Please try again or contact support',
      })
    }
  }

  return (
    <div className="min-h-screen mx-auto p-4 bg-background">
      <Header
        cartItemsCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="pb-16">
         <Hero/>  
        
        
        <section className="py-16 px-8">
          <div className="container bg-white mx-auto">
            <h2 className="text-lg md:text-3xl font-bold text-center mb-12">
              Our Premium Skincare Collection
            </h2>
            <ProductGrid
              products={filteredProducts}
              onAddToCart={addToCart}
              onProductClick={setSelectedProduct}
            />
          </div>
        </section>
      </main>

      {/* Modals */}
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