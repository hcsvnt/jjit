import { get } from 'http';
import styles from './page.module.css';
import RegisterFormOld from './register_form/old';
import RegisterForm from './register_form/register_form';
import getCurrentDate from '@/utils/current_date';
import { Box } from '@mui/material';

export default async function Home() {
    const currentDate = await getCurrentDate();
    return (
        <main className={styles.main}>
            <RegisterForm header={currentDate} />
        </main>
    );
}
