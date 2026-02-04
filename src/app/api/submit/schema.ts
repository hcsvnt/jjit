import { z } from 'zod';


export const schema = z.object({
    name: z.string().trim().min(2, 'is too short').max(20, 'is too long'),
    age: z
        .number()
        .min(16, 'too young to be a Pokemon Teacher')
        .max(99, 'pokemon teachers retire at 100'),
    pokemon: z.number().int().positive('must be a valid Pokemon ID'),
});

export type FormSubmission = z.infer<typeof schema>;
