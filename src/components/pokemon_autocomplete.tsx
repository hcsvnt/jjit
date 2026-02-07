'use client';

import { Autocomplete, CircularProgress } from '@mui/material';
import TextField from './text_field';
import type { SearchResponse } from '@/app/api/search/route';
import { fetcher } from '@/utils/fetcher';
import useSWR from 'swr';

/**
 * PokemonAutocomplete
 *
 * Controlled autocomplete component for selecting a Pokémon.
 * - Uses `useSWR` + `fetcher` to query the `/api/search` endpoint when `query` changes.
 * - Displays results using MUI `Autocomplete` and maps the selected `pokemonId` to the option value.
 * - Calls `onSearch` for input changes (debounced upstream) and `onChange` with the selected id.
 * - Renders a `TextField` for input and shows a loading spinner when fetching.
 *
 * Props:
 * @param {string | undefined} query - Current search query to fetch options for.
 * @param {number | undefined} pokemonId - Currently selected Pokémon id (option value).
 * @param {(id: number | undefined) => void} onChange - Called with the selected Pokémon id or undefined.
 * @param {(value: string) => void} onSearch - Called on input change to trigger searching.
 * @param {string} [formError] - Optional error message to show under the input.
 * @returns {React.ReactElement} MUI `Autocomplete` element configured for Pokémon search.
 */
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
                    helperText={formError || (error && 'Error fetching options')}
                    error={!!formError || !!error}
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
