import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import NodeCache from 'node-cache';
import path from 'node:path';
import { getPokemons, getValidatedInput, readPokemonJSON, createPokeFuse } from './utils';

export type SearchResponse = {
    name: string;
    id: number;
}[];

/**
 * Build the fuse and cache instances at module level.
 */
const FILEPATH = path.resolve(process.cwd(), 'public', 'pokemon.json');
const CACHE_TTL = 60 * 60 * 24 * 7;
const pokemonData = await readPokemonJSON(FILEPATH);
const pokeFuse = createPokeFuse(pokemonData);
const cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: CACHE_TTL / 2 });

/**
 * Handles POST requests to search for Pokémon by name.
 * Expects a JSON body with a 'pokemon' field (string).
 * @param request - The incoming NextRequest object.
 * @returns A NextResponse containing the search results or an error message.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const query = getValidatedInput(body);
        const results = getPokemons(query, pokeFuse, cache);

        return NextResponse.json(results, { status: 200 });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json({ errors: err.issues }, { status: 400 });
        }

        console.error('Unexpected error in /api/search:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
