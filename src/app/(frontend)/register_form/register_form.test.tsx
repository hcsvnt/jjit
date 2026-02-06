import { render, screen, waitFor, act } from '@testing-library/react';
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
		vi.useFakeTimers();
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		renderForm();

		const input = screen.getByPlaceholderText('Choose');
		await user.type(input, 'pik');

		expect(mockFetcher).not.toHaveBeenCalled();

		await act(async () => {
			vi.advanceTimersByTime(199);
		});

		expect(mockFetcher).not.toHaveBeenCalled();

		await act(async () => {
			vi.advanceTimersByTime(1);
		});

		await waitFor(() =>
			expect(mockFetcher).toHaveBeenCalledWith('/api/search', { pokemon: 'pik' }),
		);

		vi.useRealTimers();
	});

	it('clears validation errors on reset', async () => {
		const user = userEvent.setup();
		renderForm();

		await user.click(screen.getByRole('button', { name: /submit/i }));
		expect(await screen.findByText('Required from 2 to 20 symbols')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /reset/i }));

		expect(screen.queryByText('Required from 2 to 20 symbols')).not.toBeInTheDocument();
		expect(screen.queryByText('Required range from 16-99')).not.toBeInTheDocument();
		expect(screen.queryByText('Choose something')).not.toBeInTheDocument();
	});
});
