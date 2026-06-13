import type { Payment, Person } from "@prisma/client";
import { formatMonth } from "@/lib/months";

type Row = Payment & { person: Person };

export function PaymentsTable({
  payments,
  loading,
}: {
  payments: Row[];
  loading: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Member</th>
            <th className="px-4 py-3 font-medium">Department</th>
            <th className="px-4 py-3 font-medium">Month</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Date Received</th>
            <th className="px-4 py-3 font-medium">Msg</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-muted">
                Loading…
              </td>
            </tr>
          ) : payments.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-muted">
                No payments yet. Record one above.
              </td>
            </tr>
          ) : (
            payments.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-fg">{p.person.name}</td>
                <td className="px-4 py-3 text-fg">{p.person.department}</td>
                <td className="px-4 py-3 text-fg">{formatMonth(p.month)}</td>
                <td className="px-4 py-3 text-fg">
                  {p.amount === null ? "—" : `Rs. ${p.amount}`}
                </td>
                <td className="px-4 py-3 text-fg">
                  {p.dateReceived
                    ? new Date(p.dateReceived).toLocaleString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {p.msgSent ? (
                    <span className="text-success">Sent</span>
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
  );
}
