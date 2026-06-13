import { NextResponse } from "next/server";
import { runReminderCheck } from "@/server/cron/reminders";

// POST /api/reminders/run — manually trigger the reminder check.
// Body: { force?: boolean } — force bypasses the "after the 15th" gate.
export async function POST(request: Request) {
  let force = false;
  try {
    const body = (await request.json()) as { force?: unknown };
    force = body.force === true;
  } catch {
    // no body — default force = false
  }

  const result = await runReminderCheck(new Date(), { force });
  return NextResponse.json({ data: result });
}
