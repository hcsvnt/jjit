'use client';

import React from 'react';
import type { z } from 'zod';
import {
    Box,
    Autocomplete,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardActions,
    CardHeader,
    Chip,
} from '@mui/material';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useSWR from 'swr';

import { debounce } from '@/utils/debounce';
import { schema, type FormSubmission } from './schema';
import type { Pokemon } from '@/types';
import theme from '@/theme/theme';
import Button from '../../../components/button';
import { List, ListItem, P } from '@/components/typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@/components/text_field';
import { submit } from './submit';
import type { SearchResponse } from '@/app/api/search/route';

/**
 * Generic fetcher for SWR that makes POST requests with JSON body.
 * @param url - The API endpoint URL
 * @param body - The request body object
 * @returns Promise resolving to the JSON response
 * @throws Error if the response is not ok
 */
function genericFetcher<T>(url: string, body: Record<string, unknown>): Promise<T> {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then((res) => {
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        return res.json() as Promise<T>;
    });
}

export default function RegisterForm({ header }: { header: React.ReactNode }) {
    const [query, setQuery] = React.useState<string | undefined>(undefined);
    const debouncedSetQuery = React.useMemo(() => debounce(setQuery, 200), []);
    const { data, error, isLoading } = useSWR(query ?? null, () =>
        genericFetcher<SearchResponse>('/api/search', { pokemon: query }),
    );

    const [state, action, isPending] = React.useActionState(submit, {
        success: false,
        message: '',
        fields: { name: '', age: 0, pokemon: 0 }, // types here need to be strictly aligned with FormSubmission...
    });

    const {
        control,
        reset,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { name: '', age: undefined, pokemon: undefined }, // but here we want them undefined to start with empty fields
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const onSubmit = async (data: z.infer<typeof schema>) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, String(value));
        });

        React.startTransition(() => {
            action(formData);
        });
    };

    return (
        <Card sx={{ maxWidth: 544, padding: '32px' }}>
            <CardHeader
                title={<P sx={{ fontSize: '12px', textAlign: 'right' }}>{header}</P>}
                sx={{ padding: 0 }}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent sx={{ paddingInline: 0 }}>
                    <Box sx={{ display: 'flex', gap: '24px', mb: '24px' }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="Trainer's Name"
                                    placeholder="Trainer's Name"
                                    autoComplete="given-name"
                                    helperText={fieldState.error?.message}
                                    error={!!fieldState.error}
                                    {...field}
                                />
                            )}
                        />

                        <Controller
                            name="age"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="Trainer's Age"
                                    placeholder="Trainer's Age"
                                    autoComplete="age"
                                    type="number"
                                    helperText={fieldState.error?.message}
                                    error={!!fieldState.error}
                                    {...field}
                                />
                            )}
                        />
                    </Box>

                    <Controller
                        name="pokemon"
                        control={control}
                        render={({ field: { onChange } }) => (
                            <Autocomplete
                                options={data ?? []}
                                getOptionLabel={({ name }) => name}
                                onChange={(_, option) => onChange(option?.id)}
                                onInputChange={(_, inputValue) => debouncedSetQuery(inputValue)}
                                loading={isLoading}
                                loadingText="Loading options..."
                                noOptionsText="No options available"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Pokemon Name"
                                        placeholder="Choose"
                                        helperText={errors.pokemon?.message}
                                        error={!!errors.pokemon}
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: isLoading ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={20}
                                                        sx={{ position: 'relative', left: '20px' }}
                                                    />
                                                ) : (
                                                    params.InputProps.endAdornment
                                                ),
                                            },
                                        }}
                                    />
                                )}
                            />
                        )}
                    />

                    <Card sx={{ mt: '24px' }}>
                        <CardContent
                            sx={{
                                height: '254px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <PokemonDetails pokemonId={watch('pokemon')} />
                        </CardContent>
                    </Card>
                </CardContent>
                <CardActions sx={{ justifyContent: 'end', gap: '16px', paddingInline: 0, pb: 0 }}>
                    <Button type="reset" variant="soft" onClick={reset}>
                        Reset
                    </Button>
                    <Button type="submit" variant="primary">
                        Submit
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
}

function PokemonDetails({ pokemonId }: { pokemonId: number }) {
    const { data, error, isLoading } = useSWR(pokemonId ? [`/api/details`, pokemonId] : null, () =>
        genericFetcher<Pokemon>(`/api/details`, { pokemon: pokemonId }),
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
                    Type:{' '}
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
