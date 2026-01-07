import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistance, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTimeDistance(date: string | Date | null | undefined) {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export const isMobileWidth = (width = 640) =>
  window.matchMedia(`(max-width:${width}px)`).matches;

export const isDesktopWidth = (width = 1280) =>
  window.matchMedia(`(max-width:${width}px)`).matches;

export const expiresIn6hrs = new Date(
  new Date().getTime() + 6 * 60 * 60 * 1000
);

export const expiresIn15Mins = new Date(new Date().getTime() + 15 * 60 * 1000);

export const expiresIn1day = new Date(
  new Date().getTime() + 1 * 24 * 60 * 60 * 1000
);

export const expiresIn7days = new Date(
  new Date().getTime() + 7 * 24 * 60 * 60 * 1000
);

export const expiresIn30days = new Date(
  new Date().getTime() + 30 * 24 * 60 * 60 * 1000
);
