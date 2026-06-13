import { prisma } from "@/lib/db";
import type { CreatePaymentInput } from "@/lib/schemas";
import { formatMonth } from "@/lib/months";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

// Record (or update) a payment for a member in a given month, then send a
// confirmation. One payment per (person, month) — enforced via upsert.
export async function createPayment(input: CreatePaymentInput) {
  const dateReceived = input.dateReceived ?? new Date();

  const payment = await prisma.payment.upsert({
    where: {
      personId_month: { personId: input.personId, month: input.month },
    },
    create: {
      personId: input.personId,
      month: input.month,
      amount: input.amount,
      dateReceived,
    },
    update: {
      amount: input.amount,
      dateReceived,
    },
    include: { person: true },
  });

  // Immediate confirmation (simulate mode logs it).
  const message =
    `Assalam o Alaikum ${payment.person.name}, we have received your ` +
    `contribution of Rs. ${input.amount} for ${formatMonth(input.month)}. ` +
    `JazakAllah.`;
  await sendWhatsAppMessage(payment.person.whatsappNo, message);

  return prisma.payment.update({
    where: { id: payment.id },
    data: { msgSent: true },
    include: { person: true },
  });
}

export async function listPayments() {
  return prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { person: true },
  });
}
