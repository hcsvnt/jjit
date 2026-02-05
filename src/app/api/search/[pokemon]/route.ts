import { NextResponse } from 'next/server';

// app/api/search/[pokemon]/route.ts

export async function POST(
    request: Request,
    { params }: { params: { pokemon: string } }
) {
    const { pokemon } = params; // "pikachu"

    // If JSON body:
    const body = await request.json().catch(() => null);

    return NextResponse.json({
        pokemon,
        body,
    });
}
