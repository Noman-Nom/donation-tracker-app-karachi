import { prisma } from "@/lib/db";
import type { CreatePersonInput } from "@/lib/schemas";

// Business logic for members. The only place person persistence lives.

export async function listPersons() {
  return prisma.person.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createPerson(input: CreatePersonInput) {
  return prisma.person.create({
    data: {
      name: input.name,
      fatherName: input.fatherName,
      address: input.address || null,
      whatsappNo: input.whatsappNo,
      simNo: input.simNo || null,
      department: input.department,
    },
  });
}
