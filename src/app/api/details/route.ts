import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import type { Pokemon } from '@/types';
import { schema } from "./schema";

const { POKEAPI_BASE_URL } = process.env;

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


async function fetchDetails(pokemon: number): Promise<Pokemon> {
    const query = encodeURIComponent(pokemon);
    const url = new URL(POKEAPI_BASE_URL + query);
    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error(`Upstream API error fetching details for pokemon ${pokemon}: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

function getValidatedInput(input: unknown): number {
    const validatedData = schema.safeParse(input);
    if (!validatedData.success) {
        throw new ZodError(validatedData.error.issues);
    }
    return validatedData.data.pokemon;
}
