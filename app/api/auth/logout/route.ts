import { authOptions } from "../[...nextauth]/route";
import { getServerSession } from "next-auth";
import { getIdToken } from "@/lib/utils";
import { env } from "@/env";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "No active session" }, { status: 401 });
  }

  try {
    const idToken = await getIdToken();

    if (!idToken) {
      return NextResponse.json(
        { message: "No ID token found" },
        { status: 401 }
      );
    }

    const url = new URL(env.KEYCLOAK_END_SESSION_URL);
    url.searchParams.append("id_token_hint", idToken);
    url.searchParams.append("post_logout_redirect_uri", env.NEXTAUTH_URL);

    const resp = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!resp.ok) {
      console.error(`Logout failed with status: ${resp.status}`);
      return NextResponse.json(
        { message: `Keycloak logout failed: ${resp.statusText}` },
        { status: resp.status }
      );
    }

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { message: "Internal server error during logout" },
      { status: 500 }
    );
  }
}