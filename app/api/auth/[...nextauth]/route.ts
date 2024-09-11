import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import type { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { env } from "@/env";
import { jwtDecode } from "jwt-decode";
import { encrypt } from "@/lib/encryption";

// Consider using a more specific type for decoded JWT
type DecodedToken = {
  realm_access?: {
    roles?: string[];
  };
  // Add other expected properties
};

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    expires_at?: number;
    decoded?: DecodedToken;
    error?: string;
  }
}

async function refreshAccessToken(token: JWT) {
  const resp = await fetch(`${env.KEYCLOAK_REFRESH_TOKEN_URL}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.KEYCLOAK_CLIENT_ID,
      client_secret: env.KEYCLOAK_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: token.refresh_token as string,
    }),
    method: "POST",
  });
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`);
  }
  const refreshToken = await resp.json();
  if (!resp.ok) throw refreshToken;

  return {
    ...token,
    access_token: refreshToken.access_token,
    decoded: jwtDecode(refreshToken.access_token),
    id_token: refreshToken.id_token,
    expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
    refresh_token: refreshToken.refresh_token,
  };
}

const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: env.KEYCLOAK_CLIENT_ID,
      clientSecret: env.KEYCLOAK_CLIENT_SECRET,
      issuer: env.KEYCLOAK_ISSUER,
    }),
  ],
  session: {
    maxAge: 60 * 30,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          decoded: account.access_token
            ? jwtDecode(account.access_token)
            : undefined,
          id_token: account.id_token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
        };
      }

      const bufferTime = 60 * 1000;
      if (Date.now() < Number(token.expires_at!) * 1000 - bufferTime) {
        return token;
      } else {
        try {
          const refreshedToken = await refreshAccessToken(token);
          console.log("Token is refreshed.");
          return refreshedToken;
        } catch (error) {
          console.error(error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
    },
    async session({ session, token }) {
      return {
        ...session,
        access_token: token.access_token
          ? encrypt(token.access_token)
          : undefined,
        id_token: token.id_token ? encrypt(token.id_token) : undefined,
        roles: token.decoded?.realm_access?.roles ?? [],
        error: token.error,
      };
    },
  },
};
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
