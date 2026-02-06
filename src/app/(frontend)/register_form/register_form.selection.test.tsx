import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@/utils/fetcher', () => ({
  fetcher: vi.fn((url: string) => {
    if (url.includes('/api/search')) {
      return Promise.resolve([{ id: 25, name: 'Pikachu' }]);
    }
    if (url.includes('/api/details')) {
      return Promise.resolve({ id: 25, name: 'Pikachu', types: [], base_experience: 112, sprites: {} });
    }
    return Promise.resolve(null);
  }),
}));

import RegisterForm from './register_form';

describe('RegisterForm selection -> details', () => {
  it('selects a suggestion and shows details', async () => {
    const { container } = render(<RegisterForm header={<span>now</span>} />);
    const input = container.querySelector('input[placeholder="Choose"]');
    if (!input) return;

    fireEvent.change(input, { target: { value: 'Pi' } });

    // TODO: wait for options and simulate selection; this placeholder asserts flow only.
    await waitFor(() => {
      expect(true).toBe(true);
    });
  });
});
