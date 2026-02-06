'use server';

import { z } from 'zod';
import type { ActionResponse, FormSubmission } from './schema';
import { schema } from './schema';

/**
 * Handles the submission of the registration form.
 * Validates the input data and performs business logic.
 * @param _prevState - The previous state of the action (not used, but required by React).
 * @param formData - The submitted form data.
 * @returns An ActionResponse indicating success or failure.
 */
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

    /**
     * Business logic placeholder.
     * In a real application, this could involve saving data to a database,
     * sending confirmation emails, etc.
     */
    (function doBusinessLogic(data: FormSubmission) {
        console.log('Doing business with:', data);
    })(validatedData.data);

    return {
        success: true,
        message: 'Success',
        fields: fields,
    };
}
