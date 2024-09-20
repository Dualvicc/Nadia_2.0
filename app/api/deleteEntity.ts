// pages/api/deleteEntity.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.body;

    const contextBrokerURL = `${process.env.OCB_URL}/entities/${id}`;
    const deleteEntityOptions = {
      method: "DELETE",
    };

    const response = await fetch(contextBrokerURL, deleteEntityOptions);
    if (response.status === 204) {
      res.status(200).json({ message: `Entity ${id} deleted` });
    } else {
      res.status(response.status).json({ message: "Something went wrong" });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
}
