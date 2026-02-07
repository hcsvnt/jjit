export const dynamic = 'force-dynamic';

import { theme } from '@/theme/theme';
import ErrorBoundary from './error_boundary';
import styles from './page.module.css';
import DateElement from './register_form/DateElement';
import RegisterForm from './register_form/register_form';
import { P } from '@/components/typography';

/**
 * Home (server component)
 *
 * Fetches the current date server-side and renders the registration form,
 * passing the date into the form header.
 *
 *
 * @remarks
 * Since this component renders the DateElement, which performs a server-side fetch,
 * we need to force the entire page to be dynamic.
 * This is still very beneficial, though, because we get the outer shell instantly,
 * with suspense waiting only for the date element, and not the entire form.
 *
 */
export default async function Home() {
    return (
        <main className={styles.main}>
            <ErrorBoundary
                fallback={
                    <P sx={{ color: theme.palette.error.main }}>
                        Sorry, an unexpected error occurred.
                        <br />
                        Reload the page to try again.
                </P>
                }
            >
                <RegisterForm dateElement={<DateElement />} />
            </ErrorBoundary>
        </main>
    );
}
