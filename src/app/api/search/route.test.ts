import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import NodeCache from 'node-cache';
import { ZodError } from 'zod';
import { NextRequest } from 'next/server';
import { SAMPLE_POKEMON_DATA } from '@/tests/utils';

const mockReadFile = vi.fn();

vi.mock('node:fs/promises', async (importOriginal) => {
    const actual = await importOriginal<typeof import('node:fs/promises')>();
    const merged = {
        ...actual,
        readFile: (...args: unknown[]) => mockReadFile(...args),
    };
    return {
        __esModule: true,
        ...merged,
        default: merged,
    };
});

type RouteModule = typeof import('./route');

async function loadRouteModule(
    pokemonJsonData: Array<{ id: number; name: string }> = [],
): Promise<RouteModule> {
    mockReadFile.mockResolvedValue(JSON.stringify({ data: pokemonJsonData }));
    vi.resetModules();
    const mod = await import('./route');
    mockReadFile.mockClear();
    return mod;
}

describe('Route /api/search', () => {
    let route: RouteModule;

    beforeEach(async () => {
        route = await loadRouteModule(SAMPLE_POKEMON_DATA);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        mockReadFile.mockReset();
    });

    describe('helpers', () => {
        it('getValidatedInput returns trimmed pokemon string', () => {
            expect(route.getValidatedInput({ pokemon: '  Pikachu  ' })).toBe('Pikachu');
        });

        it('getValidatedInput throws ZodError on invalid input', () => {
            expect(() => route.getValidatedInput({ pokemon: '' })).toThrow(ZodError);
            expect(() => route.getValidatedInput({})).toThrow(ZodError);
        });

        it('createPokeFuse + getSearchedPokemons finds by name', () => {
            const fuse = route.createPokeFuse(SAMPLE_POKEMON_DATA);
            const results = route.getSearchedPokemons('Pika', fuse);
            expect(results.length).toBeGreaterThan(0);
            expect(results[0]?.name).toBe('Pikachu');
        });

        it('getCachedPokemons returns null on miss and data on hit', () => {
            const cache = new NodeCache({ stdTTL: 60 });
            const query = 'Pikachu';
            expect(route.getCachedPokemons(query, cache)).toBeNull();

            const value = [{ id: 25, name: 'Pikachu' }];
            cache.set(query, value);
            expect(route.getCachedPokemons(query, cache)).toEqual(value);
        });

        it('setCachedPokemons stores data in cache', () => {
            const cache = new NodeCache({ stdTTL: 60 });
            const query = 'Bulbasaur';
            const value = [{ id: 1, name: 'Bulbasaur' }];

            route.setCachedPokemons(query, value, cache);
            expect(cache.get(query)).toEqual(value);
        });

        it('getPokemons uses cache on second call (no extra Fuse search)', () => {
            const cache = new NodeCache({ stdTTL: 60 });
            const fuse = route.createPokeFuse(SAMPLE_POKEMON_DATA);
            const searchSpy = vi.spyOn(fuse, 'search');

            const first = route.getPokemons('Pika', fuse, cache);
            const second = route.getPokemons('Pika', fuse, cache);

            expect(first).toEqual(second);
            expect(searchSpy).toHaveBeenCalledTimes(1);
        });

        it('getPokemons returns cached value immediately when present', () => {
            const cache = new NodeCache({ stdTTL: 60 });
            const cachedValue = [{ id: 4, name: 'Charmander' }];
            cache.set('Charmander', cachedValue);

            const fuseStub = {
                search: vi.fn(() => [{ item: { id: 999, name: 'ShouldNotBeUsed' } }]),
            } as unknown as ReturnType<RouteModule['createPokeFuse']>;

            const results = route.getPokemons('Charmander', fuseStub, cache);
            expect(results).toEqual(cachedValue);
            expect(fuseStub.search as unknown as ReturnType<typeof vi.fn>).not.toHaveBeenCalled();
        });

        it('readPokemonJSON returns parsed data array', async () => {
            mockReadFile.mockResolvedValueOnce(
                JSON.stringify({ data: [{ id: 25, name: 'Pikachu' }] }),
            );
            const data = await route.readPokemonJSON('/fake/pokemon.json');
            expect(data).toEqual([{ id: 25, name: 'Pikachu' }]);
        });

        it('readPokemonJSON rejects invalid structure', async () => {
            mockReadFile.mockResolvedValueOnce(JSON.stringify({ nope: [] }));
            await expect(route.readPokemonJSON('/fake/pokemon.json')).rejects.toThrow(
                /Invalid JSON structure/,
            );
        });

        it('readPokemonJSON rejects invalid JSON', async () => {
            mockReadFile.mockResolvedValueOnce('{');
            await expect(route.readPokemonJSON('/fake/pokemon.json')).rejects.toThrow(
                /Error parsing JSON/,
            );
        });
    });

    describe('POST handler', () => {
        it('returns 200 with results for valid payload', async () => {
            const request = new NextRequest('http://localhost/api/search/pikachu', {
                method: 'POST',
                body: JSON.stringify({ pokemon: 'pikachu' }),
                headers: { 'Content-Type': 'application/json' },
            });
            const response = await route.POST(request);
            expect(response.status).toBe(200);

            const body = await response.json();
            expect(body).toHaveProperty('results');
            expect(Array.isArray(body.results)).toBe(true);
            expect(body.results.some((p: { name: string }) => p.name === 'Pikachu')).toBe(true);
        });

        it('returns 400 with zod issues for invalid payload', async () => {
            const request = new NextRequest('http://localhost/api/search/pikachu', {
                method: 'POST',
                body: JSON.stringify({ pokemon: '' }),
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await route.POST(request);
            expect(response.status).toBe(400);

            const body = await response.json();
            expect(body).toHaveProperty('errors');
            expect(Array.isArray(body.errors)).toBe(true);
            expect(body.errors.length).toBeGreaterThan(0);
        });

        it('returns 500 when request.json throws unexpected error', async () => {
            const request = new NextRequest('http://localhost/api/search/pikachu', {
                method: 'POST',
                body: 'invalid-json',
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await route.POST(request);
            expect(response.status).toBe(500);

            const body = await response.json();
            expect(body).toEqual({ error: 'Internal server error' });
        });
    });
});
