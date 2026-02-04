import Image from 'next/image';
import styles from './page.module.css';
import Test from './test/test';

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Test title="Welcome to Pokemon Teacher Registration!">
                    <p>Select your favorite Pokemon and become a certified Pokemon Teacher.</p>
                </Test>
            </main>
        </div>
    );
}
