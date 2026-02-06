'use client';

import { Box, CircularProgress, Alert, Chip } from '@mui/material';
import Image from 'next/image';
import useSWR from 'swr';
import type { Pokemon } from '@/types';
import theme from '@/theme/theme';
import { List, ListItem, P, Span } from '@/components/typography';

import { fetcher } from '@/utils/fetcher';

export default function PokemonDetails({ pokemonId }: { pokemonId: number }) {
    const { data, error, isLoading } = useSWR(pokemonId ? [`/api/details`, pokemonId] : null, () =>
        fetcher<Pokemon>(`/api/details`, { pokemon: pokemonId }),
    );

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">Failed to load Pokémon details.</Alert>;
    }

    if (!data) {
        return <P sx={{ color: theme.palette.grey[200] }}>Your pokemon</P>;
    }

    const { name, types, base_experience, id, sprites } = data;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {sprites?.front_default && (
                <Image src={sprites.front_default} alt={name} width={195} height={195} />
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
