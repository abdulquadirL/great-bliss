import { NextResponse } from "next/server";
import { sendInvoiceEmail } from "@/lib/email/sendInvoice";
import { orderStorage, settingsStorage } from "@/lib/storage";
import { Order } from "@/types";

export async function POST(req: Request) {
  try {
    const order: Order = await req.json();

    // Save order in DB/storage
    orderStorage.save([order]);

    // Fetch admin settings
    const settings = settingsStorage.get();

    // Send invoice email
    if (order.customer.email) {
      await sendInvoiceEmail(order, settings);
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Order creation error", err);
    return NextResponse.json({ error: "Order processing failed" }, { status: 500 });
  }
}
