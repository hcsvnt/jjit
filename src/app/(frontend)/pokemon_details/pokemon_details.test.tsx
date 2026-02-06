import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SWRConfig } from 'swr';

const { mockFetcher } = vi.hoisted(() => ({
    mockFetcher: vi.fn(),
}));

vi.mock('@/utils/fetcher', () => ({
    fetcher: mockFetcher,
}));

import PokemonDetails from './pokemon_details';

const renderWithSWR = (ui: React.ReactElement) =>
    render(<SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{ui}</SWRConfig>);

describe('PokemonDetails', () => {
    beforeEach(() => {
        mockFetcher.mockClear();
    });

    it('renders placeholder when no pokemonId provided', () => {
        renderWithSWR(<PokemonDetails pokemonId={0} />);
        expect(screen.getByText(/Your pokemon/i)).toBeTruthy();
        expect(mockFetcher).not.toHaveBeenCalled();
    });

    it('renders loading state', () => {
        // Mock SWR loading state
        mockFetcher.mockImplementation(() => new Promise(() => {}));
        renderWithSWR(<PokemonDetails pokemonId={1} />);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders error state', async () => {
        mockFetcher.mockRejectedValue(new Error('Failed to fetch'));
        renderWithSWR(<PokemonDetails pokemonId={25} />);

        const errorAlert = await screen.findByRole('alert');
        expect(errorAlert).toHaveTextContent('Failed to load Pokémon details.');
    });
});
