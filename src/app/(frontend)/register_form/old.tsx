'use client';

import { useState, useCallback, useMemo } from 'react';
import {
    Box,
    TextField,
    Button,
    Autocomplete,
    CircularProgress,
    Alert,
    Typography,
    Card,
    CardContent,
    CardActions,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, type FormSubmission } from './schema';
import type { PokemonJSON, Pokemon } from '@/types';
import theme from '@/theme/theme';

type PokemonOption = PokemonJSON['data'][number];

export default function RegisterForm() {
    const [pokemonOptions, setPokemonOptions] = useState<PokemonOption[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [pokemonDetails, setPokemonDetails] = useState<Pokemon | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormSubmission>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            age: undefined,
            pokemon: undefined,
        },
    });

    // Debounce search requests
    const debounceTimer = useMemo(() => ({ current: null as NodeJS.Timeout | null }), []);

    const handlePokemonSearch = useCallback(
        async (value: string) => {
            if (!value.trim()) {
                setPokemonOptions([]);
                return;
            }

            setLoadingOptions(true);

            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            debounceTimer.current = setTimeout(async () => {
                try {
                    const response = await fetch('/api/search', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pokemon: value }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setPokemonOptions(data.results || []);
                    } else {
                        setPokemonOptions([]);
                    }
                } catch (error) {
                    console.error('Error searching Pokemon:', error);
                    setPokemonOptions([]);
                } finally {
                    setLoadingOptions(false);
                }
            }, 200);
        },
        [debounceTimer],
    );

    const handlePokemonSelect = useCallback(async (pokemon: PokemonOption | null) => {
        if (!pokemon) {
            setPokemonDetails(null);
            return;
        }

        setLoadingDetails(true);
        try {
            const response = await fetch('/api/details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pokemon: pokemon.id }),
            });

            if (response.ok) {
                const data = await response.json();
                setPokemonDetails(data.pokemon);
            } else {
                setPokemonDetails(null);
            }
        } catch (error) {
            console.error('Error fetching Pokemon details:', error);
            setPokemonDetails(null);
        } finally {
            setLoadingDetails(false);
        }
    }, []);

    const onSubmit = async (data: FormSubmission) => {
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSubmitSuccess(true);
                reset();
                setPokemonDetails(null);
                setPokemonOptions([]);
            } else {
                const errorData = await response.json();
                setSubmitError(errorData.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError('An error occurred while submitting the form');
        }
    };

    const handleReset = () => {
        reset();
        setSubmitSuccess(false);
        setSubmitError(null);
        setPokemonDetails(null);
        setPokemonOptions([]);
    };

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default,
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Main form container */}
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%',
                }}
            >
                {submitSuccess ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            padding: '3rem',
                            backgroundColor: theme.palette.grey[400],
                            borderRadius: theme.shape.borderRadius,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                marginBottom: '2rem',
                                color: theme.palette.text.primary,
                                fontFamily: 'var(--font-primary)',
                            }}
                        >
                            Sukces!
                        </Typography>
                        <Button
                            type="button"
                            onClick={handleReset}
                            variant="contained"
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: '#ffffff',
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                fontFamily: 'var(--font-primary)',
                            }}
                        >
                            Reset
                        </Button>
                    </Box>
                ) : (
                    <>
                        {submitError && (
                            <Alert severity="error" sx={{ marginBottom: '1.5rem' }}>
                                {submitError}
                            </Alert>
                        )}

                        {/* Name and Age fields */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: '1rem',
                                marginBottom: '1.5rem',
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        marginBottom: '0.5rem',
                                        fontFamily: 'var(--font-primary)',
                                        fontWeight: '500',
                                    }}
                                >
                                    Trainer's name
                                </Typography>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            placeholder="Trainer's name"
                                            fullWidth
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    fontFamily: 'var(--font-primary)',
                                                },
                                                '& .MuiFormHelperText-root': {
                                                    fontFamily: 'var(--font-primary)',
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        marginBottom: '0.5rem',
                                        fontFamily: 'var(--font-primary)',
                                        fontWeight: '500',
                                    }}
                                >
                                    Trainer's age
                                </Typography>
                                <Controller
                                    name="age"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            placeholder="Trainer's age"
                                            type="number"
                                            fullWidth
                                            error={!!errors.age}
                                            helperText={errors.age?.message}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                    ? parseInt(e.target.value, 10)
                                                    : undefined;
                                                field.onChange(value);
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    fontFamily: 'var(--font-primary)',
                                                },
                                                '& .MuiFormHelperText-root': {
                                                    fontFamily: 'var(--font-primary)',
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        </Box>

                        {/* Pokemon autocomplete */}
                        <Box sx={{ marginBottom: '1.5rem' }}>
                            <Typography
                                sx={{
                                    marginBottom: '0.5rem',
                                    fontFamily: 'var(--font-primary)',
                                    fontWeight: '500',
                                }}
                            >
                                Pokemon name
                            </Typography>
                            <Controller
                                name="pokemon"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Autocomplete
                                        options={pokemonOptions}
                                        getOptionLabel={(option) => option.name}
                                        isOptionEqualToValue={(option, val) =>
                                            val === undefined || option.id === val
                                        }
                                        value={
                                            value !== undefined
                                                ? pokemonOptions.find((p) => p.id === value) || null
                                                : null
                                        }
                                        onChange={(_, selected) => {
                                            onChange(selected?.id);
                                            handlePokemonSelect(selected);
                                        }}
                                        onInputChange={(_, inputValue) => {
                                            handlePokemonSearch(inputValue);
                                        }}
                                        loading={loadingOptions}
                                        noOptionsText="Choose"
                                        placeholder="Choose"
                                        filterOptions={(x) => x}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: 'var(--font-primary)',
                                            },
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!errors.pokemon}
                                                helperText={errors.pokemon?.message}
                                                placeholder="Choose"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {loadingOptions ? (
                                                                <CircularProgress
                                                                    color="inherit"
                                                                    size={20}
                                                                />
                                                            ) : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiFormHelperText-root': {
                                                        fontFamily: 'var(--font-primary)',
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Box>

                        {/* Pokemon details preview */}
                        {loadingDetails ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    padding: '2rem',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        ) : pokemonDetails ? (
                            <Card
                                sx={{
                                    marginBottom: '1.5rem',
                                    backgroundColor: theme.palette.grey[400],
                                    border: `1px solid ${theme.palette.grey[300]}`,
                                }}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: '2rem',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            marginBottom: '1rem',
                                            fontFamily: 'var(--font-primary)',
                                            color: theme.palette.text.secondary,
                                        }}
                                    >
                                        Your pokemon
                                    </Typography>

                                    {pokemonDetails.sprites?.front_default && (
                                        <Box
                                            component="img"
                                            src={pokemonDetails.sprites.front_default}
                                            alt={pokemonDetails.name}
                                            sx={{
                                                width: '150px',
                                                height: '150px',
                                                marginBottom: '1rem',
                                            }}
                                        />
                                    )}

                                    <Typography
                                        sx={{
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold',
                                            marginBottom: '0.5rem',
                                            textTransform: 'capitalize',
                                            fontFamily: 'var(--font-primary)',
                                        }}
                                    >
                                        {pokemonDetails.name}
                                    </Typography>

                                    {pokemonDetails.types && pokemonDetails.types.length > 0 && (
                                        <Typography
                                            sx={{
                                                fontSize: '0.9rem',
                                                color: theme.palette.text.secondary,
                                                fontFamily: 'var(--font-primary)',
                                            }}
                                        >
                                            Type:{' '}
                                            {pokemonDetails.types
                                                .map((t) => t.type.name)
                                                .join(', ')}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        ) : null}

                        {/* Action buttons */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '1rem',
                            }}
                        >
                            <Button
                                type="button"
                                onClick={handleReset}
                                sx={{
                                    backgroundColor: theme.palette.grey[300],
                                    color: theme.palette.text.primary,
                                    padding: '0.75rem 1.5rem',
                                    fontSize: '1rem',
                                    fontFamily: 'var(--font-primary)',
                                    '&:hover': {
                                        backgroundColor: theme.palette.grey[200],
                                    },
                                }}
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    color: '#ffffff',
                                    padding: '0.75rem 1.5rem',
                                    fontSize: '1rem',
                                    fontFamily: 'var(--font-primary)',
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    },
                                }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}
