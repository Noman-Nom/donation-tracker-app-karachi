"use client";

import { Filter, X } from "lucide-react";
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

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="glass-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-fg">
        <Filter className="h-4 w-4 text-indigo-300" aria-hidden="true" />
        Filters
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="f-dept" className="text-xs text-muted">
            Department
          </label>
          <select
            id="f-dept"
            value={filters.department}
            onChange={(e) => set("department", e.target.value)}
            className="input-field"
          >
            <option value="">All</option>
            {departments.map((d) => (
              <option key={d} value={d} className="bg-slate-900">
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="f-month" className="text-xs text-muted">
            Month
          </label>
          <select
            id="f-month"
            value={filters.month}
            onChange={(e) => set("month", e.target.value)}
            className="input-field"
          >
            <option value="">All</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value} className="bg-slate-900">
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="f-status" className="text-xs text-muted">
            Status
          </label>
          <select
            id="f-status"
            value={filters.status}
            onChange={(e) => set("status", e.target.value)}
            className="input-field"
          >
            <option value="">All</option>
            <option value="paid" className="bg-slate-900">Paid</option>
            <option value="reminded" className="bg-slate-900">Reminded (unpaid)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="f-from" className="text-xs text-muted">
            From
          </label>
          <input
            id="f-from"
            type="date"
            value={filters.from}
            onChange={(e) => set("from", e.target.value)}
            className="input-field [color-scheme:dark]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="f-to" className="text-xs text-muted">
            To
          </label>
          <input
            id="f-to"
            type="date"
            value={filters.to}
            onChange={(e) => set("to", e.target.value)}
            className="input-field [color-scheme:dark]"
          />
        </div>

        {hasFilters && (
          <button onClick={() => onChange(EMPTY_FILTERS)} className="btn-ghost">
            <X className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
