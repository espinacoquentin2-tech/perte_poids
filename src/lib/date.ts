export const DEFAULT_TIMEZONE = "Europe/Paris";

export function localDate(timezone = DEFAULT_TIMEZONE, date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days, 12));
  return localDate("UTC", shifted);
}

export function startOfWeek(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay() || 7;
  return addDays(date, 1 - weekday);
}

export function formatLocalDate(date: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("fr-FR", { ...options, timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}
