// WhatsApp messaging boundary.
// Demo: simulate (log only, free). Production: Baileys with a session number.
// See context/architecture.md for the messaging invariant.

export async function sendWhatsAppMessage(
  to: string,
  message: string,
): Promise<void> {
  const simulate = process.env.WHATSAPP_MODE !== "live";

  if (simulate) {
    console.log(`[WhatsApp SIMULATED] -> ${to}: ${message}`);
    return;
  }

  // TODO: wire @whiskeysockets/baileys here once a session number is provisioned.
  throw new Error("Live WhatsApp (Baileys) not yet implemented");
}
