/**
 * Fetcher for SWR that makes POST requests with JSON body.
 * Pass the expected response type as a generic parameter.
 *
 * @param url - The API endpoint URL
 * @param body - The request body object
 * @returns Promise resolving to the JSON response
 * @throws Error if the response is not ok
 */
export function fetcher<T>(url: string, body: Record<string, unknown>): Promise<T> {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then((res) => {
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        return res.json() as Promise<T>;
    });
}
