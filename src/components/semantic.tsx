import Box from '@mui/material/Box';

type Props = React.ComponentProps<typeof Box>;

export function Main({ children, ...rest }: Props) {
    return (
        <Box component="main" {...rest}>
            {children}
        </Box>
    );
}

export function Section({ children, ...rest }: Props) {
    return (
        <Box component="section" {...rest}>
            {children}
        </Box>
    );
}

export function Article({ children, ...rest }: Props) {
    return (
        <Box component="article" {...rest}>
            {children}
        </Box>
    );
}
