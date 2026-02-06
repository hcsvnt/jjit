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
import { P } from '@/components/typography';
import TextField from '@/components/text_field';
import { submit } from './submit';
import type { SearchResponse } from '@/app/api/search/route';

const DEFAULT_VALUES: FormSubmission = {
    name: '',
    age: 0,
    pokemon: 0,
} as const;

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
        fields: { ...DEFAULT_VALUES },
    });

    const {
        control,
        reset,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { ...DEFAULT_VALUES },
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
                                noOptionsText="No options available"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Pokemon Name"
                                        placeholder="Choose"
                                        helperText={errors.pokemon?.message}
                                        error={!!errors.pokemon}
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
        <Box sx={{ textAlign: 'center' }}>
            {sprites?.front_default && (
                <Image src={sprites.front_default} alt={name} width={96} height={96} />
            )}
            <P variant="h6">Name: {name}</P>
            <P variant="body2">
                Type:{' '}
                {types?.map((type) => (
                    <Chip key={type.type.name} label={type.type.name} />
                ))}
            </P>
            <P variant="body2">Base Experience: {base_experience}</P>
            <P variant="body2">ID: {id}</P>
        </Box>
    );
}
