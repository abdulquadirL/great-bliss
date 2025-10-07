'use client'

import React, { useRef, useState } from 'react'
import { Order, AdminSettings, Product } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Printer, Share2, Mail, Eye } from 'lucide-react'

interface InvoiceModalProps {
  order: Order
  settings?: AdminSettings | null
}

/**
 * OrderInvoiceModal
 * - Client-only component for rendering an order invoice
 * - Supports: print (open window), download PDF (html2canvas + jsPDF if available), Web Share API, WhatsApp and email fallback
 * - Dynamically imports heavy libs so they are not bundled on server
 */
export default function OrderInvoiceModal({ order, settings }: InvoiceModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const invoiceRef = useRef<HTMLDivElement | null>(null)

  // calculate line unit price (fallback to product prices if order item price missing)
  const linePrice = (item: { price: number | undefined; product: Product; priceType: 'wholesale' | 'retail' }) => {
    if (typeof item.price === 'number') return item.price
    const p: Product = item.product
    return item.priceType === 'wholesale' ? p.wholesalePrice : p.retailPrice
  }

  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  // Print: open a new window and print the invoice HTML. This avoids needing global print CSS.
  const handlePrint = () => {
    if (!invoiceRef.current) return
    const html = invoiceRef.current.innerHTML

    const printWindow = window.open('', '_blank', 'noopener,noreferrer')
    if (!printWindow) {
      alert('Unable to open print window. Please allow popups for this site.')
      return
    }

    const styles = `
      <style>
        body{font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; padding: 20px; color: #111827}
        .invoice-container{max-width:800px; margin:0 auto}
        table{width:100%; border-collapse: collapse}
        th, td{padding:8px; border-bottom:1px solid #e5e7eb; text-align:left}
        .right{text-align:right}
        .title{font-size:20px; font-weight:600}
      </style>
    `

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          ${styles}
        </head>
        <body>
          <div class="invoice-container">
            ${html}
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    // give the new window a moment to render
    setTimeout(() => {
      printWindow.print()
      // optionally close the window after printing
      // printWindow.close()
    }, 500)
  }

  // Download PDF using html2canvas and jsPDF if available. Dynamic import to keep bundle small.
  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return
    setLoading(true)

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])

      const el = invoiceRef.current
      const canvas = await html2canvas(el, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`invoice-${order.id}.pdf`)
    } catch (err) {
      console.error('PDF generation failed', err)
      // fallback: open print window
      handlePrint()
    } finally {
      setLoading(false)
    }
  }

  // Share using Web Share API when available. Falls back to WhatsApp/email links.
  const handleShare = async () => {
    const title = `Invoice ${order.id}`
    const text = `Order ${order.id} - ${formatPrice(order.total)}\nCustomer: ${order.customer.name}`

    // try Web Share with files (requires generating PDF blob)
    if (navigator.share) {
      try {
        // try to dynamically create a PDF and share it as a file
        const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
          import('html2canvas'),
          import('jspdf')
        ])

        const canvas = await html2canvas(invoiceRef.current!, { scale: 2 })
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        const blob = pdf.output('blob')

        const file = new File([blob], `invoice-${order.id}.pdf`, { type: 'application/pdf' })

        // navigator.share supports files on some platforms (mobile)
        // Best-effort; if it fails, fallback to wa.me / mailto below.
        await navigator.share({ title, text, files: [file] as any })
        return
      } catch (err) {
        console.warn('navigator.share with files failed, falling back to share link', err)
      }

      // try simple text share
      try {
        await navigator.share({ title, text })
        return
      } catch (err) {
        console.warn('navigator.share fallback failed', err)
      }
    }

    // Fallback: open WhatsApp web with prefilled message
    const body = encodeURIComponent(
      `Invoice ${order.id}\nTotal: ${formatPrice(order.total)}\nCustomer: ${order.customer.name}\nDate: ${formatDate(order.createdAt)}`
    )
    const waUrl = `https://wa.me/?text=${body}`
    window.open(waUrl, '_blank')
  }

  // Email: open default mail app with prefilled invoice summary (also possible to attach PDF with server-side generation)
  const handleEmail = () => {
    const subject = encodeURIComponent(`Invoice ${order.id}`)
    const body = encodeURIComponent(`Hello ${order.customer.name},\n\nPlease find your invoice below:\n\nOrder: ${order.id}\nTotal: ${formatPrice(order.total)}\nDate: ${formatDate(order.createdAt)}\n\nThank you.`)
    const mailto = `mailto:${order.customer.email || ''}?subject=${subject}&body=${body}`
    window.location.href = mailto
  }

  return (
    <div>
      <Button onClick={openModal} variant="outline"><Printer className="mr-2" />View Invoice<Eye className="ml-2" /></Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal}></div>

          <div className="relative z-10 w-full max-w-3xl bg-white rounded shadow-lg overflow-auto" style={{ maxHeight: '90vh' }}>
            {/* Actions */}
            <div className="flex items-center justify-between px-6 py-3 border-b">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">Invoice</h3>
                <Badge variant="secondary">{order.id}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handlePrint} variant="ghost" title="Print invoice"><Printer className="mr-2" />Print</Button>
                <Button onClick={handleDownloadPdf} variant="ghost" title="Download PDF">{loading ? 'Generating...' : <><Download className="mr-2"/>PDF</>}</Button>
                <Button onClick={handleShare} variant="ghost" title="Share invoice"><Share2 className="mr-2"/>Share</Button>
                <Button onClick={handleEmail} variant="ghost" title="Email invoice"><Mail className="mr-2"/>Email</Button>
                <Button onClick={closeModal} variant="outline">Close</Button>
              </div>
            </div>

            {/* Invoice content */}
            <div id={`invoice-${order.id}`} ref={invoiceRef} className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-2xl font-bold">{settings?.businessName || 'Your Company'}</div>
                  <div className="text-sm text-gray-600">{settings?.businessAddress}</div>
                  <div className="text-sm text-gray-600">{settings?.businessEmail}</div>
                  <div className="text-sm text-gray-600">{settings?.businessPhone}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600">Invoice</div>
                  <div className="text-lg font-medium">{order.id}</div>
                  <div className="text-sm text-gray-600">{formatDate(order.createdAt)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-xs text-gray-500">Bill To</div>
                  <div className="font-medium">{order.customer.name}</div>
                  <div className="text-sm text-gray-600">{order.customer.email}</div>
                  <div className="text-sm text-gray-600">{order.customer.phone || ''}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Payment Method</div>
                  <div className="font-medium">{order.paymentMethod || '—'}</div>
                  <div className="text-xs text-gray-500 mt-2">Status</div>
                  <Badge variant={order.status === 'pending' ? 'destructive' : 'default'}>{order.status}</Badge>
                </div>
              </div>

              <table className="w-full mb-6">
                <thead>
                  <tr>
                    <th className="text-left text-sm text-gray-500">Item</th>
                    <th className="text-right text-sm text-gray-500">Unit</th>
                    <th className="text-right text-sm text-gray-500">Qty</th>
                    <th className="text-right text-sm text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item: { product: Product; priceType: 'wholesale' | 'retail'; quantity: number } | any) => (
                    <tr key={`${order.id}-${item.product.id}`}>
                      <td className="py-2">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-xs text-gray-500">{item.priceType}</div>
                      </td>
                      <td className="py-2 text-right">{formatPrice(linePrice(item))}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">{formatPrice(linePrice(item) * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-full md:w-1/3">
                  <div className="flex justify-between py-2"><span className="text-sm text-gray-600">Subtotal</span><strong>{formatPrice(order.subTotal ?? order.total)}</strong></div>
                  <div className="flex justify-between py-2"><span className="text-sm text-gray-600">Shipping</span><span>{formatPrice(order.shippingFee ?? 0)}</span></div>
                  <div className="flex justify-between py-2 border-t pt-2"><span className="text-sm">Total</span><strong className="text-lg">{formatPrice(order.total)}</strong></div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                {settings?.invoiceNotes || 'Thank you for your purchase!'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
