'use client';

import { Autocomplete, CircularProgress } from '@mui/material';
import TextField from './text_field';
import type { SearchResponse } from '@/app/api/search/route';
import { fetcher } from '@/utils/fetcher';
import useSWR from 'swr';

export default function PokemonAutocomplete({
    query,
    pokemonId,
    onChange,
    onSearch,
    formError,
}: {
    query: string | undefined;
    pokemonId: number | undefined;
    onChange: (id: number | undefined) => void;
    onSearch: (value: string) => void;
    formError?: string;
}) {
    const { data, error, isLoading } = useSWR(query ?? null, () =>
        fetcher<SearchResponse>('/api/search', { pokemon: query }),
    );
    return (
        <Autocomplete
            options={data ?? []}
            getOptionLabel={({ name }) => name}
            onChange={(_, option) => onChange(option?.id)}
            onInputChange={(_, inputValue) => onSearch(inputValue)}
            value={data?.find(({ id }) => id === pokemonId) ?? null}
            loading={isLoading}
            loadingText="Loading options..."
            noOptionsText="Start typing to search..."
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Pokemon Name"
                    placeholder="Choose"
                    helperText={formError}
                    error={!!formError}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: isLoading ? (
                                <CircularProgress
                                    color="inherit"
                                    size={20}
                                    sx={{
                                        position: 'relative',
                                        left: '20px',
                                    }}
                                />
                            ) : (
                                params.InputProps.endAdornment
                            ),
                        },
                    }}
                />
            )}
        />
    );
}
