import MuiChip from '@mui/material/Chip';

export default function Label({ label }: { label: string }) {
    return <MuiChip label={label} />;
}
