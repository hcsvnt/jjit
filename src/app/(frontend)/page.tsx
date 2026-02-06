import styles from './page.module.css';
import RegisterForm from './register_form/register_form';
import getCurrentDate from '@/utils/current_date';

/**
 * Home (server component)
 *
 * Fetches the current date server-side and renders the registration form,
 * passing the date into the form header.
 */
export default async function Home() {
    const currentDate = await getCurrentDate();
    return (
        <main className={styles.main}>
            <RegisterForm header={currentDate} />
        </main>
    );
}
