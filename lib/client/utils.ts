import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { decrypt } from "@/lib/encryption";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function getIdToken() {
  const session : any = await getServerSession(authOptions);
  if (session) {
    const idTokenDecrypted = decrypt(session.id_token);
    return idTokenDecrypted;
  }
  return null;
}

export async function getAccessToken() {
  const session : any = await getServerSession(authOptions);
  if (session) {
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
