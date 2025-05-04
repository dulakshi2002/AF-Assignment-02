// src/__tests__/CountryList.test.jsx
import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved
} from '@testing-library/react';
import CountryList from '../pages/CountryList';
import * as api from '../api/countries';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider }      from '../contexts/AuthContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';

jest.mock('../api/countries');

describe('CountryList', () => {
  const sample = [
    {
      cca3: 'AAA',
      name: { common: 'Aland' },
      population: 100,
      region: 'Europe',
      languages: { eng: 'English' },
      flags: { svg: 'flag-aaa.svg' },
      capital: ['Foo City'],
    },
    {
      cca3: 'BBB',
      name: { common: 'Beta' },
      population: 200,
      region: 'Asia',
      languages: { deu: 'German' },
      flags: { svg: 'flag-bbb.svg' },
      capital: ['Bar Town'],
    },
  ];

  beforeEach(() => {
    api.fetchAllCountries.mockResolvedValue(sample);
    api.fetchCountryByName.mockResolvedValue(
      sample.filter(c => c.name.common.includes('A'))
    );
    api.fetchCountriesByRegion.mockResolvedValue(
      sample.filter(c => c.region === 'Europe')
    );
  });

  it('loads & displays all countries, then filters by region', async () => {
    render(
      <AuthProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <CountryList />
          </BrowserRouter>
        </FavoritesProvider>
      </AuthProvider>
    );

    // initial loading...
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // wait for the first render of both country cards
    await waitFor(() => expect(screen.getByText('Aland')).toBeInTheDocument());
    expect(screen.getByText('Beta')).toBeInTheDocument();

    // change region to "Europe"
    const regionSelect = screen.getByLabelText(/all regions/i);
    fireEvent.change(regionSelect, { target: { value: 'Europe' } });

    // **wait for the loading text to disappear** after filtering
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    // now only "Aland" should be present
    expect(screen.getByText('Aland')).toBeInTheDocument();
    expect(screen.queryByText('Beta')).toBeNull();
  });
});
