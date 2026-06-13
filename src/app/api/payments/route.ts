import { NextResponse } from "next/server";
import { createPaymentSchema } from "@/lib/schemas";
import { createPayment, listPayments } from "@/server/services/payments";

// GET /api/payments — list all payments (newest first).
export async function GET() {
  const payments = await listPayments();
  return NextResponse.json({ data: payments });
}

// POST /api/payments — record a payment + send confirmation.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const payment = await createPayment(parsed.data);
  return NextResponse.json({ data: payment }, { status: 201 });
}
