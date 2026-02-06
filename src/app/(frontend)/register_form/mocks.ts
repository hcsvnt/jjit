import type { FormSubmission } from './schema';

const valid = {
    name: 'Diego',
    age: 22,
    pokemon: 25,
};

const noPokemon = {
    name: 'Diego',
    age: 22,
    pokemon: -1,
};

const underage = {
    name: 'Diego',
    age: 15,
    pokemon: 25,
};

export const MOCKS = {
    valid,
    noPokemon,
    underage,
} as const satisfies Record<string, FormSubmission>;
