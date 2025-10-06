import { notFound } from "next/navigation";
import { orderStorage, settingsStorage } from "@/lib/storage";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const order = orderStorage.getById(params.id);
  const settings = settingsStorage.get();

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{settings.businessName || "Your Company"}</h1>
          <p className="text-sm text-gray-600">{settings.businessAddress}</p>
          <p className="text-sm text-gray-600">{settings.businessEmail}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">Invoice</h2>
          <p className="text-sm">Invoice ID: {order.id}</p>
          <p className="text-sm">Date: {formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <h3 className="font-semibold">Bill To:</h3>
        <p>{order.customer.name}</p>
        {order.customer.email && <p>{order.customer.email}</p>}
        {order.customer.phone && <p>{order.customer.phone}</p>}
      </div>

      {/* Items */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Items</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Unit Price</th>
              <th className="text-right py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any, idx: number) => {
              const unitPrice =
                item.price ||
                (item.priceType === "wholesale"
                  ? item.product.wholesalePrice
                  : item.product.retailPrice);

              return (
                <tr key={idx} className="border-b">
                  <td className="py-2">{item.product.name}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{formatPrice(unitPrice)}</td>
                  <td className="py-2 text-right">{formatPrice(unitPrice * item.quantity)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-end mb-6">
        <p className="text-xl font-bold">Total: {formatPrice(order.total)}</p>
      </div>

      {/* Footer */}
      <p className="text-gray-600 text-sm mb-6">
        {settings.invoiceNotes || "Thank you for your purchase!"}
      </p>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={() => window.print()}>Print</Button>
        <Button
          variant="secondary"
          onClick={() =>
            window.open(`/api/orders/${order.id}/invoice.pdf`, "_blank")
          }
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
}
