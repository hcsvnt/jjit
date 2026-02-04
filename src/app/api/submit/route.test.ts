import { describe, it, expect } from 'vitest';
import { POST } from './route';
import { schema } from './schema';
import { mocks } from './mocks';

describe('API /search route', () => {
    it('POST returns JSON message', async () => {
        const body = JSON.stringify({
            name: 'Test User',
            age: 25,
            pokemon: 'Pikachu',
        });
        const req = new Request('http://localhost/search', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body,
        });
        const res = await POST(req);
        const data = await (res as Response).json();
        expect(data).toBeDefined();
    });
});
