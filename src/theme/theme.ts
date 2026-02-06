import { createTheme } from '@mui/material/styles';

declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        primary: true;
        soft: true;
    }
}

/**
 * These need to be kept in sync with the CSS variables defined in src/app/(frontend)/globals.css
 */
const colors = {
    background: '#ffffff',
    foreground: '#000000',
    primary: '#9747ff',
    primaryDark: '#7135bf',
    primaryLight: '#9747FF40',
    grey100: '#2a2a2a',
    grey200: '#7f7f7f',
    grey300: '#e4e4e4',
    grey400: '#eeeeee',
    disabled: '#00000033',
    error: '#ff4e4e',
};

export const theme = createTheme({
    palette: {
        primary: {
            main: colors.primary,
            dark: colors.primaryDark,
            light: colors.primaryLight,
        },
        background: {
            default: colors.background,
            paper: colors.background,
        },
        text: {
            primary: colors.foreground,
            secondary: colors.grey200,
        },
        error: {
            main: colors.error,
        },
        grey: {
            100: colors.grey100,
            200: colors.grey200,
            300: colors.grey300,
            400: colors.grey400,
        },
    },
    typography: {
        fontFamily: 'var(--font-primary)',
        fontSize: 14,
    },
    components: {

        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    border: 'var(--border)',
                }
            }
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    lineHeight: '20px',
                    padding: '10px 24px',
                    borderRadius: 'var(--radius)',
                    textTransform: 'none',
                    variants: [
                        {
                            props: { variant: 'primary' },
                            style: {
                                color: colors.background,
                                backgroundColor: colors.primary,
                                '&:hover': {
                                    backgroundColor: colors.primaryDark,
                                },
                                '&:focus': {
                                    backgroundColor: colors.primaryDark,
                                    boxShadow: 'var(--shadow-focus)',
                                },
                            },
                        },
                        {
                            props: { variant: 'soft' },
                            style: {
                                backgroundColor: colors.grey400,
                                '&:hover': {
                                    backgroundColor: colors.grey300,
                                },
                                '&:focus': {
                                    backgroundColor: colors.grey300,
                                    boxShadow: 'var(--shadow-focus)',
                                },
                            },
                        },
                    ],
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    fontSize: '12px',
                    lineHeight: '20px',
                    height: 'initial',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: colors.primaryLight,
                    color: colors.foreground,

                    'span.MuiChip-label': {
                        padding: 0,
                    },
                },
            },
        },

        MuiTextField: {
            styleOverrides: {
                root: {

                    '& fieldset': {
                        border: 'var(--border)',
                    },

                    "& .MuiOutlinedInput-root": {
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            border: '1px solid var(--color-primary)',
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: '1px solid var(--color-primary)',
                            boxShadow: 'var(--shadow-focus)',
                        }
                    },

                    'div.MuiInputBase-root': {
                        fontSize: '14px',
                    },

                    'p.MuiFormHelperText-root': {
                        marginLeft: 0,
                        color: colors.foreground
                    }
                },
            },
        },

        MuiAutocomplete: {
            styleOverrides: {
                paper: {
                    boxShadow: '0px 4px 10px 2px rgba(0, 0, 0, 0.1)',
                },
                listbox: {
                    maxHeight: '300px',
                },
            },
        },
    },
});

export default theme;
