import { Order } from "@/types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function generateOrderId(): string {
  return `GB${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`
}

export function generateWhatsAppMessage(order: Order): string {
  const itemsList = order.items.map((item) => 
    `• ${item.product.name} (${item.priceType}) - ${item.quantity}x ${formatPrice(item.priceType === 'wholesale' ? item.product.wholesalePrice : item.product.retailPrice)}`
  ).join('\n')

  return `🛍️ *New Order from GreatBliss SkincareNG*

*Order ID:* ${order.id}
*Customer:* ${order.customer.name}
*Phone:* <Phone/> ${order.customer.phone}
*Email:* <Mail/> ${order.customer.email}

*Shipping Address:*<MapPin/>
${order.customer.address}
${order.customer.city}, ${order.customer.state}

*Items Ordered:*
${itemsList}

*Total Amount:* ${formatPrice(order.total)}
*Payment Method:* ${order.paymentMethod}

*Order Date:* ${formatDate(order.createdAt)}

Please process this order. Thank you! 🙏`
}

// export function sendWhatsAppNotification(order: Order, phoneNumber: string = '2348000000000') {
//   const message = generateWhatsAppMessage(order)
//   const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
//   window.open(whatsappUrl, '_blank')
// }

export const sendWhatsAppNotification = async (order: Order, phoneNumber: string = '2348140333474'): Promise<void> => {
  const message = generateWhatsAppMessage(order)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}