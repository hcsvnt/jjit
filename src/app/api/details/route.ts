import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import NodeCache from 'node-cache';
import { getDetails, getValidatedInput } from './utils';

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
