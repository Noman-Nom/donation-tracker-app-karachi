"use client";

import { monthOptions } from "@/lib/months";

const MONTHS = monthOptions(new Date().getFullYear());

export type Filters = {
  department: string;
  month: string;
  status: string;
  from: string;
  to: string;
};

export const EMPTY_FILTERS: Filters = {
  department: "",
  month: "",
  status: "",
  from: "",
  to: "",
};

export function PaymentFilters({
  filters,
  departments,
  onChange,
}: {
  filters: Filters;
  departments: string[];
  onChange: (next: Filters) => void;
}) {
  function set(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  const cls =
    "rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-accent";
  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Department
          <select
            value={filters.department}
            onChange={(e) => set("department", e.target.value)}
            className={cls}
          >
            <option value="">All</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted">
          Month
          <select
            value={filters.month}
            onChange={(e) => set("month", e.target.value)}
            className={cls}
          >
            <option value="">All</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted">
          Status
          <select
            value={filters.status}
            onChange={(e) => set("status", e.target.value)}
            className={cls}
          >
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="reminded">Reminded (unpaid)</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted">
          From
          <input
            type="date"
            value={filters.from}
            onChange={(e) => set("from", e.target.value)}
            className={cls}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted">
          To
          <input
            type="date"
            value={filters.to}
            onChange={(e) => set("to", e.target.value)}
            className={cls}
          />
        </label>

        {hasFilters && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="rounded-md border border-line px-3 py-2 text-sm text-muted hover:text-fg"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
