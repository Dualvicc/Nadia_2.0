import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { RectangleGroupIcon, TagIcon } from "@heroicons/react/24/solid";
import { WebhookURLSchema } from "@/lib/client/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function validateInputText(value: string) {
  return WebhookURLSchema.safeParse(value);
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

export const links = [
  { name: "Entities", href: "/", icon: RectangleGroupIcon },
  {
    name: "Subscriptions",
    href: "/subscriptions",
    icon: TagIcon,
  },
];
