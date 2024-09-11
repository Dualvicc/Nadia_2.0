import postgres from "postgres";
import { env } from "@/env";

export const sql = postgres(env.POSTGRES_URL, {});
