import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

describe('Login page › shows error when fields are empty', () => {
  it('shows error when fields are empty', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    await user.click(screen.getByRole('button', { name: /Log In/i }));

    expect(
      screen.getByText(/please enter both username and password\./i)
    ).toBeInTheDocument();
  });
});
