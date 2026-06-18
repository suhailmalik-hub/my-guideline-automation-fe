import { useState } from 'react';
import { toast } from 'react-toastify';
import { LoginUser } from '../api';
import type { ILoginUserRequest } from '../types';

// Session Storage
const TOKEN_KEY = 'neuron_token';
const USER_KEY = 'neuron_user';

export interface StoredUser {
  email: string;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

function getStoredUser(): StoredUser | null {
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as StoredUser;
  } catch {
    return null;
  }
}

function setAuthSession(user: StoredUser, token: string) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export const useAuth = () => {
  const [user, setUser] = useState<StoredUser | null>(getStoredUser);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isAuthenticated);

  const login = (loginPayload: ILoginUserRequest, onComplete: (status: string) => void) => {
    setIsLoggingIn(true);
    LoginUser(loginPayload)
      .then((response) => {
        if (response.success && response.data) {
          const storedUser: StoredUser = { email: response.data.email };
          setAuthSession(storedUser, response.data.token);
          setUser(storedUser);
          setIsLoggedIn(true);
          toast.success(response.message || 'Logged in successfully!');
          onComplete('success');
        } else {
          toast.error(response.message || 'Login failed');
          onComplete('failure');
        }
      })
      .catch(() => {
        onComplete('failure');
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
    setIsLoggedIn(false);
  };

  return {
    user,
    isAuthenticated: isLoggedIn,
    isLoggingIn,
    login,
    logout,
  };
};
