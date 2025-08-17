'use client'

import { useState, useEffect } from 'react'
import { Product, Order, AdminSettings, Analytics } from '@/types'
import { productStorage, orderStorage, settingsStorage } from '@/lib/storage'
import { formatPrice, formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, ShoppingCart, Users, DollarSign, Plus, Edit, Trash2, Eye } from 'lucide-react'
import ProductManager from '@/components/admin/ProductManager'
import OrderManager from '@/components/admin/OrderManager'
import SettingsManager from '@/components/admin/SettingsManager'
import { toast } from 'sonner'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [settings, setSettings] = useState<AdminSettings>()
  const [analytics, setAnalytics] = useState<Analytics>()
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const loadedProducts = productStorage.getAll()
    const loadedOrders = orderStorage.getAll()
    const loadedSettings = settingsStorage.get()

    setProducts(loadedProducts)
    setOrders(loadedOrders)
    setSettings(loadedSettings)

    // Calculate analytics
    const analytics: Analytics = {
      totalOrders: loadedOrders.length,
      totalRevenue: loadedOrders.reduce((sum, order) => sum + order.total, 0),
      totalCustomers: new Set(loadedOrders.map(order => order.customer.email)).size,
      totalProducts: loadedProducts.length,
      recentOrders: loadedOrders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
      topProducts: getTopProducts(loadedOrders, loadedProducts),
      monthlyRevenue: getMonthlyRevenue(loadedOrders)
    }

    setAnalytics(analytics)
  }

  const getTopProducts = (orders: Order[], products: Product[]) => {
    const productStats = new Map()

    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.product.id
        if (!productStats.has(key)) {
          productStats.set(key, {
            product: item.product,
            orderCount: 0,
            revenue: 0
          })
        }

        const stats = productStats.get(key)
        stats.orderCount += item.quantity
        stats.revenue += (item.priceType === 'wholesale' ? item.product.wholesalePrice : item.product.retailPrice) * item.quantity
      })
    })

    return Array.from(productStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }

  const getMonthlyRevenue = (orders: Order[]) => {
    const monthlyData = new Map()
    const last6Months = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toISOString().substring(0, 7)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      monthlyData.set(monthKey, { month: monthName, revenue: 0 })
      last6Months.push(monthKey)
    }

    orders.forEach(order => {
      const orderMonth = new Date(order.createdAt).toISOString().substring(0, 7)
      if (monthlyData.has(orderMonth)) {
        monthlyData.get(orderMonth).revenue += order.total
      }
    })

    return last6Months.map(month => monthlyData.get(month))
  }

  const handleProductUpdate = () => {
    loadData()
    toast.success('Products updated successfully')
  }

  const handleOrderUpdate = () => {
    loadData()
    toast.success('Orders updated successfully')
  }

  const handleSettingsUpdate = (newSettings: AdminSettings) => {
    settingsStorage.save(newSettings)
    setSettings(newSettings)
    toast.success('Settings updated successfully')
  }

  if (!analytics) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">GreatBliss Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your e-commerce store</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(analytics.totalRevenue)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalProducts}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders and Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded">
                        <div>
                          <p className="font-medium">{order.customer.name}</p>
                          <p className="text-sm text-gray-600">{order.id}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(order.total)}</p>
                          <Badge variant={order.status === 'pending' ? 'destructive' : 'default'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topProducts.map((item, index) => (
                      <div key={item.product.id} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-600">{item.orderCount} sold</p>
                          </div>
                        </div>
                        <p className="font-medium">{formatPrice(item.revenue)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <ProductManager
              products={products}
              onUpdate={handleProductUpdate}
            />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManager
              orders={orders}
              onUpdate={handleOrderUpdate}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManager
              settings={settings!}
              onUpdate={handleSettingsUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}