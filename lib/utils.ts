import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTimeInTimeZone(
  value: Date,
  timeZone?: string
): string {
  if (!timeZone) {
    return value.toLocaleString();
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone,
    }).format(value);
  } catch {
    return value.toLocaleString();
  }
}

export function formatForDateTimeLocal(value: Date): string {
  const pad = (input: number) => String(input).padStart(2, "0");
  return [
    `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(
      value.getDate()
    )}`,
    `${pad(value.getHours())}:${pad(value.getMinutes())}`,
  ].join("T");
}
