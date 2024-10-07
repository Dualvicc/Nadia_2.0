import { ngsiLdSchema } from "@/lib/server/utils";
import { insertNgsild } from "@/lib/server/actions";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const parsedBody = ngsiLdSchema.safeParse(body);
    if (!parsedBody.success) {
      return new Response("Invalid NGSI-ld payload", { status: 400 });
    }
    await insertNgsild(parsedBody.data);
    return new Response("Payload processed", { status: 200 });
  } catch (error: any) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
