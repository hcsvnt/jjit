import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import type { Pokemon } from '@/types';
import type { NextRequest } from 'next/server';
import { fetchDetails, getValidatedInput, POST } from './route';

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
            const mockPokemon: Pokemon = {
                id: 25,
                name: 'pikachu',
                base_experience: 112,
                types: [{ slot: 1, type: { name: 'electric' } }],
                sprites: { front_default: 'https://example.com/pikachu.png' },
            };

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
                /Upstream API error fetching details for pokemon 999999: 404 Not Found/
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
            const mockPokemon: Pokemon = {
                id: 25,
                name: 'pikachu',
                base_experience: 112,
                types: [{ slot: 1, type: { name: 'electric' } }],
                sprites: { front_default: 'https://example.com/pikachu.png' },
            };

            const fetchMock = vi.fn().mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockPokemon),
            });
            vi.stubGlobal('fetch', fetchMock);

            const request = {
                json: async () => ({ pokemon: 25 }),
            } as unknown as NextRequest;

            const response = await POST(request);
            expect(response.status).toBe(200);

            const body = await response.json();
            expect(body).toEqual({ pokemon: mockPokemon });
            expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
        });

        it('returns 400 with zod issues for invalid payload', async () => {
            const request = {
                json: async () => ({ pokemon: 0 }),
            } as unknown as NextRequest;

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

            const request = {
                json: async () => ({ pokemon: 999999 }),
            } as unknown as NextRequest;

            const response = await POST(request);
            expect(response.status).toBe(502);

            const body = await response.json();
            expect(body).toEqual({ error: 'Upstream API error' });
        });

        it('returns 500 when request.json throws unexpected error', async () => {
            const request = {
                json: async () => {
                    throw new Error('boom');
                },
            } as unknown as NextRequest;

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

            const request = {
                json: async () => ({ pokemon: 25 }),
            } as unknown as NextRequest;

            const response = await POST(request);
            expect(response.status).toBe(500);

            const body = await response.json();
            expect(body).toEqual({ error: 'Internal server error' });
        });
    });
});
