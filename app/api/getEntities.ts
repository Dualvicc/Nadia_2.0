import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const contextBrokerUrl = `${process.env.OCB_URL}/entities/`;
    const requestOptions = {
      method: "GET",
    };

    const response = await fetch(contextBrokerUrl, requestOptions);
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
}
