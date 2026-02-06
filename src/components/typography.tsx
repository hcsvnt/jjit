import MuiTypography from '@mui/material/Typography';

type Props = React.ComponentProps<typeof MuiTypography>;

export function P({ children, sx, ..._props }: Props) {
    return (
        <MuiTypography variant="body1" component="p" sx={{ ...sx }}>
            {children}
        </MuiTypography>
    );
}

export function Span({ children, ...props }: Props) {
    return (
        <MuiTypography variant="body1" component="span" {...props}>
            {children}
        </MuiTypography>
    );
}


export function List({ children, sx }: { children: React.ReactNode; sx?: React.CSSProperties }) {
    return (
        <MuiTypography component="ul" variant="body1" sx={{ paddingLeft: '20px', ...sx }}>
            {children}
        </MuiTypography>
    );
}

export function ListItem({ children, sx }: { children: React.ReactNode; sx?: React.CSSProperties }) {
    return (
        <MuiTypography component="li" variant="body1" sx={{ marginBottom: '4px', ...sx }}>
            {children}
        </MuiTypography>
    );
}

export function Heading({
    level,
    size,
    children,
}: {
    level: 1 | 2 | 3;
    size: 1 | 2 | 3;
    children: React.ReactNode;
}) {
    return (
        <MuiTypography
            component={`h${level}`}
            variant={`h${size}`}
        >
            {children}
        </MuiTypography>
    );
}
