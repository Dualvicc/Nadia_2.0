import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { decrypt } from "@/lib/encryption";

interface Session {
  id_token?: string;
  access_token?: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function getIdToken() {
  const session: Session | null = await getServerSession(authOptions);
  if (session && session.id_token) {
    const idTokenDecrypted = decrypt(session.id_token);
    return idTokenDecrypted;
  }
  return null;
}

export async function getAccessToken() {
  const session: Session | null = await getServerSession(authOptions);
  if (session && session.access_token) {
    const accessTokenDecrypted = decrypt(session.access_token);
    return accessTokenDecrypted;
  }
  return null;
}

const attributeSchema = z.object({
  type: z.string(),
  value: z.unknown(),
  metadata: z.record(z.unknown()).optional(),
});

export const ngsiLdSchema = z
  .object({
    id: z.string().regex(/^urn:ngsi-ld:/),
    type: z.string(),
  })
  .catchall(attributeSchema.optional());
