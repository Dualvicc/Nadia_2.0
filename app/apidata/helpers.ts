import { InvalidURL, ConnectionError } from "@/lib/errors";

/**
 * Fetches API contents and converts to JSON data
 * @param url URL to set
 * @returns JSON API data
 */
export async function apiFetch(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new ConnectionError("Error to connect to the API");
    }
    return await res.json();
  } catch (error) {
    throw new InvalidURL(`The URL is not valid ${url}`);
  }
}
