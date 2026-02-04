import { describe, it, expect } from 'vitest';
import { POST } from './route';
import { schema } from './schema';
import { pikachu } from './mocks';
import { headers } from 'next/dist/server/request/headers';



describe('API /search route', () => {
    // it('should return 400 for invalid input', async () => {
    //     const response = await POST(new Request('http://localhost/api/search', { method: 'POST', body: JSON.stringify({}) }));
    //     expect(response.status).toBe(400);
    //     const data = await response.json();
    //     expect(data).toHaveProperty('errors');
    // })

    // it('should return 404 for non-existing pokemon', async () => {
    //     const response = await fetch(`http://localhost/api/search`, { method: 'POST', body: JSON.stringify({ pokemon: 'donald tusk' }) });

    //     expect(response.status).toBe(404);
    //     const data = await response.json();
    //     expect(data).toHaveProperty('error', 'Pokemon not found');
    // })

    // it('should return 200 and pokemon data for valid input', async () => {
    //     const response = await fetch(`http://localhost/api/search`, { method: 'POST', body: JSON.stringify({ pokemon: 'pikachu' }) });

    //     expect(response.status).toBe(200);
    //     const data = await response.json();
    //     expect(data).toHaveProperty('pokemon');
    //     expect(data.pokemon).toEqual(pikachu);
    // });

});
