import type { Pokemon } from '@/types';

export const pikachu = {
    id: 25,
    name: 'pikachu',
    base_experience: 112,
    sprites: {
        front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    },
    types: [
        {
            slot: 1,
            type: {
                name: 'electric',
            },
        },
    ],
} satisfies Pokemon;
