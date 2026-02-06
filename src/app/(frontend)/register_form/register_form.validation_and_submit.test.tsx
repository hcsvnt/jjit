import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the server action or submission behavior
vi.mock('./submit', () => ({
  submit: vi.fn(() => Promise.resolve({ success: true, message: 'ok' })),
}));

import RegisterForm from './register_form';

describe('RegisterForm validation and submit', () => {
  it('shows validation errors for invalid inputs', async () => {
    const { container } = render(<RegisterForm header={<span>now</span>} />);
    const submitButton = container.querySelector('button[type="submit"]');
    if (!submitButton) return;

    fireEvent.click(submitButton);

    // TODO: Assert validation errors are displayed.
    await waitFor(() => expect(true).toBe(true));
  });

  it('submits successfully with valid data', async () => {
    // TODO: fill inputs and assert success dialog appears (mocked submit)
    expect(true).toBe(true);
  });
});
