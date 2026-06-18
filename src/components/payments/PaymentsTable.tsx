import type { Payment, Person } from "@prisma/client";
import { Inbox } from "lucide-react";
import { formatMonth } from "@/lib/months";

type Row = Payment & { person: Person };

const HEADERS = [
  "Member",
  "Department",
  "Month",
  "Amount",
  "Date Received",
  "Msg",
  "Notified",
];

export function PaymentsTable({
  payments,
  loading,
}: {
  payments: Row[];
  loading: boolean;
}) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-muted">
            <tr>
              {HEADERS.map((h) => (
                <th key={h} className="px-5 py-3.5 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={HEADERS.length} className="px-5 py-10 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={HEADERS.length} className="px-5 py-12 text-center">
                  <Inbox className="mx-auto mb-3 h-8 w-8 text-muted/60" aria-hidden="true" />
                  <p className="text-muted">No payments match. Record one or clear filters.</p>
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 transition-colors duration-150 last:border-0 hover:bg-white/[0.04]"
                >
                  <td className="px-5 py-3.5 font-medium text-fg">{p.person.name}</td>
                  <td className="px-5 py-3.5 text-fg/80">{p.person.department}</td>
                  <td className="px-5 py-3.5 text-fg/80">{formatMonth(p.month)}</td>
                  <td className="px-5 py-3.5 text-fg/90">
                    {p.amount === null ? (
                      <span className="text-muted">—</span>
                    ) : (
                      `Rs. ${p.amount}`
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-fg/70">
                    {p.dateReceived ? new Date(p.dateReceived).toLocaleString() : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    {p.msgSent ? (
                      <span className="badge border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                        Sent
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {p.notified ? (
                      <span className="badge border-amber-400/30 bg-amber-400/10 text-amber-300">
                        Reminded
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
