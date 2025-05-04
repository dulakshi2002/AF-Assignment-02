// src/__tests__/CountryCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CountryCard from '../components/CountryCard';
import * as FavCtx from '../contexts/FavoritesContext';  // to spy on toggleFavorite
import { BrowserRouter } from 'react-router-dom';

describe('CountryCard', () => {
  const country = {
    flags: { svg: 'flag.svg' },
    name: { common: 'Testland' },
    population: 12345,
    region: 'Test Region',
    capital: ['Foo City'],
    cca3: 'TST'
  };

  it('renders country info and calls toggleFavorite when heart clicked', () => {
    // mock favorites context
    jest.spyOn(FavCtx, 'useFavorites').mockReturnValue({
      favorites: [],
      toggleFavorite: jest.fn()
    });

    render(
      <BrowserRouter>
        <CountryCard country={country} />
      </BrowserRouter>
    );

    // check that name, population, region, capital appear
    expect(screen.getByText('Testland')).toBeInTheDocument();
    expect(screen.getByText(/12,345/)).toBeInTheDocument();
    expect(screen.getByText('Test Region')).toBeInTheDocument();
    expect(screen.getByText('Foo City')).toBeInTheDocument();

    // click favorite button
    const btn = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(btn);

    expect(FavCtx.useFavorites().toggleFavorite).toHaveBeenCalledWith('TST');
  });
});
