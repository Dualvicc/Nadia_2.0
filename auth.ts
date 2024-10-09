import { NextAuthOptions, getServerSession } from "next-auth";
import { env } from "@/env";
import KeycloakProvider from "next-auth/providers/keycloak";
import { jwtDecode } from "jwt-decode";
import { encrypt } from "@/lib/server/encryption";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    refresh_token: string;
    refresh_expires_in: number;
    expires_in: number;
    user: {
      sub: string;
      email_verified: boolean;
      name: string;
      telephone: string;
      preferred_username: string;
      org_name: string;
      given_name: string;
      family_name: string;
      email: string;
      id: string;
    };
    error?: string | null;
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

export const authOptions: NextAuthOptions = {
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
        token.id_token = account.id_token!;
        token.access_token = account.access_token!;
        token.refresh_token = account.refresh_token!;
        token.expires_at = account.expires_at!;
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
      session.access_token = token.access_token
        ? encrypt(token.access_token as string)
        : undefined;
      session.id_token = token.id_token
        ? encrypt(token.id_token as string)
        : undefined;
      session.roles = (token.decoded as any).realm_access?.roles;
      session.error = token.error ?? undefined;
      return session;
    },
  },
};
