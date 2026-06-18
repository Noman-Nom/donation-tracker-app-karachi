"use client";

import { useState } from "react";
import { BadgeDollarSign } from "lucide-react";
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

  return (
    <form onSubmit={handleSubmit} className="glass-card animate-fade-in-up p-6">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-fg">
        <BadgeDollarSign className="h-5 w-5 text-emerald-300" aria-hidden="true" />
        Record Payment
      </h2>

      {members.length === 0 ? (
        <p className="text-sm text-muted">
          Add a member first on the Members page.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pay-member" className="text-sm font-medium text-fg">
                Member <span className="text-error">*</span>
              </label>
              <select
                id="pay-member"
                value={personId}
                onChange={(e) => setPersonId(e.target.value)}
                className="input-field"
              >
                <option value="">Select member…</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-900">
                    {m.name} — {m.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pay-month" className="text-sm font-medium text-fg">
                Month <span className="text-error">*</span>
              </label>
              <select
                id="pay-month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input-field"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value} className="bg-slate-900">
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pay-amount" className="text-sm font-medium text-fg">
                Amount (Rs.) <span className="text-error">*</span>
              </label>
              <input
                id="pay-amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pay-date" className="text-sm font-medium text-fg">
                Date Received
              </label>
              <input
                id="pay-date"
                type="datetime-local"
                value={dateReceived}
                onChange={(e) => setDateReceived(e.target.value)}
                className="input-field [color-scheme:dark]"
              />
            </div>
          </div>

          <div aria-live="polite">
            {error && <p className="mt-4 text-sm text-error">{error}</p>}
            {success && <p className="mt-4 text-sm text-success">{success}</p>}
          </div>

          <button type="submit" disabled={saving} className="btn-primary mt-6">
            <BadgeDollarSign className="h-4 w-4" aria-hidden="true" />
            {saving ? "Saving…" : "Record Payment"}
          </button>
        </>
      )}
    </form>
  );
}
