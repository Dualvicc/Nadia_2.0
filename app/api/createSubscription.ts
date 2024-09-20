import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const subsData = req.body;
    const contextBrokerUrl = `${process.env.OCB_URL}/subscriptions/`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(subsData),
    };

    const response = await fetch(contextBrokerUrl, requestOptions);
    if (response.status === 201) {
      res.status(201).json({ message: "Subscription created" });
    } else {
      res.status(response.status).json({ message: "Something went wrong" });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
}
