import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import type { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { env } from "@/env";
import { jwtDecode } from "jwt-decode";
import { encrypt } from "@/lib/encryption";

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    expires_at?: number;
    decoded?: any;
    error?: string;
  }
}

declare module "next-auth" {
  interface Session {
    access_token?: string;
    id_token?: string;
    roles?: string[];
    error?: string;
  }
}

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(env.KEYCLOAK_REFRESH_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.KEYCLOAK_CLIENT_ID,
        client_secret: env.KEYCLOAK_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token as string,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const refreshedTokens = await response.json();

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      decoded: jwtDecode(refreshedTokens.access_token),
      id_token: refreshedTokens.id_token,
      expires_at: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
      refresh_token: refreshedTokens.refresh_token,
    };
  } catch (error) {
    throw new Error("RefreshAccessTokenError");
  }
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
        token.decoded = account.access_token
          ? jwtDecode(account.access_token)
          : undefined;
        token.id_token = account.id_token;
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = account.expires_at;
        return token;
      }

      const bufferTime = 60 * 1000;
      if (Date.now() < Number(token.expires_at!) * 1000 - bufferTime) {
        return token;
      } else {
        try {
          const refreshedToken = await refreshAccessToken(token);
          return refreshedToken;
        } catch (error) {
          throw new Error("RefreshAccessTokenError");
        }
      }
    },
    async session({ session, token }) {
      // Send properties to the client
      session.access_token = token.access_token
        ? encrypt(token.access_token)
        : undefined;
      session.id_token = token.id_token ? encrypt(token.id_token) : undefined;
      session.roles = token.decoded.realm_access?.roles;
      session.error = token.error;
      return session;
    },
  },
};
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
