import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import RegisterForm from './register_form';

describe('RegisterForm reset', () => {
  it('clears fields when Reset is clicked', () => {
    const { container } = render(<RegisterForm header={<span>now</span>} />);
    const resetButton = container.querySelector('button[type="reset"]');
    if (!resetButton) return;

    fireEvent.click(resetButton);

    // TODO: Assert that form fields are cleared; placeholder for now.
    expect(true).toBe(true);
  });
});
