import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@/utils/fetcher', () => ({
  fetcher: vi.fn(() => Promise.resolve(null)),
}));

import PokemonDetails from './pokemon_details';

describe('PokemonDetails', () => {
  it('renders placeholder when no data', () => {
    const { getByText } = render(<PokemonDetails pokemonId={0} />);
    expect(getByText(/Your pokemon/i)).toBeTruthy();
  });

  // Additional tests for loading/error/data states should be added using SWR or fetcher mocks.
});
