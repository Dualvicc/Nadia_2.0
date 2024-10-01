import { sql } from "@/db";

export async function insertNgsild(data: {
  id: string;
  type: string;
  [k: string]: any;
}) {
  await sql`
      INSERT INTO example (entity_id, type, data)
      VALUES (${data.id}, ${data.type}, ${JSON.stringify(data)})
    `;
}
