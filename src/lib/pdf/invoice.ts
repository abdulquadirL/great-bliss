import PDFDocument from "pdfkit";
import { Order, AdminSettings } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

export async function generateInvoicePdf(
  order: Order,
  settings?: AdminSettings
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc.fontSize(20).text(settings?.businessName || "Your Company", { align: "left" });
    doc.fontSize(10).fillColor("gray").text(settings?.businessAddress || "", { align: "left" });
    doc.text(settings?.businessEmail || "", { align: "left" });
    doc.moveDown();

    doc.fontSize(16).fillColor("black").text("Invoice", { align: "right" });
    doc.fontSize(10).text(`Invoice ID: ${order.id}`, { align: "right" });
    doc.text(`Date: ${formatDate(order.createdAt)}`, { align: "right" });
    doc.moveDown();

    // Customer
    doc.fontSize(12).text("Bill To:", { underline: true });
    doc.text(order.customer.name);
    if (order.customer.email) doc.text(order.customer.email);
    if (order.customer.phone) doc.text(order.customer.phone);
    doc.moveDown();

    // Items
    doc.fontSize(12).text("Items", { underline: true });
    doc.moveDown(0.5);

    order.items.forEach((item) => {
      const unitPrice = item.priceType === "wholesale"
          ? item.product.wholesalePrice
          : item.product.retailPrice;

      doc.text(`${item.product.name} (${item.quantity} × ${formatPrice(unitPrice)})`);
      doc.text(`Subtotal: ${formatPrice(unitPrice * item.quantity)}`, { align: "right" });
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.text(`Total: ${formatPrice(order.total)}`, { align: "right", underline: true });

    // Footer note
    doc.moveDown();
    doc.fontSize(10).fillColor("gray").text(settings?.invoiceNotes || "Thank you for your purchase!");

    doc.end();
  });
}
