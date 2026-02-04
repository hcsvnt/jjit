import type { FormSubmission } from '../search/schema';


const valid = {
    name: 'Misty',
    age: 22,
    pokemon: 'pikachu',
}

const noPokemon = {
    name: 'Brock',
    age: 30,
    pokemon: 'tusk',
}

const underage = {
    name: 'Ash',
    age: 15,
    pokemon: 'charizard',
};

export const mocks = ({
    valid,
    noPokemon,
    underage,
} as const) satisfies Record<string, FormSubmission>;
