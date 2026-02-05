'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
    Box,
    TextField,
    Autocomplete,
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

type PokemonOption = PokemonJSON['data'][number];

export default function RegisterForm({ header }: { header: React.ReactNode }) {
    console.log('RegisterForm rendered with header:', header);
    return (
        <Card
            sx={{
                width: 544,
                height: 614,
                // borderRadius: theme.spacing(2),
                // borderWidth: 1,
                // borderStyle: 'solid',
                // borderColor: 'rgba(0,0,0,0.12)',
                padding: '32px',
            }}
        >
            <CardHeader title={header} />
            <CardContent>Form content goes here</CardContent>
            <CardActions>
                <Button onClick={() => console.log('Submit clicked')}>
                    Submit
                </Button>
            </CardActions>
        </Card>
    );
}
