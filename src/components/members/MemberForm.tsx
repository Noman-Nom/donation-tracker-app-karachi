"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";

const EMPTY = {
  name: "",
  fatherName: "",
  address: "",
  whatsappNo: "",
  simNo: "",
  department: "",
};

type Field = keyof typeof EMPTY;

const FIELDS: {
  key: Field;
  label: string;
  required?: boolean;
  type?: string;
  inputMode?: "text" | "tel";
}[] = [
  { key: "name", label: "Name", required: true },
  { key: "fatherName", label: "Father Name", required: true },
  { key: "whatsappNo", label: "WhatsApp No", required: true, type: "tel", inputMode: "tel" },
  { key: "simNo", label: "SIM / Text No", type: "tel", inputMode: "tel" },
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
    <form onSubmit={handleSubmit} className="glass-card animate-fade-in-up p-6">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-fg">
        <UserPlus className="h-5 w-5 text-indigo-300" aria-hidden="true" />
        Add Member
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, label, required, type, inputMode }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label htmlFor={`member-${key}`} className="text-sm font-medium text-fg">
              {label}
              {required && <span className="text-error"> *</span>}
            </label>
            <input
              id={`member-${key}`}
              type={type ?? "text"}
              inputMode={inputMode}
              spellCheck={false}
              value={form[key]}
              onChange={(e) => update(key, e.target.value)}
              className="input-field"
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-sm text-error" aria-live="polite">
          {error}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary mt-6">
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        {saving ? "Saving…" : "Add Member"}
      </button>
    </form>
  );
}
