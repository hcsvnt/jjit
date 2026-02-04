import { describe, it, expect } from 'vitest';
import { schema } from './schema';

describe('search schema validation - failng', () => {
    it('accepts a valid payload', () => {
        const valid = { name: 'Ash Ketchum', age: 25, pokemon: 25 };
        const validatedData = schema.safeParse(valid);
        expect(validatedData.success).toBe(true);
    });

    it('rejects a too-short name', () => {
        const validatedData = schema.safeParse({ name: 'A', age: 25, pokemon: 25 });
        expect(validatedData.success).toBe(false);
    });

    it('rejects too-long name', () => {
        const validatedData = schema.safeParse({ name: 'ThisNameIsWayTooLongToBeValid', age: 30, pokemon: 25 });
        expect(validatedData.success).toBe(false);
    });

    it('rejects underage values', () => {
        const validatedData = schema.safeParse({ name: 'Misty', age: 15, pokemon: 25 });
        expect(validatedData.success).toBe(false);
    });

    it('rejects overage values', () => {
        const validatedData = schema.safeParse({ name: 'Brock', age: 100, pokemon: 25 });
        expect(validatedData.success).toBe(false);
    });

    it('rejects empty pokemon', () => {
        const validatedData = schema.safeParse({ name: 'Brock', age: 30, pokemon: undefined });
        expect(validatedData.success).toBe(false);
    });



});

describe('search schema validation - passing', () => {

    // it('trims whitespace from name', () => {
    //     const input = { name: '  Gary Oak  ', age: 20, pokemon: 25 };
    //     const output = { name: 'Gary Oak', age: 20, pokemon: 25 };
    //     expect(schema.safeParse(input)).toEqual(output);
    // });

    // it('accepts boundary age values', () => {
    //     const minAge = { name: 'Young Trainer', age: 16, pokemon: 25 };
    //     const maxAge = { name: 'Old Trainer', age: 99, pokemon: 25 };
    //     expect(schema.safeParse(minAge)).toEqual(minAge);
    //     expect(schema.safeParse(maxAge)).toEqual(maxAge);
    // });

    it('accepts names at length boundaries', () => {
        const minName = { name: 'Al', age: 20, pokemon: 25 };
        const maxName = { name: 'A'.repeat(20), age: 20, pokemon: 25 };
        expect(schema.parse(minName)).toEqual(minName);
        expect(schema.parse(maxName)).toEqual(maxName);
    });

    it('accepts names with internal whitespace', () => {
        const input = { name: '  Ash Ketchum  ', age: 25, pokemon: 25 };
        const output = { name: 'Ash Ketchum', age: 25, pokemon: 25 };
        expect(schema.parse(input)).toEqual(output);
    });
});
