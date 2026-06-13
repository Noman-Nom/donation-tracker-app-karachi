import * as XLSX from "xlsx";
import type { Payment } from "@prisma/client";
import { prisma } from "@/lib/db";
import { MONTH_NAMES } from "@/lib/months";

const EXPORT_YEAR = 2026;

// Format a date as "DD-MM-YYYY HH:MM" (matches the requirements sheet).
function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Build the wide month-column spreadsheet:
//   Name | Father | Address | WhatsApp | SIM | Department |
//   Jan 2026 Amount | Jan 2026 Date | Jan 2026 Msg | Jan 2026 Notified | ... (×12)
export async function buildExportWorkbook(): Promise<ArrayBuffer> {
  const persons = await prisma.person.findMany({
    orderBy: { name: "asc" },
    include: { payments: true },
  });

  const baseCols = [
    "Name",
    "Father Name",
    "Address",
    "WhatsApp No",
    "SIM No",
    "Department",
  ];

  const monthCols: string[] = [];
  for (const m of MONTH_NAMES) {
    monthCols.push(
      `${m} ${EXPORT_YEAR} Amount`,
      `${m} ${EXPORT_YEAR} Date`,
      `${m} ${EXPORT_YEAR} Msg`,
      `${m} ${EXPORT_YEAR} Notified`,
    );
  }

  const rows: (string | number)[][] = [[...baseCols, ...monthCols]];

  for (const p of persons) {
    const byMonth = new Map<string, Payment>();
    for (const pay of p.payments) byMonth.set(pay.month, pay);

    const row: (string | number)[] = [
      p.name,
      p.fatherName,
      p.address ?? "",
      p.whatsappNo,
      p.simNo ?? "",
      p.department,
    ];

    for (let i = 0; i < 12; i++) {
      const key = `${EXPORT_YEAR}-${String(i + 1).padStart(2, "0")}`;
      const pay = byMonth.get(key);
      if (pay) {
        row.push(pay.amount ? pay.amount.toNumber() : "");
        row.push(pay.dateReceived ? formatDate(pay.dateReceived) : "");
        row.push(pay.msgSent ? "Yes" : "No");
        row.push(pay.notified ? "Yes" : "No");
      } else {
        row.push("", "", "", "");
      }
    }

    rows.push(row);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Contributions ${EXPORT_YEAR}`);

  const buffer: Buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });
  // Return a standalone ArrayBuffer (accepted directly by Response).
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}
