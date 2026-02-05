/**
 * Shared test utilities and mock data for the test suite.
 * Centralizes common test fixtures to reduce duplication across test files.
 */

import type { Pokemon, PokemonJSON } from '@/types';

/**
 * Mock Pokemon objects for consistent test data
 */
export const MOCK_POKEMON = {
    pikachu: {
        id: 25,
        name: 'pikachu',
        base_experience: 112,
        types: [{ slot: 1, type: { name: 'electric' } }],
        sprites: { front_default: 'https://example.com/pikachu.png' },
    } satisfies Pokemon,

    raichu: {
        id: 26,
        name: 'raichu',
        base_experience: 218,
        types: [{ slot: 1, type: { name: 'electric' } }],
        sprites: { front_default: 'https://example.com/raichu.png' },
    } satisfies Pokemon,

    bulbasaur: {
        id: 1,
        name: 'bulbasaur',
        base_experience: 64,
        types: [{ slot: 1, type: { name: 'grass' } }],
        sprites: { front_default: 'https://example.com/bulbasaur.png' },
    } satisfies Pokemon,

    charmander: {
        id: 4,
        name: 'charmander',
        base_experience: 62,
        types: [{ slot: 1, type: { name: 'fire' } }],
        sprites: { front_default: 'https://example.com/charmander.png' },
    } satisfies Pokemon,

    cached: {
        id: 101,
        name: 'cachedmon',
        base_experience: 1,
        types: [{ slot: 1, type: { name: 'normal' } }],
        sprites: { front_default: 'https://example.com/cached.png' },
    } satisfies Pokemon,
} as const;

/**
 * Sample Pokemon JSON data for search tests
 */
export const SAMPLE_POKEMON_DATA: PokemonJSON['data'] = [
    { id: 1, name: 'Bulbasaur' },
    { id: 4, name: 'Charmander' },
    { id: 25, name: 'Pikachu' },
];

/**
 * Creates FormData from a plain object record
 * Used for testing server action form submissions
 */
export function makeFormData(values: Record<string, string | number | null | undefined>): FormData {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
        if (value === null || value === undefined) continue;
        formData.set(key, String(value));
    }

    return formData;
}
