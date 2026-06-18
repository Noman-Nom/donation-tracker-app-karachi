import { NextResponse } from "next/server";

const WORKER_URL = process.env.WHATSAPP_WORKER_URL ?? "http://localhost:4000";

export async function GET() {
  try {
    const res = await fetch(`${WORKER_URL}/qr`, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ qr: null }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ qr: null }, { status: 503 });
  }
}
