import TestClient from './test.client';

const url = process.env.SERVER_URL || 'http://localhost:3000';

export default async function Test({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h1>{title}</h1>
            <TestClient />
            <div>{children}</div>
        </div>
    );
}
