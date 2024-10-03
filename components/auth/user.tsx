"use client";

import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const User = () => {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex justify-center items-center w-[95%] h-12 mb-4 border border-gray-100 rounded-full p-2">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex flex-col justify-center w-full ml-2">
          <Skeleton className="h-3 w-1/2 mb-1" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-[95%] h-12 mb-4 border border-gray-100 rounded-full p-2">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={user.image ?? ""} alt="User Avatar" />
        <AvatarFallback>
          {user.name?.[0] ?? user.email?.[0] ?? "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center w-full ml-2 overflow-hidden">
        <span className="text-sm font-medium truncate">{user.name ?? ""}</span>
        <span className="text-xs text-muted-foreground truncate">
          {user.email ?? ""}
        </span>
      </div>
    </div>
  );
};
