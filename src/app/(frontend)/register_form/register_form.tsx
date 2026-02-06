'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
    Box,
    // TextField,
    // Autocomplete,
    CircularProgress,
    Alert,
    Typography,
    Card,
    CardContent,
    CardActions,
    CardHeader,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, type FormSubmission } from './schema';
import type { PokemonJSON, Pokemon } from '@/types';
import theme from '@/theme/theme';
import Button from '../../../components/button';
import { P } from '@/components/typography';
import TextField from '@/components/text_field';
import Autocomplete from '@/components/autocomplete';
import type * as z from 'zod';

import { submit } from './submit';

type PokemonOption = PokemonJSON['data'][number];

const DEFAULT_VALUES: FormSubmission = {
    name: '',
    age: 0,
    pokemon: 0,
} as const;

export default function RegisterForm({ header }: { header: React.ReactNode }) {
    const [state, action, isPending] = React.useActionState(submit, {
        success: false,
        message: '',
        fields: { ...DEFAULT_VALUES },
    });

    const {
        control,
        register,
        handleSubmit,
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

                    <Autocomplete
                        options={['Option A', 'Option B', 'Option C']}
                        noOptionsText="Choose"
                        renderInput={(params) => (
                            <TextField {...params} label="Pokemon Name" placeholder="Choose" />
                        )}
                        onChange={(event, value) => console.log('Selected:', value)}
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
                            <P sx={{ color: theme.palette.grey[200] }}>your pokemon</P>
                        </CardContent>
                    </Card>
                </CardContent>
                <CardActions sx={{ justifyContent: 'end', gap: '16px', paddingInline: 0, pb: 0 }}>
                    <Button
                        type="submit"
                        variant="soft"
                        onClick={() => console.log('Reset clicked')}
                    >
                        Reset
                    </Button>
                    <Button
                        type="reset"
                        variant="primary"
                        onClick={() => console.log('Submit clicked')}
                    >
                        Submit
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
}
