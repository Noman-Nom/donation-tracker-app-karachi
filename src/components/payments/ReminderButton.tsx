"use client";

import { useState } from "react";

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
    <div className="rounded-lg border border-line bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-fg">Reminders</h2>
          <p className="text-sm text-muted">
            Notify members who haven’t paid for the current month.
          </p>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Running…" : "Run reminder check"}
        </button>
      </div>
      {result && <p className="mt-3 text-sm text-success">{result}</p>}
    </div>
  );
}
