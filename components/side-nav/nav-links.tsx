"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { links } from "@/lib/nav-links-helpers";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col items-left gap-4 px-2">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-start gap-2 rounded-md p-3 text-sm font-medium text-muted-foreground hover:text-foreground",
              {
                "bg-gray-100 text-black": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="h-5 w-5" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
