import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { NextRequest } from 'next/server';
import NodeCache from 'node-cache';
import { MOCK_POKEMON } from '@/tests/utils';
import {
    fetchDetails,
    getCachedDetails,
    getDetails,
    getValidatedInput,
    POST,
    setCachedDetails,
} from './route';

describe('Route /api/details', () => {
    describe('getValidatedInput', () => {
        it('returns pokemon id for a valid payload', () => {
            expect(getValidatedInput({ pokemon: 25 })).toBe(25);
        });

        it('throws ZodError for missing pokemon field', () => {
            expect(() => getValidatedInput({})).toThrow(ZodError);
        });

        it('throws ZodError for non-positive pokemon id', () => {
            expect(() => getValidatedInput({ pokemon: 0 })).toThrow(ZodError);
            expect(() => getValidatedInput({ pokemon: -1 })).toThrow(ZodError);
        });

        it('throws ZodError for non-integer pokemon id', () => {
            expect(() => getValidatedInput({ pokemon: 1.5 })).toThrow(ZodError);
        });
    });

    describe('fetchDetails', () => {
        const originalEnv = process.env;

        beforeEach(() => {
            process.env = {
                ...originalEnv,
                POKEAPI_BASE_URL: 'https://pokeapi.co/api/v2/pokemon/',
            };
        });

        afterEach(() => {
            process.env = originalEnv;
            vi.unstubAllGlobals();
            vi.restoreAllMocks();
        });

        it('calls fetch with the expected URL and returns JSON', async () => {
            const mockPokemon = MOCK_POKEMON.pikachu;

            const fetchMock = vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockPokemon),
            });
            vi.stubGlobal('fetch', fetchMock);

            await expect(fetchDetails(25)).resolves.toEqual(mockPokemon);
            expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
        });

        it('throws a descriptive error on upstream non-ok responses', async () => {
            const fetchMock = vi.fn().mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            });
            vi.stubGlobal('fetch', fetchMock);

            await expect(fetchDetails(999999)).rejects.toThrow(
                /Upstream API error fetching details for pokemon 999999: 404 Not Found/,
            );
        });

        it('throws when POKEAPI_BASE_URL is missing', async () => {
            process.env = {
                ...originalEnv,
            };

            const fetchMock = vi.fn();
            vi.stubGlobal('fetch', fetchMock);

            await expect(fetchDetails(1)).rejects.toThrow(/POKEAPI_BASE_URL is not configured/);
            expect(fetchMock).not.toHaveBeenCalled();
        });
    });

    describe('cache helpers', () => {
        it('getCachedDetails returns undefined when missing', () => {
            const cache = new NodeCache({ stdTTL: 60 });
            expect(getCachedDetails(25, cache)).toBeUndefined();
        });

        it('getCachedDetails retrieves value when present', () => {
            const cache = new NodeCache({ stdTTL: 60 });
            const pikachu = MOCK_POKEMON.pikachu;

            cache.set('25', pikachu);
            expect(getCachedDetails(25, cache)).toEqual(pikachu);
        });

        it('setCachedDetails stores value by pokemon id', () => {
            const cache = new NodeCache({ stdTTL: 60 });
            const pikachu = MOCK_POKEMON.pikachu;

            setCachedDetails(25, pikachu, cache);
            expect(cache.get('25')).toEqual(pikachu);
        });
    });

    describe('getDetails', () => {
        it('returns cached data without calling fetch', async () => {
            const cache = new NodeCache({ stdTTL: 60 });
            const cached = MOCK_POKEMON.cached;

            setCachedDetails(101, cached, cache);

            const fetchMock = vi.fn();
            vi.stubGlobal('fetch', fetchMock);

            await expect(getDetails(101, cache)).resolves.toEqual(cached);
            expect(fetchMock).not.toHaveBeenCalled();
        });

        it('fetches, caches, and returns the data on subsequent calls', async () => {
            const originalEnv = process.env;
            process.env = {
                ...originalEnv,
                POKEAPI_BASE_URL: 'https://pokeapi.co/api/v2/pokemon/',
            };

            const cache = new NodeCache({ stdTTL: 60 });
            const mockPokemon = MOCK_POKEMON.bulbasaur;

            const fetchMock = vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockPokemon),
            });
            vi.stubGlobal('fetch', fetchMock);

            await expect(getDetails(102, cache)).resolves.toEqual(mockPokemon);
            expect(getCachedDetails(102, cache)).toEqual(mockPokemon);

            await expect(getDetails(102, cache)).resolves.toEqual(mockPokemon);
            expect(fetchMock).toHaveBeenCalledTimes(1);

            process.env = originalEnv;
            vi.unstubAllGlobals();
        });
    });

    describe('POST handler', () => {
        const originalEnv = process.env;

        beforeEach(() => {
            process.env = {
                ...originalEnv,
                POKEAPI_BASE_URL: 'https://pokeapi.co/api/v2/pokemon/',
            };

            vi.spyOn(console, 'error').mockImplementation(() => undefined);
        });

        afterEach(() => {
            process.env = originalEnv;
            vi.unstubAllGlobals();
            vi.restoreAllMocks();
        });

        it('returns 200 with pokemon details for valid payload', async () => {
            const mockPokemon = MOCK_POKEMON.pikachu;

            const fetchMock = vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockPokemon),
            });
            vi.stubGlobal('fetch', fetchMock);

            const request = new NextRequest('http://localhost/api/details', {
                method: 'POST',
                body: JSON.stringify({ pokemon: 25 }),
                headers: { 'Content-Type': 'application/json' },
            });
            const response = await POST(request);
            expect(response.status).toBe(200);

            const body = await response.json();
            expect(body).toEqual({ pokemon: mockPokemon });
            expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
        });

        it('returns cached result on subsequent calls (fetch called once)', async () => {
            const mockPokemon = MOCK_POKEMON.raichu;

            const fetchMock = vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockPokemon),
            });
            vi.stubGlobal('fetch', fetchMock);

            const request = {
                json: async () => ({ pokemon: 26 }),
            } as unknown as NextRequest;

            const response1 = await POST(request);
            expect(response1.status).toBe(200);
            await expect(response1.json()).resolves.toEqual({ pokemon: mockPokemon });

            const response2 = await POST(request);
            expect(response2.status).toBe(200);
            await expect(response2.json()).resolves.toEqual({ pokemon: mockPokemon });

            expect(fetchMock).toHaveBeenCalledTimes(1);
            expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/26');
        });

        it('returns 400 with zod issues for invalid payload', async () => {
            const request = new NextRequest('http://localhost/api/details', {
                method: 'POST',
                body: JSON.stringify({ pokemon: 0 }),
                headers: { 'Content-Type': 'application/json' },
            });
            const response = await POST(request);
            expect(response.status).toBe(400);

            const body = await response.json();
            expect(body).toHaveProperty('errors');
            expect(Array.isArray(body.errors)).toBe(true);
            expect(body.errors.length).toBeGreaterThan(0);
        });

        it('returns 502 on upstream non-ok response', async () => {
            const fetchMock = vi.fn().mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            });
            vi.stubGlobal('fetch', fetchMock);

            const request = new NextRequest('http://localhost/api/details', {
                method: 'POST',
                body: JSON.stringify({ pokemon: 999999 }),
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await POST(request);
            expect(response.status).toBe(502);

            const body = await response.json();
            expect(body).toEqual({ error: 'Upstream API error' });
        });

        it('returns 500 when request.json throws unexpected error', async () => {
            const request = new NextRequest('http://localhost/api/details', {
                method: 'POST',
                body: 'invalid json',
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await POST(request);
            expect(response.status).toBe(500);

            const body = await response.json();
            expect(body).toEqual({ error: 'Internal server error' });
        });

        it('returns 500 when fetch throws a non-upstream error', async () => {
            const fetchMock = vi.fn().mockImplementation(() => {
                throw new Error('network down');
            });
            vi.stubGlobal('fetch', fetchMock);

            const request = new NextRequest('http://localhost/api/details', {
                method: 'POST',
                body: JSON.stringify({ pokemon: 1 }),
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await POST(request);
            expect(response.status).toBe(500);

            const body = await response.json();
            expect(body).toEqual({ error: 'Internal server error' });
        });
    });
});
