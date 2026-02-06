import Button from '@/components/button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import { P } from '@/components/typography';

export default function SuccessDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <Card sx={{ p: '32px 120px', textAlign: 'center' }}>
                <P sx={{ fontSize: '40px', mb: '16px' }}>Success</P>
                <Button onClick={onClose}>Reset form</Button>
            </Card>
        </Dialog>
    );
}
