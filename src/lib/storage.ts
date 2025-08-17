'use client'

import { Product, Order, AdminSettings } from '@/types'

const STORAGE_KEYS = {
  PRODUCTS: 'greatbliss_products',
  ORDERS: 'greatbliss_orders',
  SETTINGS: 'greatbliss_settings',
  IMAGES: 'greatbliss_images'
} as const

// Products Management
export const productStorage = {
  getAll: (): Product[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    return stored ? JSON.parse(stored) : getDefaultProducts()
  },

  save: (products: Product[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
  },

  add: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    const products = productStorage.getAll()
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    products.push(newProduct)
    productStorage.save(products)
    return newProduct
  },

  update: (id: string, updates: Partial<Product>): Product | null => {
    const products = productStorage.getAll()
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return null
    
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date()
    }
    productStorage.save(products)
    return products[index]
  },

  delete: (id: string): boolean => {
    const products = productStorage.getAll()
    const filtered = products.filter(p => p.id !== id)
    if (filtered.length === products.length) return false
    productStorage.save(filtered)
    return true
  },

  getById: (id: string): Product | null => {
    const products = productStorage.getAll()
    return products.find(p => p.id === id) || null
  }
}

// Orders Management
export const orderStorage = {
  getAll: (): Order[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS)
    return stored ? JSON.parse(stored).map((order: any) => ({
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt)
    })) : []
  },

  save: (orders: Order[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
  },

  add: (order: Order): void => {
    const orders = orderStorage.getAll()
    orders.push(order)
    orderStorage.save(orders)
  },

  update: (id: string, updates: Partial<Order>): boolean => {
    const orders = orderStorage.getAll()
    const index = orders.findIndex(o => o.id === id)
    if (index === -1) return false
    
    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date()
    }
    orderStorage.save(orders)
    return true
  },

  getById: (id: string): Order | null => {
    const orders = orderStorage.getAll()
    return orders.find(o => o.id === id) || null
  }
}

// Settings Management
export const settingsStorage = {
  get: (): AdminSettings => {
    if (typeof window === 'undefined') return getDefaultSettings()
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return stored ? JSON.parse(stored) : getDefaultSettings()
  },

  save: (settings: AdminSettings): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  }
}

// Image Management
export const imageStorage = {
  save: (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(STORAGE_KEYS.IMAGES) || '{}'
          const images = JSON.parse(stored)
          images[imageId] = imageData
          localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images))
        }
        
        resolve(imageId)
      }
      reader.readAsDataURL(file)
    })
  },

  get: (imageId: string): string | null => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(STORAGE_KEYS.IMAGES)
    if (!stored) return null
    const images = JSON.parse(stored)
    return images[imageId] || null
  },

  delete: (imageId: string): void => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEYS.IMAGES)
    if (!stored) return
    const images = JSON.parse(stored)
    delete images[imageId]
    localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images))
  }
}

function getDefaultProducts(): Product[] {
  return [
    {
      id: 'prod_1',
      name: 'Brightening Vitamin C Serum',
      description: 'A powerful brightening serum with 20% Vitamin C to reduce dark spots and even skin tone.',
      category: 'Serums',
      retailPrice: 15000,
      wholesalePrice: 10000,
      minimumWholesaleQuantity: 6,
      image: '/api/placeholder/300/300',
      images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
      inStock: true,
      stockQuantity: 50,
      benefits: ['Brightens skin', 'Reduces dark spots', 'Anti-aging', 'Evens skin tone'],
      ingredients: ['Vitamin C', 'Hyaluronic Acid', 'Vitamin E', 'Niacinamide'],
      createdAt: new Date(),
      updatedAt: new Date(),
      featured: true
    },
    {
      id: 'prod_2',
      name: 'Hydrating Hyaluronic Acid Moisturizer',
      description: 'Deep hydrating moisturizer with hyaluronic acid for all skin types.',
      category: 'Moisturizers',
      retailPrice: 12000,
      wholesalePrice: 8000,
      minimumWholesaleQuantity: 6,
      image: '/api/placeholder/300/300',
      images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
      inStock: true,
      stockQuantity: 30,
      benefits: ['Deep hydration', 'Plumps skin', 'Reduces fine lines', 'Non-greasy'],
      ingredients: ['Hyaluronic Acid', 'Ceramides', 'Glycerin', 'Peptides'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'prod_3',
      name: 'Gentle Cleansing Foam',
      description: 'Gentle yet effective cleansing foam that removes impurities without stripping the skin.',
      category: 'Cleansers',
      retailPrice: 8000,
      wholesalePrice: 5500,
      minimumWholesaleQuantity: 8,
      image: '/api/placeholder/300/300',
      images: ['/api/placeholder/300/300', '/api/placeholder/300/300'],
      inStock: true,
      stockQuantity: 45,
      benefits: ['Gentle cleansing', 'Maintains pH balance', 'Removes makeup', 'Suitable for sensitive skin'],
      ingredients: ['Coconut Oil', 'Aloe Vera', 'Chamomile Extract', 'Green Tea'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
}

function getDefaultSettings(): AdminSettings {
  return {
    businessName: 'GreatBliss SkincareNG',
    businessPhone: '+234 902 550 0817',
    businessEmail: 'blisssiraoya@yahoo.com',
    businessAddress: 'Lugbe, Abuja, Nigeria',
    whatsappNumber: '2349025500817',
    currency: 'NGN',
    taxRate: 0,
    shippingFee: 2000,
    minimumOrderAmount: 5000,
    storeHours: '',
    privacyPolicy: '',
    returnPolicy: '',
    shippingPolicy: '',
  }
}