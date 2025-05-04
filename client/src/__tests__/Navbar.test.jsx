import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

// Helper to render with AuthContext
function renderWithAuth(ui, { user = null } = {}) {
  // Preload localStorage if needed
  if (user) localStorage.setItem('user', JSON.stringify(user));
  else localStorage.removeItem('user');

  return render(
    <AuthProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthProvider>
  );
}

describe('Navbar', () => {
  afterEach(() => localStorage.clear());

  it('shows Login link when not authenticated', () => {
    renderWithAuth(<Navbar />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Favorites')).toBeNull();
  });

  it('shows Favorites and Logout when authenticated', () => {
    const fakeUser = { username: 'alice' };
    renderWithAuth(<Navbar />, { user: fakeUser });
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Hello, alice')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
