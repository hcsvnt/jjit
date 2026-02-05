import { z } from 'zod';

export type ActionResponse<T extends Record<string, string | number>> = {
    success: boolean;
    message: string;
    fields: T;
    errors?: {
        errors: string[];
        properties?: {
            [K in keyof T]?: {
                errors: string[];
            };
        };
    };
};

const MESSAGES = {
    NAME_LENGTH: 'Required from 2 to 20 symbols',
    AGE_RANGE: 'Required range from 16-99',
    POKEMON_CHOOSE: 'Choose something',
} as const;

export const schema = z.object({
    name: z.string()
        .trim()
        .min(2, MESSAGES.NAME_LENGTH)
        .max(20, MESSAGES.NAME_LENGTH),
    age: z
        .number()
        .min(16, MESSAGES.AGE_RANGE)
        .max(99, MESSAGES.AGE_RANGE),
    pokemon: z
        .number()
        .int()
        .positive(MESSAGES.POKEMON_CHOOSE),
});

export type FormSubmission = z.infer<typeof schema>;
