import { NextResponse } from "next/server";

const WORKER_URL = process.env.WHATSAPP_WORKER_URL ?? "http://localhost:4000";

export async function GET() {
  try {
    const res = await fetch(`${WORKER_URL}/status`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { connected: false, awaitingScan: false, offline: true },
      { status: 503 },
    );
  }
}
