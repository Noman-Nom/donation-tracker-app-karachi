import { buildExportWorkbook } from "@/server/services/export";

// GET /api/export — download all data as an Excel file.
export async function GET() {
  const file = await buildExportWorkbook();

  return new Response(file, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="contributions-2026.xlsx"',
    },
  });
}
