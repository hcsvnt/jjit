import { describe, it, expect } from 'vitest';
import { schema } from '../submit/schema';

describe('search schema validation', () => {
    it('accepts a valid payload', () => {
        const valid = { pokemon: 'pikachu' };
        expect(schema.parse(valid)).toEqual(valid);
    });

    it('rejects empty pokemon', () => {
        expect(() =>
            schema.parse({ pokemon: '' })
        ).toThrow();
    });

    it('trims whitespace from pokemon', () => {
        const input = { pokemon: '  Eevee  ' };
        const output = { pokemon: 'Eevee' };
        expect(schema.parse(input)).toEqual(output);
    });


});
