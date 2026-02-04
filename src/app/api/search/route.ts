import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { schema } from './schema';
import type { Pokemon } from '@/types';

export async function POST(request: NextRequest) {
    console.log({ request });
    try {
        const body = await request.json();
        const validatedData = schema.safeParse(body);
        console.log('Received request with body:', body);

        if (!validatedData.success) {
            return NextResponse.json({ errors: validatedData.error.issues }, { status: 400 });
        }

        const { pokemon } = validatedData.data;
        const query = encodeURIComponent(pokemon.trim().toLowerCase());

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

        if (!res.ok) {
            if (res.status === 404) {
                return NextResponse.json({ error: 'Pokemon not found' }, { status: 404 });
            }

            const bodyText = await res.text().catch(() => '');
            console.error('Upstream API error fetching pokemon:', res.status, res.statusText, bodyText);
            return NextResponse.json({ error: 'Upstream API error' }, { status: 502 });
        }

        const parsed: Pokemon = await res.json();

        return NextResponse.json({ pokemon: parsed }, { status: 200 });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json({ errors: err.issues }, { status: 400 });
        }

        console.error('Unexpected error in /api/search:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
