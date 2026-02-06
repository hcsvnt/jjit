import styles from './page.module.css';
import RegisterForm from './register_form/register_form';
import getCurrentDate from '@/utils/current_date';

export default async function Home() {
    const currentDate = await getCurrentDate();
    return (
        <main className={styles.main}>
            <RegisterForm header={currentDate} />
        </main>
    );
}
