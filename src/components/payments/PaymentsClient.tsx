"use client";

import { useCallback, useEffect, useState } from "react";
import type { Payment, Person } from "@prisma/client";
import { PaymentForm } from "./PaymentForm";
import { PaymentsTable } from "./PaymentsTable";

type PaymentRow = Payment & { person: Person };

export function PaymentsClient() {
  const [members, setMembers] = useState<Person[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <PaymentForm members={members} onCreated={loadPayments} />
      <PaymentsTable payments={payments} loading={loading} />
    </div>
  );
}
