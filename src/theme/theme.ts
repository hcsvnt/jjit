import { createTheme } from '@mui/material/styles';


/**
 * These need to be kept in sync with the CSS variables defined in src/app/(frontend)/globals.css
 */
const colors = {
    background: '#ffffff',
    foreground: '#000000',
    primary: '#9747ff',
    primaryDark: '#7135bf',
    primaryLight: '#9747ff',
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
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: colors.grey300,
                        },
                        '&:hover fieldset': {
                            borderColor: colors.grey200,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: colors.primary,
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontSize: '1rem',
                },
                contained: {
                    backgroundColor: colors.primary,
                    '&:hover': {
                        backgroundColor: colors.primaryDark,
                    },
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
