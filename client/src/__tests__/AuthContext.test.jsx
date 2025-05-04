import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => localStorage.clear());

  it('signup() registers and logs in a new user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.signup('alice', 'pwd123');
    });

    expect(localStorage.getItem('users')).toContain('alice');
    expect(result.current.user).toEqual({ username: 'alice' });
  });

  it('login() only succeeds with correct credentials', () => {
    // pre-seed a user
    localStorage.setItem('users', JSON.stringify([{ username: 'bob', password: 'secret' }]));
    const { result } = renderHook(() => useAuth(), { wrapper });

    // wrong pw
    act(() => {
      expect(() => result.current.login('bob', 'nope')).toThrow(/Invalid username or password/);
    });

    // correct
    act(() => {
      result.current.login('bob', 'secret');
    });
    expect(result.current.user).toEqual({ username: 'bob' });
  });
});
