import type { Person } from "@prisma/client";
import { Users } from "lucide-react";

// Only the string-valued fields are shown as columns.
type StringField =
  | "name"
  | "fatherName"
  | "whatsappNo"
  | "simNo"
  | "department"
  | "address";

const COLUMNS: { key: StringField; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "fatherName", label: "Father Name" },
  { key: "whatsappNo", label: "WhatsApp No" },
  { key: "simNo", label: "SIM No" },
  { key: "department", label: "Department" },
  { key: "address", label: "Address" },
];

export function MembersTable({
  persons,
  loading,
}: {
  persons: Person[];
  loading: boolean;
}) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-muted">
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.key} className="px-5 py-3.5 font-medium">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-5 py-10 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : persons.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-5 py-12 text-center">
                  <Users className="mx-auto mb-3 h-8 w-8 text-muted/60" aria-hidden="true" />
                  <p className="text-muted">No members yet. Add one above.</p>
                </td>
              </tr>
            ) : (
              persons.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 transition-colors duration-150 last:border-0 hover:bg-white/[0.04]"
                >
                  {COLUMNS.map((c) => (
                    <td key={c.key} className="px-5 py-3.5 text-fg/90">
                      {p[c.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
