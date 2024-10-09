import { z } from "zod";

export const WebhookURLSchema = z.string().url();
