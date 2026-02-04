import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Test from '@/app/(frontend)/test/test';

describe('Test the Test Test', () => {
    it('renders title, button and children', () => {
        const handleClick = vi.fn();

        render(
            <Test title="Hello, Vitest!" onClick={handleClick}>
                <span>Child content</span>
            </Test>,
        );

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, Vitest!');
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();

        button.click();
        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Child content')).toBeInTheDocument();
    });
});
