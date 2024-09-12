"use client";

import { Session } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

async function keycloakSessionLogOut() {
  try {
    await fetch(`/api/auth/logout`, { method: "GET" });
  } catch (err) {
    console.error(err);
  }
}

export default function AuthStatus() {
  const { data: session, status } = useSession();
  interface CustomSession extends Session {
    error?: string;
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("keycloak");
    } else if (
      status != "loading" &&
      session &&
      (session as CustomSession)?.error === "RefreshAccessTokenError"
    ) {
      signOut({ callbackUrl: "/" });
    }
  }, [session, status]);

  if (status == "loading") {
    return <div className="">Loading...</div>;
  } else if (session) {
    return (
      <div className="flex-col justify-center items-center w-full mb-4">
        <div className="flex justify-center">
          <button
            className="bg-blue-600 font-bold text-white py-1 px-2 rounded-lg mb-4"
            onClick={() => {
              keycloakSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
            }}
          >
            Log out
          </button>
        </div>
        <div className="text-center">
          <span className="text-black-100 text-center w-full">
            {session.user?.email ?? ""}
          </span>{" "}
        </div>
      </div>
    );
  }

  return null;
}
