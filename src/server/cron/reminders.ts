// Daily reminder check.
// After the 15th: if amount is blank AND notified = false ->
// send reminder, set notified = true, record reminderDate.
// See context/project-overview.md (reminder logic) before implementing.

import { prisma } from "@/lib/db";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function runReminderCheck(now: Date = new Date()): Promise<void> {
  if (now.getDate() < 15) return;

  // TODO: implement per spec once context files are finalized.
  void prisma;
  void sendWhatsAppMessage;
}
