import type { Person } from "@prisma/client";

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
    <div className="overflow-x-auto rounded-lg border border-line bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line text-muted">
          <tr>
            {COLUMNS.map((c) => (
              <th key={c.key} className="px-4 py-3 font-medium">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={COLUMNS.length} className="px-4 py-6 text-muted">
                Loading…
              </td>
            </tr>
          ) : persons.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="px-4 py-6 text-muted">
                No members yet. Add one above.
              </td>
            </tr>
          ) : (
            persons.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                {COLUMNS.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-fg">
                    {p[c.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
