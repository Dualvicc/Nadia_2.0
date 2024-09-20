import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.body;
    const contextBrokerUrl = `${process.env.OCB_URL}/subscriptions/${id}`;
    const requestOptions = {
      method: "DELETE",
    };

    const response = await fetch(contextBrokerUrl, requestOptions);
    if (response.status === 204) {
      res.status(200).json({ message: `Subscription ${id} deleted` });
    } else {
      res.status(response.status).json({ message: "Something went wrong" });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
}
