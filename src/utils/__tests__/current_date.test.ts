import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest';
import getCurrentDate from '../current_date';

describe('getCurrentDate', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        process.env = { ...OLD_ENV };
    });

    afterEach(() => {
        vi.restoreAllMocks();
        process.env = OLD_ENV;
    });

    it('formats date from API response', async () => {
        process.env.TIME_API_URL = 'https://time.example';

        const mockResponse = {
            dayOfWeek: 'Thursday',
            date: '02/05/2026',
        };

        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockResponse),
                ok: true,
            } as unknown as Response)
        );

        const result = await getCurrentDate();
        expect(result).toBe('Thursday, 02.05.2026');
    });

    it('returns fallback when TIME_API_URL is not configured', async () => {
        delete process.env.TIME_API_URL;
        const result = await getCurrentDate();
        expect(result).toBe('Date unavailable');
    });

    it('returns fallback when fetch fails', async () => {
        process.env.TIME_API_URL = 'https://time.example';
        global.fetch = vi.fn(() => Promise.reject(new Error('network')));

        const result = await getCurrentDate();
        expect(result).toBe('Date unavailable');
    });

    it('returns fallback when response is not ok', async () => {
        process.env.TIME_API_URL = 'https://time.example';
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({}),
                ok: false,
            } as unknown as Response)
        );

        const result = await getCurrentDate();
        expect(result).toBe('Date unavailable');
    });

    it('calls fetch with cache no-store option', async () => {
        process.env.TIME_API_URL = 'https://time.example';
        const mockFetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ dayOfWeek: 'Monday', date: '01/01/2026' }),
                ok: true,
            } as unknown as Response)
        );
        global.fetch = mockFetch;

        await getCurrentDate();
        expect(mockFetch).toHaveBeenCalledWith('https://time.example', { cache: 'no-store' });
    });
});
