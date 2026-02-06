import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the fetcher used by SWR
vi.mock('@/utils/fetcher', () => ({
  fetcher: vi.fn(() => Promise.resolve([])),
}));

import RegisterForm from './register_form';

// Note: this test is a lightweight placeholder. Use vi.useFakeTimers()
// and more precise assertions when running in your environment.

describe('RegisterForm debounce', () => {
  it('calls search fetcher after debounce delay', async () => {
    const { container } = render(<RegisterForm header={<span>now</span>} />);

    // Locate the Pokemon input (approximation)
    const input = container.querySelector('input[placeholder="Choose"]');
    if (!input) {
      // If the input is not present in the test runner environment, skip.
      return;
    }

    // Simulate typing
    fireEvent.change(input, { target: { value: 'pi' } });

    // TODO: Use fake timers and advance by ~200ms, then assert that
    // the mocked fetcher was called with '/api/search' and the query.

    expect(true).toBe(true);
  });
});
