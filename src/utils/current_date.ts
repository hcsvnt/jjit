type TimeApiResponse = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    seconds: number;
    milliSeconds: number;
    dateTime: string; // "2026-02-05T19:40:00"
    date: string; // "02/05/2026"
    time: string; // "19:40"
    timeZone: 'Europe/Warsaw'; // hardcoded in the url
    dstActive: boolean;
    dayOfWeek: string; // "Thursday"
};

/**
 * Fetches the current date and time from the Time API for the Europe/Warsaw timezone.
 * @returns A promise that resolves to a string representation of the current date
 * in the following format "Wednesday, 06.03.2024".
 */
export default async function getCurrentDate(): Promise<string> {
    try {
        const url = process.env.TIME_API_URL;

        if (!url) {
            throw new Error('TIME_API_URL is not configured');
        }

        const response = await fetch(url, { cache: 'no-store' });
        const data: TimeApiResponse = await response.json();
        const { dayOfWeek, date } = data;
        return `${dayOfWeek}, ${date.replaceAll('/', '.')}`;
    } catch (error) {
        console.error('Error fetching current date:', error);
        return 'Date unavailable';
    }
}


// todo: add tests
