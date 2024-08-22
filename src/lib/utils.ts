import { type ClassValue, clsx } from 'clsx';
import { endOfDay, startOfDay } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUtcDayRange = (date: Date, timezone: string) => {
  const startOfDayLocal = startOfDay(date);
  const endOfDayLocal = endOfDay(date);

  const startOfDayUtc = fromZonedTime(startOfDayLocal, timezone);
  const endOfDayUtc = fromZonedTime(endOfDayLocal, timezone);

  return { startOfDayUtc, endOfDayUtc };
};
