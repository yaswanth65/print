import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const IST_OFFSET = 5.5 * 60 * 60 * 1000;

export function formatIST(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const istMS = d.getTime() + IST_OFFSET;
  const istDate = new Date(istMS);
  const hours = istDate.getUTCHours().toString().padStart(2, '0');
  const mins = istDate.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${mins}`;
}
