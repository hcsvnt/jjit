import { z } from 'zod';


export const schema = z.object({
    pokemon: z.string().trim().min(1)
});
