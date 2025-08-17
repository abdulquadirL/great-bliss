'use client'

import { useState } from 'react'
import { Order } from '@/types'
import { orderStorage } from '@/lib/storage'
import { formatPrice, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface OrderManagerProps {
  orders: Order[]
  onUpdate: () => void
}

export default function OrderManager({ orders, onUpdate }: OrderManagerProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (orderStorage.update(orderId, { status })) {
      toast.success(`Order status updated to ${status}`)
      onUpdate()
    } else {
      toast.error('Failed to update order status')
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'destructive'
      case 'confirmed': return 'default'
      case 'processing': return 'secondary'
      case 'shipped': return 'outline'
      case 'delivered': return 'default'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <XCircle className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{order.id}</h3>
                  <p className="text-gray-600">{order.customer.name} • {order.customer.phone}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                
                <div className="text-right space-y-2">
                  <p className="text-xl font-bold">{formatPrice(order.total)}</p>
                  <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Items Ordered:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.product.name} ({item.priceType}) × {item.quantity}</span>
                        <span>{formatPrice((item.priceType === 'wholesale' ? item.product.wholesalePrice : item.product.retailPrice) * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-1">Shipping Address:</h5>
                    <p className="text-gray-600">
                      {order.customer.address}<br />
                      {order.customer.city}, {order.customer.state}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-1">Payment Method:</h5>
                    <p className="text-gray-600">{order.paymentMethod}</p>
                    <p className="text-sm">Status: {order.paymentStatus}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  
                  {order.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                    >
                      Confirm Order
                    </Button>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'processing')}
                    >
                      Start Processing
                    </Button>
                  )}
                  
                  {order.status === 'processing' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                    >
                      Mark as Shipped
                    </Button>
                  )}
                  
                  {order.status === 'shipped' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {statusFilter === 'all' ? 'No orders found.' : `No ${statusFilter} orders found.`}
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Details - {selectedOrder.id}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                ×
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.customer.phone}</p>
                    <p><span className="font-medium">Address:</span> {selectedOrder.customer.address}</p>
                    <p><span className="font-medium">City:</span> {selectedOrder.customer.city}</p>
                    <p><span className="font-medium">State:</span> {selectedOrder.customer.state}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Status:</span> 
                      <Badge variant={getStatusColor(selectedOrder.status)} className="ml-2">
                        {selectedOrder.status}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                    <p><span className="font-medium">Payment Status:</span> {selectedOrder.paymentStatus}</p>
                    <p><span className="font-medium">Order Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                    <p><span className="font-medium">Last Updated:</span> {formatDate(selectedOrder.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">{item.product.name}</h5>
                        <Badge variant={item.priceType === 'wholesale' ? 'default' : 'secondary'}>
                          {item.priceType}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Price:</span><br />
                          {formatPrice(item.priceType === 'wholesale' ? item.product.wholesalePrice : item.product.retailPrice)}
                        </div>
                        <div>
                          <span className="text-gray-600">Quantity:</span><br />
                          {item.quantity}
                        </div>
                        <div>
                          <span className="text-gray-600">Total:</span><br />
                          <span className="font-medium">
                            {formatPrice((item.priceType === 'wholesale' ? item.product.wholesalePrice : item.product.retailPrice) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}