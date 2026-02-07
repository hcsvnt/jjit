import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import NodeCache from 'node-cache';
import { SAMPLE_POKEMON_DATA } from '@/tests/utils';
import { POST } from './route';
import {
    createPokeFuse,
    getCachedPokemons,
    getPokemons,
    getValidatedInput,
    readPokemonJSON,
    setCachedPokemons,
} from './utils';

const mockReadFile = vi.hoisted(() =>
    vi.fn(() => Promise.resolve(JSON.stringify({ data: SAMPLE_POKEMON_DATA }))),
);

vi.mock('node:fs/promises', async (importOriginal) => {
    const actual = await importOriginal<typeof import('node:fs/promises')>();
    const merged = {
        ...actual,
        readFile: mockReadFile,
    };
    return {
        __esModule: true,
        ...merged,
        default: merged,
    };
});

describe('Route /api/search', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        mockReadFile.mockReset();
    });

    describe('helpers', () => {
        it('getValidatedInput returns trimmed pokemon string', () => {
            expect(getValidatedInput({ pokemon: '  Pikachu  ' })).toBe('Pikachu');
        });

        it('getValidatedInput throws ZodError on invalid input', () => {
            expect(() => getValidatedInput({ pokemon: '' })).toThrow(ZodError);
            expect(() => getValidatedInput({})).toThrow(ZodError);
        });

        it('createPokeFuse finds pokemon by name', () => {
            const fuse = createPokeFuse(SAMPLE_POKEMON_DATA);
            const results = fuse.search('Pika');
            expect(results.length).toBeGreaterThan(0);
            expect(results[0]?.item?.name).toBe('Pikachu');
        });

        it('getCachedPokemons returns null on miss and data on hit', () => {
            const cache = new NodeCache({ stdTTL: 60 });
            const query = 'Pikachu';
            expect(getCachedPokemons(query, cache)).toBeNull();

            const value = [{ id: 25, name: 'Pikachu' }];
            cache.set(query, value);
            expect(getCachedPokemons(query, cache)).toEqual(value);
        });

        it('setCachedPokemons stores data in cache', () => {
            const cache = new NodeCache({ stdTTL: 60 });
            const query = 'Bulbasaur';
            const value = [{ id: 1, name: 'Bulbasaur' }];

            setCachedPokemons(query, value, cache);
            expect(cache.get(query)).toEqual(value);
        });

        it('getPokemons uses cache on second call (no extra Fuse search)', () => {
            const cache = new NodeCache({ stdTTL: 60 });
            const fuse = createPokeFuse(SAMPLE_POKEMON_DATA);
            const searchSpy = vi.spyOn(fuse, 'search');

            const first = getPokemons('Pika', fuse, cache);
            const second = getPokemons('Pika', fuse, cache);

            expect(first).toEqual(second);
            expect(searchSpy).toHaveBeenCalledTimes(1);
        });

        it('getPokemons returns cached value immediately when present', () => {
            const cache = new NodeCache({ stdTTL: 60 });
            const cachedValue = [{ id: 4, name: 'Charmander' }];
            cache.set('Charmander', cachedValue);

            const fuseStub = {
                search: vi.fn(() => [{ item: { id: 999, name: 'ShouldNotBeUsed' } }]),
            } as unknown as ReturnType<typeof createPokeFuse>;

            const results = getPokemons('Charmander', fuseStub, cache);
            expect(results).toEqual(cachedValue);
            expect(fuseStub.search as unknown as ReturnType<typeof vi.fn>).not.toHaveBeenCalled();
        });

        it('readPokemonJSON returns parsed data array', async () => {
            mockReadFile.mockResolvedValueOnce(
                JSON.stringify({ data: [{ id: 25, name: 'Pikachu' }] }),
            );
            const data = await readPokemonJSON('/fake/pokemon.json');
            expect(data).toEqual([{ id: 25, name: 'Pikachu' }]);
        });

        it('readPokemonJSON rejects invalid structure', async () => {
            mockReadFile.mockResolvedValueOnce(JSON.stringify({ nope: [] }));
            await expect(readPokemonJSON('/fake/pokemon.json')).rejects.toThrow(
                /Invalid JSON structure/,
            );
        });

        it('readPokemonJSON rejects invalid JSON', async () => {
            mockReadFile.mockResolvedValueOnce('{');
            await expect(readPokemonJSON('/fake/pokemon.json')).rejects.toThrow(
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
            const response = await POST(request);
            expect(response.status).toBe(200);

            const body = await response.json();
            expect(Array.isArray(body)).toBe(true);
            expect(body.some((p: { name: string }) => p.name === 'Pikachu')).toBe(true);
        });

        it('returns 400 with zod issues for invalid payload', async () => {
            const request = new NextRequest('http://localhost/api/search/pikachu', {
                method: 'POST',
                body: JSON.stringify({ pokemon: '' }),
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await POST(request);
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

            const response = await POST(request);
            expect(response.status).toBe(500);

            const body = await response.json();
            expect(body).toEqual({ error: 'Internal server error' });
        });
    });
});
