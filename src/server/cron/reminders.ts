// Reminder logic.
// Rule: after the 15th, for the current month, any member who has NOT paid
// (no payment row, or a row with null amount) and has NOT been notified ->
// send a reminder, set notified = true, record reminderDate.
//
// The daily schedule (production) calls this with the date gate. A manual
// trigger can pass { force: true } to run regardless of the date.

import { prisma } from "@/lib/db";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { currentMonthValue, formatMonth } from "@/lib/months";

export type ReminderResult = {
  ran: boolean;
  month: string;
  checked: number;
  remindersSent: number;
  reason?: string;
};

export async function runReminderCheck(
  now: Date = new Date(),
  opts: { force?: boolean } = {},
): Promise<ReminderResult> {
  const month = currentMonthValue(now);

  if (!opts.force && now.getDate() < 15) {
    return {
      ran: false,
      month,
      checked: 0,
      remindersSent: 0,
      reason: "Before the 15th — reminders not due yet.",
    };
  }

  const persons = await prisma.person.findMany({
    include: { payments: { where: { month } } },
  });

  let remindersSent = 0;

  for (const person of persons) {
    const payment = person.payments[0];
    const hasPaid = payment != null && payment.amount != null;
    const alreadyNotified = payment != null && payment.notified;

    if (hasPaid || alreadyNotified) continue;

    const message =
      `Assalam o Alaikum ${person.name}, this is a reminder that your ` +
      `contribution for ${formatMonth(month)} is still pending. Please pay ` +
      `at your earliest convenience. JazakAllah.`;
    await sendWhatsAppMessage(person.whatsappNo, message);

    await prisma.payment.upsert({
      where: { personId_month: { personId: person.id, month } },
      create: { personId: person.id, month, notified: true, reminderDate: now },
      update: { notified: true, reminderDate: now },
    });

    remindersSent++;
  }

  return { ran: true, month, checked: persons.length, remindersSent };
}
