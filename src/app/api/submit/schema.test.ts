import { describe, it, expect } from 'vitest';
import { schema } from '../search/schema';

describe('search schema validation - failng', () => {
    it('accepts a valid payload', () => {
        const valid = { name: 'Ash Ketchum', age: 25, pokemon: 'Pikachu' };
        expect(schema.parse(valid)).toEqual(valid);
    });

    it('rejects a too-short name', () => {
        expect(() =>
            schema.parse({ name: 'A', age: 25, pokemon: 'Pikachu' })
        ).toThrow();
    });

    it('rejects too-long name', () => {
        expect(() =>
            schema.parse({ name: 'ThisNameIsWayTooLongToBeValid', age: 30, pokemon: 'Onix' })
        ).toThrow();
    });

    it('rejects underage values', () => {
        expect(() =>
            schema.parse({ name: 'Misty', age: 15, pokemon: 'Staryu' })
        ).toThrow();
    });

    it('rejects overage values', () => {
        expect(() =>
            schema.parse({ name: 'Brock', age: 100, pokemon: 'Onix' })
        ).toThrow();
    });

    it('rejects empty pokemon', () => {
        expect(() =>
            schema.parse({ name: 'Brock', age: 30, pokemon: '' })
        ).toThrow();
    });

    it('trims whitespace from name and pokemon', () => {
        const input = { name: '  Gary Oak  ', age: 20, pokemon: '  Eevee  ' };
        const output = { name: 'Gary Oak', age: 20, pokemon: 'Eevee' };
        expect(schema.parse(input)).toEqual(output);
    });


});

describe('search schema validation - passing', () => {
    it('accepts boundary age values', () => {
        const minAge = { name: 'Young Trainer', age: 16, pokemon: 'Caterpie' };
        const maxAge = { name: 'Old Trainer', age: 99, pokemon: 'Snorlax' };
        expect(schema.parse(minAge)).toEqual(minAge);
        expect(schema.parse(maxAge)).toEqual(maxAge);
    });

    it('accepts names at length boundaries', () => {
        const minName = { name: 'Al', age: 20, pokemon: 'Pidgey' };
        const maxName = { name: 'A'.repeat(20), age: 20, pokemon: 'Pidgeot' };
        expect(schema.parse(minName)).toEqual(minName);
        expect(schema.parse(maxName)).toEqual(maxName);
    });

    it('accepts names and pokemon with internal whitespace', () => {
        const input = { name: '  Ash Ketchum  ', age: 25, pokemon: '  Mr. Mime  ' };
        const output = { name: 'Ash Ketchum', age: 25, pokemon: 'Mr. Mime' };
        expect(schema.parse(input)).toEqual(output);
    });
});
