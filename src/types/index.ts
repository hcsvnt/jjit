/**
 * Source: https://pokeapi.co/docs/v2#
 */

/**
 * PokemonJSON type definition for the local file ingest.
 */
export type PokemonJSON = {
    data: { name: string; id: number }[];
};

/**
 * Pokemon type definition is just a partial of the full PokeAPI response, but exhaustive enough for our use case.
 */
export type Pokemon = {
    id: number;
    name: string;
    base_experience: number;
    types: {
        slot: number;
        type: {
            // id: number;
            name: string;
        };
    }[];
    sprites: {
        front_default: string;
    };
};
