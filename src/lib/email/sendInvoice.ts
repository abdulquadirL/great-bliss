import nodemailer from "nodemailer";
import { Order, AdminSettings } from "@/types";
import { generateInvoicePdf } from "@/lib/pdf/invoice";

export async function sendInvoiceEmail(
  order: Order,
  settings: AdminSettings
) {
  // Configure transporter (example: Gmail SMTP)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Generate PDF buffer
  const pdfBuffer = await generateInvoicePdf(order, settings);

  // Send email with PDF attached
  await transporter.sendMail({
    from: settings.businessEmail || process.env.SMTP_USER,
    to: order.customer.email,
    subject: `Invoice ${order.id} - ${settings.businessName || "Store"}`,
    text: `Dear ${order.customer.name},\n\nThank you for your order. Attached is your invoice.\n\nTotal: ${order.total}`,
    attachments: [
      {
        filename: `invoice-${order.id}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
