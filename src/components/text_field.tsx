import MuiTextField from '@mui/material/TextField';
import MuiBox from '@mui/material/Box';

import { Span } from './typography';

type Props = React.ComponentProps<typeof MuiTextField>;

export default function TextField({ label, ...props }: Props) {
    return (
        <MuiBox sx={{ width: '100%' }}>
            {label && <Span sx={{ fontSize: '12px' }}>{label}</Span>}
            <MuiTextField fullWidth {...props} sx={{ fontSize: '14px' }} />
        </MuiBox>
    );
}
