'use client';

import Button from '@/components/button';
import Chip from '@/components/chip';
import TextField from '@/components/text_field';
import { Main, Section, Article } from '@/components/semantic';

export default function Home() {
    return (
        <Main
            sx={{
                margin: '2rem 4rem',
                padding: '1rem 2rem',
                border: '1px dashed var(--color-grey-100)',
                borderRadius: 'var(--radius)',
            }}
        >
            <h1>UI Elements</h1>

            <Component name="Button">
                <Variant name="Primary">
                    <Button variant="primary" onClick={() => console.log('Primary clicked')}>
                        Primary
                    </Button>
                </Variant>
                <Variant name="Soft">
                    <Button variant="soft" onClick={() => console.log('Soft clicked')}>
                        Soft
                    </Button>
                </Variant>
            </Component>

            <hr />

            <Component name="Chip">
                <Variant name="Default">
                    <Chip label="Some text" />
                </Variant>
            </Component>

            <hr />

            <Component name="Text Field">
                <Variant name="Default">
                    <TextField
                        label="Label"
                        helperText="Helper text"
                        // error={true}
                        placeholder="Enter some text"
                    />
                </Variant>
                <Variant name="Error">
                    <TextField
                        label="Label"
                        value="Invalid input"
                        placeholder="Enter some text"
                        helperText="Error text"
                        error={true}
                    />
                </Variant>
            </Component>
        </Main>
    );
}

function Component({ name, children }: { name: string; children: React.ReactNode }) {
    return (
        <Section>
            <h2>{name}</h2>
            {children}
        </Section>
    );
}

function Variant({ name, children }: { name: string; children: React.ReactElement }) {
    return (
        <Article
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
            }}
        >
            <h3>{name}</h3>
            {children}
        </Article>
    );
}
