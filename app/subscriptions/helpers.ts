import { SendError } from "@/lib/errors";

/**
 * Displays subscription data from the backend
 * @returns Subscription data
 */
export async function getSubscriptions() {
  const url = `/api/subscriptions`;

  try {
    const response = await fetch(url);

    if (!response.ok) throw new SendError("Problems with the context broker");

    const jsondata = await response.json();
    return jsondata;
  } catch (error) {
    if (error instanceof Error) throw new SendError("Server problems");
  }
}

/**
 * Delete subscription data and sends response to the backend
 * @param id Subscription ID to set
 * @returns A response of subscription data body for the backend
 */
export async function deleteSubscription(id: string) {
  const url = `/api/subscriptions`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok)
      throw new Error(`Subscription ${id} was not deleted successfully`);

    return response;
  } catch (error) {
    if (error instanceof Error) throw new Error(`Error: ${error.message}`);
  }
}
