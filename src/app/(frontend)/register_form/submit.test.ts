import { describe, expect, it } from 'vitest';

import type { ActionResponse, FormSubmission } from './schema';
import { MOCKS } from './mocks';
import { submit } from './submit';

function makeFormData(values: Record<string, string | number | null | undefined>) {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
        if (value === null || value === undefined) continue;
        formData.set(key, String(value));
    }

    return formData;
}

const prevState = {
    success: false,
    message: '',
    fields: MOCKS.valid,
} satisfies ActionResponse<FormSubmission>;

describe('Register Form submit (server action)', () => {
    it('returns success response for valid submission', async () => {
        const formData = makeFormData(MOCKS.valid);

        const result = await submit(prevState, formData);

        expect(result.success).toBe(true);
        expect(result.message).toBe('Success');
        expect(result.fields).toEqual(MOCKS.valid);
        expect(result.errors).toBeUndefined();
    });

    it('returns validation errors for underage submission', async () => {
        const formData = makeFormData(MOCKS.underage);

        const result = await submit(prevState, formData);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Please correct the errors.');
        expect(result.fields).toEqual(MOCKS.underage);

        expect(result.errors).toBeDefined();
        expect(result.errors?.properties?.age?.errors).toEqual(
            expect.arrayContaining(['Required range from 16-99']),
        );
    });

    it('returns validation errors when pokemon is not chosen', async () => {
        const formData = makeFormData(MOCKS.noPokemon);

        const result = await submit(prevState, formData);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Please correct the errors.');
        expect(result.fields).toEqual(MOCKS.noPokemon);

        expect(result.errors).toBeDefined();
        expect(result.errors?.properties?.pokemon?.errors).toEqual(
            expect.arrayContaining(['Choose something']),
        );
    });

    it('coerces missing fields and still reports validation errors', async () => {
        const formData = makeFormData({});

        const result = await submit(prevState, formData);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Please correct the errors.');

        // coercion behavior from submit.tsx
        expect(result.fields).toEqual({
            name: 'null',
            age: 0,
            pokemon: 0,
        });

        expect(result.errors?.properties?.age?.errors).toBeDefined();
        expect(result.errors?.properties?.pokemon?.errors).toBeDefined();
    });
});
