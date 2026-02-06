import { vi, describe, it, expect, afterEach } from 'vitest';
import { fetcher } from '../fetcher';

describe('fetcher', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('posts JSON and returns parsed response', async () => {
        const url = '/api/test';
        const body = { a: 1 };
        const responseData = { ok: true, value: 'ok' };

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(responseData),
            } as unknown as Response),
        );

        const res = await fetcher<typeof responseData>(url, body);
        expect(res).toEqual(responseData);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    });

    it('throws when response is not ok', async () => {
        global.fetch = vi.fn(() => Promise.resolve({ ok: false } as unknown as Response));

        await expect(fetcher('/bad', {})).rejects.toThrow('Failed to fetch data');
    });

    it('throws when fetch rejects', async () => {
        const networkError = new Error('Network timeout');
        global.fetch = vi.fn(() => Promise.reject(networkError));

        await expect(fetcher('/api/test', {})).rejects.toThrow(networkError);
    });

    it('sends correct headers', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as unknown as Response),
        );

        await fetcher('/api/test', { test: 'data' });

        expect(global.fetch).toHaveBeenCalledWith(
            '/api/test',
            expect.objectContaining({
                headers: { 'Content-Type': 'application/json' },
            }),
        );
    });
});
