import { z } from "zod";

if (typeof window != "undefined") {
  throw new Error("This module should only be imported on the server");
}

const envSchema = z.object({
  POSTGRES_URL: z.string(),
  KEYCLOAK_CLIENT_ID: z.string(),
  KEYCLOAK_CLIENT_SECRET: z.string(),
  KEYCLOAK_ISSUER: z.string(),
  NEXTAUTH_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  KEYCLOAK_END_SESSION_URL: z.string(),
  KEYCLOAK_REFRESH_TOKEN_URL: z.string(),
});

const result = envSchema.safeParse({
  POSTGRES_URL: process.env.POSTGRES_URL,
  KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
  KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  KEYCLOAK_END_SESSION_URL: process.env.KEYCLOAK_END_SESSION_URL,
  KEYCLOAK_REFRESH_TOKEN_URL: process.env.KEYCLOAK_REFRESH_TOKEN_URL,
});

if (!result.success) {
  throw new Error("Invalid environment variables");
}
const env = result.data;
export { env };
