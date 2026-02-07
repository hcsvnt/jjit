import { NextResponse } from 'next/server';

export async function GET() {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate network delay
    return NextResponse.json({
        year: 2026,
        month: 2,
        day: 5,
        hour: 19,
        minute: 40,
        seconds: 0,
        milliSeconds: 0,
        dateTime: '2026-02-05T19:40:00',
        date: '02/05/2026',
        time: '19:40',
        timeZone: 'Europe/Warsaw',
        dstActive: false,
        dayOfWeek: 'Thursday',
    });
}
