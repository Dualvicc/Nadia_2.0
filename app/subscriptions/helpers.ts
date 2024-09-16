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
