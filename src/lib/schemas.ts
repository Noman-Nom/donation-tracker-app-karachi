import { z } from "zod";

// Validation for creating a member. Optional fields accept "" from the form
// and are normalized to null in the service layer.
export const createPersonSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  fatherName: z.string().trim().min(1, "Father name is required"),
  address: z.string().trim().optional(),
  whatsappNo: z.string().trim().min(5, "A valid WhatsApp number is required"),
  simNo: z.string().trim().optional(),
  department: z.string().trim().min(1, "Department is required"),
});

export type CreatePersonInput = z.infer<typeof createPersonSchema>;

// Validation for recording a payment. dateReceived is optional — the
// service defaults it to now when omitted.
export const createPaymentSchema = z.object({
  personId: z.string().min(1, "Member is required"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  dateReceived: z.coerce.date().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
