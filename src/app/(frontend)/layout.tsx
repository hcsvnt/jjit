import type { Metadata } from 'next';
import fonts from '@/utils/fonts';
import { MuiThemeProvider } from '@/providers/theme-provider';
import './globals.css';

/** Page metadata for the frontend app. */
export const metadata: Metadata = {
    title: 'Pokemon Teacher Registration',
    description: 'A simple app to register as a Pokemon Teacher and select your favorite Pokemon.',
};

/**
 * RootLayout
 *
 * Top-level layout for the frontend app. Adds favicons/manifest and wraps
 * content in the `MuiThemeProvider` and the app font.
 *
 * @param {{ children: React.ReactNode }} props.children - app content
 * @returns {JSX.Element}
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
            <body className={`${fonts.IBMFont.variable}`}>
                <MuiThemeProvider>{children}</MuiThemeProvider>
            </body>
        </html>
    );
}
