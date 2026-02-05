import styles from './page.module.css';
import RegisterForm from './register_form/register_form';

async function getCurrentDate(): Promise<string> {
    return '';
    try {
        const response = await fetch(
            'https://www.timeapi.io/api/Time/current/zone?timeZone=Europe/Warsaw',
            {
                cache: 'no-store',
            },
        );
        const data = await response.json();
        const date = new Date(`${data.date}T${data.time}`);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    } catch (error) {
        console.error('Failed to fetch current date:', error);
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    }
}

export default async function Home() {
    const currentDate = await getCurrentDate();

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <RegisterForm currentDate={currentDate} />
            </main>
        </div>
    );
}
