"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Payment, Person } from "@prisma/client";
import { PaymentForm } from "./PaymentForm";
import { PaymentsTable } from "./PaymentsTable";
import { ReminderButton } from "./ReminderButton";
import { EMPTY_FILTERS, PaymentFilters, type Filters } from "./PaymentFilters";

type PaymentRow = Payment & { person: Person };

export function PaymentsClient() {
  const [members, setMembers] = useState<Person[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const loadPayments = useCallback(async () => {
    const res = await fetch("/api/payments");
    const json = (await res.json()) as { data: PaymentRow[] };
    setPayments(json.data ?? []);
  }, []);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const membersRes = await fetch("/api/persons");
      const membersJson = (await membersRes.json()) as { data: Person[] };
      setMembers(membersJson.data ?? []);
      await loadPayments();
      setLoading(false);
    })();
  }, [loadPayments]);

  const departments = useMemo(
    () => Array.from(new Set(payments.map((p) => p.person.department))).sort(),
    [payments],
  );

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (filters.department && p.person.department !== filters.department)
        return false;
      if (filters.month && p.month !== filters.month) return false;
      // amount is null for reminder-only rows, a value for paid rows.
      if (filters.status === "paid" && p.amount === null) return false;
      if (filters.status === "reminded" && !(p.amount === null && p.notified))
        return false;
      if (filters.from) {
        if (!p.dateReceived) return false;
        if (new Date(p.dateReceived) < new Date(filters.from)) return false;
      }
      if (filters.to) {
        if (!p.dateReceived) return false;
        const to = new Date(filters.to);
        to.setHours(23, 59, 59, 999);
        if (new Date(p.dateReceived) > to) return false;
      }
      return true;
    });
  }, [payments, filters]);

  return (
    <div className="space-y-6">
      <PaymentForm members={members} onCreated={loadPayments} />
      <ReminderButton onComplete={loadPayments} />
      <PaymentFilters
        filters={filters}
        departments={departments}
        onChange={setFilters}
      />
      <p className="text-sm text-muted">
        Showing {filtered.length} of {payments.length} payment(s)
      </p>
      <PaymentsTable payments={filtered} loading={loading} />
    </div>
  );
}
