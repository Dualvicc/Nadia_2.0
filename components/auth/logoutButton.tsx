"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

async function keycloakSessionLogOut() {
  try {
    await fetch(`/api/auth/logout`, { method: "GET" });
  } catch (err) {
    throw new Error("Internal server error during logout");
  }
}

export const LogoutButton = () => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex h-[48px] items-center justify-center gap-2 rounded-md mt-4 p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gray-100"
      onClick={() => {
        keycloakSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
      }}
    >
      <LogOut className="h-5 w-5" />
      <span className="hidden md:block">Log out</span>
    </Button>
  );
};
