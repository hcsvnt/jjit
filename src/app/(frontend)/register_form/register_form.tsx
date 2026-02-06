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
import { P, Span } from '@/components/typography';
import TextField from '@/components/text_field';
import Autocomplete from '@/components/autocomplete';

type PokemonOption = PokemonJSON['data'][number];

export default function RegisterForm({ header }: { header: React.ReactNode }) {
    console.log('RegisterForm rendered with header:', header);
    return (
        <Card sx={{ maxWidth: 544, padding: '32px' }}>
            <CardHeader
                title={<P sx={{ fontSize: '12px', textAlign: 'right' }}>{header}</P>}
                sx={{ padding: 0 }}
            />
            <CardContent sx={{ paddingInline: 0 }}>
                <Box sx={{ display: 'flex', gap: '24px', mb: '24px' }}>
                    <TextField
                        label="Trainer's Name"
                        placeholder="Trainer's Name"
                        // helperText="Helper text"
                        // error={true}
                    />
                    <TextField
                        label="Trainer's Age"
                        placeholder="Trainer's Age"
                        type="number"
                        // helperText="Helper text"
                        // error={true}
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
                <Button variant="soft" onClick={() => console.log('Reset clicked')}>
                    Reset
                </Button>
                <Button variant="primary" onClick={() => console.log('Submit clicked')}>
                    Submit
                </Button>
            </CardActions>
        </Card>
    );
}
