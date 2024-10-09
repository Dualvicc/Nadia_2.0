/**
 * Displays entity data from the backend
 * @returns Entity data
 */
export async function getEntities() {
  const url = `/api/entities`;
  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error("Problems with the context broker");

    const jsondata = await response.json();
    return jsondata;
  } catch (error) {
    if (error instanceof Error) throw new Error("Server problems");
  }
}

/**
 * Create a subscription data and sends response to the backend
 * @param entity Entity data to set
 * @param valueNotificationWebhookUrl Notification webhook URL to set
 * @returns A response of subscription data body for the backend
 */
export async function createSubscription(
  entity: any,
  valueNotificationWebhookUrl: string
) {
  const url = `/api/subscriptions`;

  const subscriptionPayload = {
    description: `Notify me of all ${entity.id} status changes`,
    subject: {
      entities: [
        {
          id: entity.id,
          type: entity.type,
        },
      ],
      condition: {
        attrs: [],
      },
    },
    notification: {
      http: { url: valueNotificationWebhookUrl },
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscriptionPayload),
  });

  if (!response.ok) throw new Error("Failed to send info to the backend");

  return response;
}

/**
 * Delete entity data and sends response to the backend
 * @param id Entity ID to set
 * @returns A response of entity data body for the backend
 */
export async function deleteEntity(id: string) {
  const url = `/api/entities`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok)
      throw new Error(`Entity ${id} was not deleted successfully`);

    return response;
  } catch (error) {
    if (error instanceof Error) throw new Error(`Error: ${error.message}`);
  }
}

/**
 * Delete entity data with their subscriptions and sends response to the backend
 * @param id Entity ID to set
 * @returns A response of entity data body for the backend
 */
export async function deleteEntityWithSubscriptions(id: string) {
  // TODO: Handle the entity to delete like deleteEntity function from above
  const url = `http://${location.hostname}:3004/api/deleteentitywithsubscriptions`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok)
      throw new Error(
        `Entity ${id} and their subscriptions were not deleted successfully`
      );

    return response;
  } catch (error) {
    if (error instanceof Error) throw new Error(`Error: ${error.message}`);
  }
}
