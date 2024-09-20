import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.body;

    const contextBrokerURL = `${process.env.OCB_URL}/entities/${id}`;
    const contextBrokerSubsURL =
      "${process.env.OCB_URL}/subscriptions";

    const subscriptionRequestOptions = {
      method: "GET",
    };

    const subscriptionResponse = await fetch(
      contextBrokerSubsURL,
      subscriptionRequestOptions
    );
    const subscriptions = await subscriptionResponse.json();

    for (const subscription of subscriptions) {
      const isAssociated = subscription.subject.entities.some(
        (entity: any) => entity.id === id
      );

      if (isAssociated) {
        const deleteSubscriptionUrl = `${contextBrokerSubsURL}/${subscription.id}`;
        const deleteSubscriptionOptions = {
          method: "DELETE",
        };
        await fetch(deleteSubscriptionUrl, deleteSubscriptionOptions);
      }
    }

    const deleteEntityOptions = {
      method: "DELETE",
    };

    const response = await fetch(contextBrokerURL, deleteEntityOptions);
    if (response.status === 204) {
      res
        .status(200)
        .json({ message: `Entity ${id} with their subscriptions deleted` });
    } else {
      res.status(response.status).json({ message: "Something went wrong" });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
}
