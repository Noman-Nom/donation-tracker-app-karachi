"use client";

import { useState } from "react";
import type { Person } from "@prisma/client";
import { currentMonthValue, monthOptions } from "@/lib/months";

const MONTHS = monthOptions(new Date().getFullYear());

// "YYYY-MM-DDTHH:MM" for a datetime-local input, defaulting to now.
function nowLocalInput() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PaymentForm({
  members,
  onCreated,
}: {
  members: Person[];
  onCreated: () => void;
}) {
  const [personId, setPersonId] = useState("");
  const [month, setMonth] = useState(currentMonthValue());
  const [amount, setAmount] = useState("");
  const [dateReceived, setDateReceived] = useState(nowLocalInput());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personId,
        month,
        amount: Number(amount),
        dateReceived: new Date(dateReceived).toISOString(),
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      setError(json.error ?? "Failed to record payment");
      return;
    }

    setSuccess("Payment recorded. Confirmation sent.");
    setAmount("");
    onCreated();
  }

  const inputClass =
    "rounded-md border border-line bg-surface px-3 py-2 text-fg outline-none focus:border-accent";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-line bg-surface p-6"
    >
      <h2 className="mb-4 text-lg font-semibold text-fg">Record Payment</h2>

      {members.length === 0 ? (
        <p className="text-sm text-muted">
          Add a member first on the Members page.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-fg">
                Member <span className="text-error">*</span>
              </span>
              <select
                value={personId}
                onChange={(e) => setPersonId(e.target.value)}
                className={inputClass}
              >
                <option value="">Select member…</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.department}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-fg">
                Month <span className="text-error">*</span>
              </span>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={inputClass}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-fg">
                Amount (Rs.) <span className="text-error">*</span>
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-fg">Date Received</span>
              <input
                type="datetime-local"
                value={dateReceived}
                onChange={(e) => setDateReceived(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          {error && <p className="mt-4 text-sm text-error">{error}</p>}
          {success && <p className="mt-4 text-sm text-success">{success}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Record Payment"}
          </button>
        </>
      )}
    </form>
  );
}
