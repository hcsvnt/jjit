import styles from './page.module.css';
import DateElement from './register_form/DateElement';
import RegisterForm from './register_form/register_form';

/**
 * Home (server component)
 *
 * Fetches the current date server-side and renders the registration form,
 * passing the date into the form header.
 *
 *
 */
export default async function Home() {
    return (
        <main className={styles.main}>
            <RegisterForm dateElement={<DateElement />} />
        </main>
    );
}
