import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import type { Pokemon } from '@/types';
import { schema } from './schema';
import NodeCache from 'node-cache';

const CACHE_TTL = 60 * 60 * 24 * 7;
const cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: CACHE_TTL / 2 });

/**
 * Handles POST requests to fetch detailed information about a Pokémon.
 * Returns cached data if available.
 * Expects a JSON body with a 'pokemon' field (number).
 * @param request - The incoming NextRequest object.
 * @returns A NextResponse containing the Pokémon details or an error message.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const pokemon = getValidatedInput(body);
        const data = await getDetails(pokemon, cache);
        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json({ errors: err.issues }, { status: 400 });
        }

        if (err instanceof Error && err.message.startsWith('Upstream API error')) {
            console.error(err.message);
            return NextResponse.json({ error: 'Upstream API error' }, { status: 502 });
        }

        console.error('Unexpected error in /api/details:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * Fetches detailed information about a Pokémon from the PokeAPI.
 * @param pokemon - The Pokémon ID.
 * @returns A promise that resolves to the Pokémon details.
 * @throws An error if the upstream API request fails.
 */
async function fetchDetails(pokemon: number): Promise<Pokemon> {
    const { POKEAPI_BASE_URL } = process.env;
    if (!POKEAPI_BASE_URL) {
        throw new Error('POKEAPI_BASE_URL is not configured');
    }
    const query = encodeURIComponent(pokemon);
    const url = new URL(POKEAPI_BASE_URL + query);
    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error(
            `Upstream API error fetching details for pokemon ${pokemon}: ${res.status} ${res.statusText}`,
        );
    }
    return res.json();
}

/**
 * Gets Pokémon details, using cache if available.
 * @param pokemon - The Pokémon ID.
 * @param cache - The NodeCache instance for caching results.
 * @returns A promise that resolves to the Pokémon details.
 */
function getDetails(pokemon: number, cache: NodeCache): Promise<Pokemon> {
    const cached = getCachedDetails(pokemon, cache);
    if (cached) {
        return Promise.resolve(cached);
    }

    return fetchDetails(pokemon).then((data) => {
        setCachedDetails(pokemon, data, cache);
        return data;
    });
}

/**
 * Retrieves cached Pokémon details for a given Pokémon ID.
 * @param pokemon - The Pokémon ID.
 * @param cache - The NodeCache instance to use for retrieving cached data.
 * @returns The cached Pokémon details or undefined if not found.
 */
function getCachedDetails(pokemon: number, cache: NodeCache): Pokemon | undefined {
    return cache.get(pokemon.toString());
}

/**
 * Caches Pokémon details for a given Pokémon ID.
 * @param pokemon - The Pokémon ID.
 * @param data - The Pokémon details to cache.
 * @param cache - The NodeCache instance to use for caching data.
 */
function setCachedDetails(pokemon: number, data: Pokemon, cache: NodeCache): void {
    cache.set(pokemon.toString(), data);
}

/**
 * Validates and extracts the Pokémon ID from the input.
 * @param input - The input to validate.
 * @returns The validated Pokémon ID.
 * @throws ZodError if validation fails.
 */
function getValidatedInput(input: unknown): number {
    const validatedData = schema.safeParse(input);
    if (!validatedData.success) {
        throw new ZodError(validatedData.error.issues);
    }
    return validatedData.data.pokemon;
}
