'use client';

import React from 'react';
import type { z } from 'zod';
import {
    Box,
    Autocomplete,
    CircularProgress,
    Card,
    CardContent,
    CardActions,
    CardHeader,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useSWR from 'swr';

import { debounce } from '@/utils/debounce';
import { schema } from './schema';
import type { FormSubmission } from './schema';

import Button from '../../../components/button';
import { P } from '@/components/typography';
import TextField from '@/components/text_field';
import { submit } from './submit';
import type { SearchResponse } from '@/app/api/search/route';
import SuccessDialog from '../success_dialog/success_dialog';
import PokemonDetails from '../pokemon_details/pokemon_details';
import { fetcher } from '@/utils/fetcher';

const DEFAULT_VALUES = {
    name: '',
    age: '',
    pokemon: '',
} as unknown as FormSubmission; // A bit of a hack to force empty inputs, while keeping the validation easy.

export default function RegisterForm({ header }: { header: React.ReactNode }) {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [query, setQuery] = React.useState<string | undefined>(undefined);
    const debouncedSetQuery = React.useMemo(() => debounce(setQuery, 200), []);
    const { data, error, isLoading } = useSWR(query ?? null, () =>
        fetcher<SearchResponse>('/api/search', { pokemon: query }),
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

    const onReset = () => {
        reset();
        setQuery('');
        setDialogOpen(false);
    };

    /**
     * This is necessary as empty state of the form can't be derived from either
     * the action state or hook form.
     */
    React.useEffect(() => {
        if (state.success) {
            setDialogOpen(true);
        }
    }, [state.success]);

    return (
        <Card sx={{ maxWidth: 544, padding: '32px' }}>
            <SuccessDialog open={dialogOpen} onClose={onReset} />
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
                                value={data?.find(({ id }) => id === watch('pokemon')) || null}
                                loading={isLoading}
                                loadingText="Loading options..."
                                noOptionsText="No options available"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Pokemon Name"
                                        placeholder="Choose"
                                        helperText={errors.pokemon?.message}
                                        error={!!errors.pokemon || !!error}
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
                    <Button type="reset" variant="soft" onClick={onReset}>
                        Reset
                    </Button>
                    <Button type="submit" variant="primary" disabled={isPending}>
                        Submit
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
}
