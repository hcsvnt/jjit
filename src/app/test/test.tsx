export default function Test({
    title,
    children,
    onClick,
}: {
    title: string;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <div>
            <h1>{title}</h1>
            <button type="button" onClick={onClick}>
                Click me
            </button>
            <div>{children}</div>
        </div>
    );
}
