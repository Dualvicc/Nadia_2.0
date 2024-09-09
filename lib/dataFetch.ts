/**
 * Displays entity data from the backend
 * @returns Entity data
 */
export async function getEntities() {
  const url = `http://${location.hostname}:3004/api/getentities`;

  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error("Problems with the context broker");
    return response;
  } catch (error) {
    if (error instanceof Error) throw new Error("Server problems");
  }
}

/**
 * Displays subscription data from the backend
 * @returns Subscription data
 */
export async function getSubscriptions() {
  const url = `http://${location.hostname}:3004/api/getsubscriptions`;

  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error("Problems with the context broker");
    return response;
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
  const url = `http://${location.hostname}:3004/api/createsubscription`;

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
  const url = `http://${location.hostname}:3004/api/deleteentity`;

  try {
    const response = await fetch(url, {
      method: "POST",
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

/**
 * Delete subscription data and sends response to the backend
 * @param id Subscription ID to set
 * @returns A response of subscription data body for the backend
 */
export async function deleteSubscription(id: string) {
  const url = `http://${location.hostname}:3004/api/deletesubscription`;

  try {
    const response = await fetch(url, {
      method: "POST",
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
