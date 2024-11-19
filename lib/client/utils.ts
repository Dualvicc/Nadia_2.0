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

export function downloadJSON(data: string, filename: string) {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function filterJSONByKeys(data: any, selectedKeys: Set<string>): any {
  const filterKeys = (obj: any, prefix = ""): any => {
    if (typeof obj !== "object" || obj === null) return obj;

    const filtered: any = Array.isArray(obj) ? [] : {};

    Object.keys(obj).forEach((key) => {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      if (selectedKeys.has(fullPath)) {
        filtered[key] = obj[key];
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        const child = filterKeys(obj[key], fullPath);
        if (Object.keys(child).length > 0) {
          filtered[key] = child;
        }
      }
    });

    return filtered;
  };

  return Array.isArray(data)
    ? data.map((item) => filterKeys(item))
    : filterKeys(data);
}
