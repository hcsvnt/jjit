import MuiChip from '@mui/material/Chip';

export default function Chip({ label }: { label: string }) {
    return <MuiChip label={label} />;
}
