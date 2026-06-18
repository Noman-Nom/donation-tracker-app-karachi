"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";

export function ReminderButton({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/reminders/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // force: true so the demo works regardless of today's date.
      body: JSON.stringify({ force: true }),
    });
    const json = (await res.json()) as {
      data?: { ran: boolean; checked: number; remindersSent: number; month: string; reason?: string };
      error?: string;
    };

    setLoading(false);

    if (!res.ok || !json.data) {
      setResult(json.error ?? "Failed to run reminder check");
      return;
    }

    const d = json.data;
    setResult(
      d.ran
        ? `Checked ${d.checked} member(s) — ${d.remindersSent} reminder(s) sent for ${d.month}.`
        : (d.reason ?? "Did not run."),
    );
    onComplete();
  }

  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
            <BellRing className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-fg">Reminders</h2>
            <p className="text-sm text-muted">
              Notify members who haven’t paid for the current month.
            </p>
          </div>
        </div>
        <button onClick={run} disabled={loading} className="btn-primary shrink-0">
          <BellRing className="h-4 w-4" aria-hidden="true" />
          {loading ? "Running…" : "Run reminder check"}
        </button>
      </div>
      {result && (
        <p className="mt-4 text-sm text-success" aria-live="polite">
          {result}
        </p>
      )}
    </div>
  );
}
