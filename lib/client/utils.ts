import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WebhookURLSchema } from "@/lib/client/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateInputText(value: string) {
  return WebhookURLSchema.safeParse(value);
}

export function dataTimeText() {
  const dateVar = new Date();
  const dateFormatted = dateVar.toLocaleDateString("en-EN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hourFormatted = dateVar.toLocaleTimeString("en-EN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return `${dateFormatted} ${hourFormatted}`;
}

export function sanitizeValue(value: string) {
  return value.replace(/"/g, "_").replace(/'/g, "_").replace(/`/g, "_");
}

export function isStringBlank(str: string): boolean {
  return str.trim().length === 0;
}

export function searchDataEntities(str: string, arr: Array<any>) {
  return arr.filter(
    (el) =>
      el.id.toLowerCase().includes(str.toLowerCase()) ||
      el.type.toLowerCase().includes(str.toLowerCase())
  );
}

export function searchDataSubscriptions(str: string, arr: Array<any>) {
  return arr.filter(
    (el) =>
      el.id.toLowerCase().includes(str.toLowerCase()) ||
      el.description.toLowerCase().includes(str.toLowerCase()) ||
      el.notification.http.url
        .toLowerCase()
        .includes(str.toLocaleLowerCase()) ||
      el.notification.lastNotification
        .toLocaleLowerCase()
        .includes(str.toLocaleLowerCase())
  );
}
