import Cryptr from "cryptr";
import { env } from "@/env";

export function encrypt(text: string) {
  const secretKey = env.NEXTAUTH_SECRET;
  const cryptr = new Cryptr(secretKey);

  const encryptedString = cryptr.encrypt(text);
  return encryptedString;
}

export function decrypt(encryptedString: string) {
  const secretKey = env.NEXTAUTH_SECRET;
  const cryptr = new Cryptr(secretKey);

  const text = cryptr.decrypt(encryptedString);
  return text;
}
