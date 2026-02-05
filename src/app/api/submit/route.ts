import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { schema } from '@/app/(frontend)/register_form/schema';

/**
 * Handles POST requests to submit the trainer registration form.
 * Expects a JSON body with 'name', 'age', and 'pokemon' fields.
 * @param request - The incoming NextRequest object.
 * @returns A NextResponse with success or error message.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the submission data
        const validData = schema.parse(body);

        // If validation passes, return success
        return NextResponse.json(
            {
                success: true,
                message: 'Registration successful!',
                data: validData,
            },
            { status: 200 }
        );
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validation failed',
                    errors: err.issues,
                },
                { status: 400 }
            );
        }

        console.error('Unexpected error in /api/submit:', err);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
