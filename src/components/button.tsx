import MuiButton from '@mui/material/Button';

type Props = React.ComponentProps<typeof MuiButton>;

export default function Button({
    children,
    type = 'button',
    onClick,
    variant = 'primary',
    ...rest
}: Props) {
    return (
        <MuiButton type={type} onClick={onClick} variant={variant} {...rest}>
            {children}
        </MuiButton>
    );
}
