'use client';
import { debounce } from '@/utils/debounce';
import React, { useState, useCallback, useMemo } from 'react';
import {
    Box,
    // TextField,
    Autocomplete,
    CircularProgress,
    Alert,
    Typography,
    Card,
    CardContent,
    CardActions,
    CardHeader,
    Chip,
} from '@mui/material';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, type FormSubmission } from './schema';
import type { PokemonJSON, Pokemon } from '@/types';
import theme from '@/theme/theme';
import Button from '../../../components/button';
import { P } from '@/components/typography';
import TextField from '@/components/text_field';
// import Autocomplete from '@/components/autocomplete';
import type * as z from 'zod';

import { submit } from './submit';
import useSWR from 'swr';
import type { SearchResponse } from '@/app/api/search/route';

type PokemonOption = PokemonJSON['data'][number];

const DEFAULT_VALUES: FormSubmission = {
    name: '',
    age: 0,
    pokemon: 0,
} as const;

// const DEFAULT_VALUES: FormSubmission = {
//     name: 'Teddy',
//     age: 17,
//     pokemon: 1,
// } as const;

function genericFetcher<T>(url: string, body: Record<string, any>): Promise<T> {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then((res) => {
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        return res.json() as Promise<T>;
    });
}

export default function RegisterForm({ header }: { header: React.ReactNode }) {
    const [query, setQuery] = useState<string | undefined>(undefined);
    const debouncedSetQuery = React.useMemo(() => debounce(setQuery, 200), []);
    const {
        data: data,
        error,
        isLoading,
    } = useSWR(query ?? null, () =>
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
                        render={({ field: { onChange, value } }) => (
                            <Autocomplete
                                options={data || []}
                                getOptionLabel={({ name }) => name}
                                onChange={(_, value) => onChange(value?.id)}
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
                            <DetailsContent pokemonId={watch('pokemon')} />
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

function DetailsContent({ pokemonId }: { pokemonId: number }) {
    const { data, error, isLoading } = useSWR(pokemonId ? [`/api/details`, pokemonId] : null, () =>
        genericFetcher<Pokemon>(`/api/details`, { pokemon: pokemonId }),
    );
    const { name, types, base_experience, id, sprites } = data || {};

    console.log({ data });
    // name, type, base ex  perience, id, sprite

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">Failed to load Pokémon details.</Alert>;
    }

    if (!data) {
        return <P sx={{ color: theme.palette.grey[200] }}>Your pokemon</P>;
    }

    return (
        <Box sx={{ textAlign: 'center' }}>
            {sprites && (
                <div>
                    <Image src={sprites.front_default} alt={name ?? ''} width={96} height={96} />
                </div>
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
