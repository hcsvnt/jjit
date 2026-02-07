import { ZodError } from 'zod';
import { schema } from './schema';
import type { PokemonJSON } from '@/types';
import Fuse from 'fuse.js';
import type NodeCache from 'node-cache';
import { readFile } from 'node:fs/promises';

export type SearchResponse = {
    name: string;
    id: number;
}[];

/**
 * Gets Pokémon matching the search query, using cache if available.
 * @param query - The search query.
 * @param fuse - The Fuse.js instance for searching.
 * @param cache - The NodeCache instance for caching results.
 * @returns An array of matching Pokémon data.
 */
export function getPokemons(
    query: string,
    fuse: Fuse<PokemonJSON['data'][number]>,
    cache: NodeCache,
): PokemonJSON['data'] {
    const cached = getCachedPokemons(query, cache);
    if (cached) {
        return cached;
    }

    const searched = getSearchedPokemons(query, fuse);
    setCachedPokemons(query, searched, cache);
    return searched;
}

/**
 * Retrieves cached Pokémon data for a given query.
 * @param query - The search query.
 * @param cache - The NodeCache instance to use for retrieving cached data.
 * @returns The cached Pokémon data or null if not found.
 */
export function getCachedPokemons(query: string, cache: NodeCache): PokemonJSON['data'] | null {
    const cachedData = cache.get<PokemonJSON['data']>(query);
    if (cachedData) {
        console.info('Cache hit for query:', query);
        return cachedData;
    }
    console.info('Cache miss for query:', query);
    return null;
}

/**
 * Performs a search for Pokémon matching the query using Fuse.js.
 * Returns cached data if available.
 * @param query - The search query.
 * @param fuse - The Fuse.js instance to use for searching.
 * @returns An array of matching Pokémon data.
 */
export function getSearchedPokemons(
    query: string,
    fuse: Fuse<PokemonJSON['data'][number]>,
): PokemonJSON['data'] {
    return fuse.search(query).map((result) => result.item);
}

/**
 * Caches Pokémon data for a given query.
 * @param query - The search query.
 * @param data - The Pokémon data to cache.
 * @param cache - The NodeCache instance to use for caching.
 */
export function setCachedPokemons(
    query: string,
    data: PokemonJSON['data'],
    cache: NodeCache,
): void {
    cache.set(query, data);
    console.info('Cached results for query:', query);
}

/**
 * Validates and extracts the Pokémon ID from the input.
 * @param input - The input to validate.
 * @returns The validated Pokémon ID.
 * @throws ZodError if validation fails.
 */
export function getValidatedInput(input: unknown): string {
    const validatedData = schema.safeParse(input);
    if (!validatedData.success) {
        throw new ZodError(validatedData.error.issues);
    }
    return validatedData.data.pokemon;
}

/**
 * Creates and configures a Fuse.js instance for fuzzy searching Pokémon data.
 * @param data - An array of Pokémon data to index.
 * @returns A configured Fuse instance.
 */
export function createPokeFuse(data: PokemonJSON['data']): Fuse<PokemonJSON['data'][number]> {
    return new Fuse(data, {
        keys: ['name'],
        threshold: 0.3,
    });
}

/**
 * Reads and parses a JSON file containing Pokémon data.
 * Does a simple structure verification of the JSON to ensure it matches the expected format.
 *
 * @param path - The file path to the JSON file.
 * @returns A promise that resolves to an array of Pokémon data.
 * @throws An error if the file cannot be read or the JSON structure is invalid.
 */
export async function readPokemonJSON(path: string): Promise<PokemonJSON['data']> {
    const data = await readFile(path, 'utf-8');

    try {
        const dataJSON: PokemonJSON = JSON.parse(data);

        if (!dataJSON.data || !Array.isArray(dataJSON.data)) {
            throw new Error(`Invalid JSON structure in ${path}`);
        }

        return dataJSON.data;
    } catch (e) {
        throw new Error(`Error parsing JSON from ${path}: ${(e as Error).message}`);
    }
}
