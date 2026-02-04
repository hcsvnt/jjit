import { z } from 'zod';


export const schema = z.object({
    pokemon: z.string().trim().min(1, 'must select a pokemon'),
});

export type FormSubmission = z.infer<typeof schema>;
