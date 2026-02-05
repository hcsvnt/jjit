import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import type { Pokemon } from '@/types';
import { schema } from "./schema";

/**
 * Handles POST requests to fetch detailed information about a Pokémon.
 * Expects a JSON body with a 'pokemon' field (number).
 * @param request - The incoming NextRequest object.
 * @returns A NextResponse containing the Pokémon details or an error message.
 */
export async function POST(request: NextRequest) {

    try {
        const body = await request.json();
        const pokemon = getValidatedInput(body);
        const data = await fetchDetails(pokemon);
        return NextResponse.json({ pokemon: data }, { status: 200 });
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
        throw new Error(`Upstream API error fetching details for pokemon ${pokemon}: ${res.status} ${res.statusText}`);
    }
    return res.json();
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

export { fetchDetails, getValidatedInput };
