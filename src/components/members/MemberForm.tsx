"use client";

import { useState } from "react";

const EMPTY = {
  name: "",
  fatherName: "",
  address: "",
  whatsappNo: "",
  simNo: "",
  department: "",
};

type Field = keyof typeof EMPTY;

const FIELDS: { key: Field; label: string; required?: boolean }[] = [
  { key: "name", label: "Name", required: true },
  { key: "fatherName", label: "Father Name", required: true },
  { key: "whatsappNo", label: "WhatsApp No", required: true },
  { key: "simNo", label: "SIM / Text No" },
  { key: "department", label: "Department", required: true },
  { key: "address", label: "Address" },
];

export function MemberForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(field: Field, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/persons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      setError(json.error ?? "Failed to save member");
      return;
    }

    setForm(EMPTY);
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-line bg-surface p-6"
    >
      <h2 className="mb-4 text-lg font-semibold text-fg">Add Member</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, label, required }) => (
          <label key={key} className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-fg">
              {label}
              {required && <span className="text-error"> *</span>}
            </span>
            <input
              value={form[key]}
              onChange={(e) => update(key, e.target.value)}
              className="rounded-md border border-line bg-surface px-3 py-2 text-fg outline-none focus:border-accent"
            />
          </label>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Add Member"}
      </button>
    </form>
  );
}
