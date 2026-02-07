import getCurrentDate from '@/utils/current_date';

export default async function DateElement() {
    const currentDate = await getCurrentDate();
    // todo: add dateTime attribute, but it needs to be in ISO format.
    return <time /* dateTime={currentDate} */>{currentDate}</time>;
}
