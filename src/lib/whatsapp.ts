// WhatsApp messaging boundary.
// Demo: simulate (log only, free). Live: forward to the always-on WhatsApp
// worker (scripts/whatsapp-worker.mjs) over HTTP.
// See context/architecture.md for the messaging model.

export async function sendWhatsAppMessage(
  to: string,
  message: string,
): Promise<void> {
  const live = process.env.WHATSAPP_MODE === "live";

  if (!live) {
    console.log(`[WhatsApp SIMULATED] -> ${to}: ${message}`);
    return;
  }

  const workerUrl = process.env.WHATSAPP_WORKER_URL ?? "http://localhost:4000";

  const res = await fetch(`${workerUrl}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, message }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`WhatsApp worker send failed (${res.status}): ${body}`);
  }
}
