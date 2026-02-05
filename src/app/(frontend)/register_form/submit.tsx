'use server';

import { z } from 'zod';
import type { ActionResponse, FormSubmission } from './schema';
import { schema } from './schema';

export async function submit(
    _prevState: ActionResponse<FormSubmission>,
    formData: FormData,
): Promise<ActionResponse<FormSubmission>> {
    const fields = {
        // formData fields need to be coerced to desired types just in case
        name: String(formData.get('name')),
        age: Number(formData.get('age')),
        pokemon: Number(formData.get('pokemon')),
    };

    const validatedData = schema.safeParse(fields);

    if (!validatedData.success) {
        const errors = z.treeifyError(validatedData.error);

        if (!validatedData.success) {
            console.error('Validation errors:', errors);
            return {
                success: false,
                message: 'Please correct the errors.',
                fields: fields,
                errors: errors,
            };
        }
    }

    return {
        success: true,
        message: 'Success',
        fields: fields,
    };
}
