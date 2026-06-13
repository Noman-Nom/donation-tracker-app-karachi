// Month helpers. Internally months are stored as "YYYY-MM" (e.g. "2026-01");
// they are displayed as "Jan 2026".

export const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function monthOptions(year: number) {
  return MONTH_NAMES.map((name, i) => {
    const mm = String(i + 1).padStart(2, "0");
    return { value: `${year}-${mm}`, label: `${name} ${year}` };
  });
}

export function formatMonth(value: string) {
  const [year, month] = value.split("-");
  const name = MONTH_NAMES[Number(month) - 1] ?? month;
  return `${name} ${year}`;
}

export function currentMonthValue(now: Date = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
