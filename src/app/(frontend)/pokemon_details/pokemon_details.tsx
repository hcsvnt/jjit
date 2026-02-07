'use client';

import { Box, Chip } from '@mui/material';
import Image from 'next/image';
import useSWR from 'swr';
import type { Pokemon } from '@/types';
import theme from '@/theme/theme';
import { List, ListItem, P, Span } from '@/components/typography';

import { fetcher } from '@/utils/fetcher';

/**
 * PokemonDetails
 *
 * Displays a preview of the selected Pokémon. Fetches details via SWR when a
 * valid `pokemonId` is provided. Renders loading, error and empty states.
 *
 * @param {{ pokemonId: number }} props.pokemonId - The numeric id of the selected Pokémon.
 * @returns {JSX.Element}
 */
export default function PokemonDetails({ pokemonId }: { pokemonId: number }) {
    const { data } = useSWR(
        pokemonId ? ['/api/details', pokemonId] : null,
        () => fetcher<Pokemon>(`/api/details`, { pokemon: pokemonId }),
        { suspense: true },
    );

    if (!data) {
        return <P sx={{ color: theme.palette.grey[200] }}>Your pokemon</P>;
    }

    const { name, types, base_experience, id, sprites } = data;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'min(24px, 0.25em)' }}>
            {sprites?.front_default && (
                <Box sx={{ position: 'relative', width: 'min(195px, 40vw)', aspectRatio: '1' }}>
                    <Image src={sprites.front_default} alt={name} fill />
                </Box>
            )}
            <List>
                <ListItem sx={{ textTransform: 'capitalize' }}>Name: {name}</ListItem>
                <ListItem sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Span>Type: </Span>
                    {types?.map((type) => (
                        <Chip key={type.type.name} label={type.type.name} />
                    ))}
                </ListItem>
                <ListItem>Base Experience: {base_experience}</ListItem>
                <ListItem>Id: {id}</ListItem>
            </List>
        </Box>
    );
}
