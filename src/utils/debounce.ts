/* eslint-disable  @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: This needs to stay flexible to be reusable. */

/**
 * Creates a debounced version of the provided callback function.
 * @remarks
 * For production I would likely use one from Effect, provided there was other
 * utility in the library to leverage, but this has served me well so far.
 *
 * @param callback - The function to debounce.
 * @param timeout - The debounce timeout in milliseconds (default is 300ms).
 * @returns A debounced function.
 */
export function debounce<F extends (...args: any[]) => any>(callback: F, timeout = 300) {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<F>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, timeout);
    };
}
