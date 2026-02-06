import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SWRConfig } from 'swr';

import RegisterForm from './register_form';

const mockFetcher = vi.fn();
const mockSubmit = vi.fn();

vi.mock('@/utils/fetcher', () => ({
    fetcher: (...args: unknown[]) => mockFetcher(...args),
}));

vi.mock('./submit', () => ({
    submit: (...args: unknown[]) => mockSubmit(...args),
}));

vi.mock('../pokemon_details/pokemon_details', () => ({
    default: ({ pokemonId }: { pokemonId?: number }) => (
        <div>PokemonDetails {pokemonId ?? 'none'}</div>
    ),
}));

vi.mock('../success_dialog/success_dialog', () => ({
    default: ({ open }: { open: boolean }) => (open ? <div>SuccessDialog</div> : null),
}));

const renderForm = () =>
    render(
        <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
            <RegisterForm header={<span>Feb 6, 2026</span>} />
        </SWRConfig>,
    );

describe('RegisterForm', () => {
    beforeEach(() => {
        mockFetcher.mockResolvedValue([]);
        mockSubmit.mockResolvedValue({
            success: true,
            message: 'Success',
            fields: { name: '', age: 0, pokemon: 0 },
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('shows validation errors on submit', async () => {
        const user = userEvent.setup();
        renderForm();

        await user.click(screen.getByRole('button', { name: /submit/i }));

        expect(await screen.findByText('Required from 2 to 20 symbols')).toBeInTheDocument();
        expect(screen.getByText('Required range from 16-99')).toBeInTheDocument();
        expect(screen.getByText('Choose something')).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('debounces search requests before calling the fetcher', async () => {
        const user = userEvent.setup();
        renderForm();

        const autocompleteInput = screen.getByPlaceholderText('Choose');

        // Type multiple characters rapidly
        await user.type(autocompleteInput, 'pikachu');

        // Fetcher should not be called yet or called only once after debouncing
        expect(mockFetcher).not.toHaveBeenCalled();

        // Wait for debounce (200ms)
        await waitFor(
            () => {
                expect(mockFetcher).toHaveBeenCalledOnce();
            },
            { timeout: 500 },
        );

        // Verify fetcher was called with correct parameters
        expect(mockFetcher).toHaveBeenCalledWith('/api/search', { pokemon: 'pikachu' });
    });

    it('clears validation errors on reset', async () => {
        const user = userEvent.setup();
        renderForm();

        // Trigger validation errors
        await user.click(screen.getByRole('button', { name: /submit/i }));

        expect(await screen.findByText('Required from 2 to 20 symbols')).toBeInTheDocument();
        expect(screen.getByText('Required range from 16-99')).toBeInTheDocument();
        expect(screen.getByText('Choose something')).toBeInTheDocument();

        // Click reset button
        await user.click(screen.getByRole('button', { name: /reset/i }));

        // Verify errors are cleared
        expect(screen.queryByText('Required from 2 to 20 symbols')).not.toBeInTheDocument();
        expect(screen.queryByText('Required range from 16-99')).not.toBeInTheDocument();
        expect(screen.queryByText('Choose something')).not.toBeInTheDocument();
    });
});
