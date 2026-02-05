import MuiButton from '@mui/material/Button';

export default function Button({
    children,
    onClick,
    variant = 'primary',
}: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'soft';
}) {
    return (
        <MuiButton type="button" onClick={onClick} variant={variant}>
            {children}
        </MuiButton>
    );
}
