"use client";

import { useCallback, useEffect, useState } from "react";
import type { Person } from "@prisma/client";
import { MemberForm } from "./MemberForm";
import { MembersTable } from "./MembersTable";

export function MembersClient() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/persons");
    const json = (await res.json()) as { data: Person[] };
    setPersons(json.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <MemberForm onCreated={load} />
      <MembersTable persons={persons} loading={loading} />
    </div>
  );
}
