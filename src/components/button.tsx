import MuiButton from '@mui/material/Button';

export default function Button({
    children,
    type = 'button',
    onClick,
    variant = 'primary',
}: {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    variant?: 'primary' | 'soft';
}) {
    return (
        <MuiButton type={type} onClick={onClick} variant={variant}>
            {children}
        </MuiButton>
    );
}
