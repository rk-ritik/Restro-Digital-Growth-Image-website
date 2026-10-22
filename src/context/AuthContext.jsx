import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'restro_digital_growth_auth_session';

// Fixed credentials configuration
export const VALID_CREDENTIALS = {
  // Primary credentials
  id: 'admin',
  password: 'admin@123',
  // Alternate credentials
  alternateId: 'restrodigitalgrowth',
  alternatePassword: 'restro@123',
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Boolean(parsed && parsed.isAuthenticated);
      }
    } catch (err) {
      console.warn('Error reading auth state from localStorage:', err);
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.user || null;
      }
    } catch (err) {
      console.warn('Error reading user profile from localStorage:', err);
    }
    return null;
  });

  const login = (loginId, password, rememberMe = true) => {
    const trimmedId = (loginId || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const isIdValid =
      trimmedId === VALID_CREDENTIALS.id.toLowerCase() ||
      trimmedId === VALID_CREDENTIALS.alternateId.toLowerCase();

    const isPassValid =
      cleanPass === VALID_CREDENTIALS.password ||
      cleanPass === VALID_CREDENTIALS.alternatePassword;

    if (isIdValid && isPassValid) {
      const sessionData = {
        isAuthenticated: true,
        user: {
          id: trimmedId,
          name: 'Ritik Kumar',
          email: VALID_CREDENTIALS.alternateId,
          role: 'Administrator',
          avatarUrl: 'https://i.pinimg.com/736x/e0/79/1e/e0791e441aed23844e6768a4a83518ea.jpg',
        },
        loginTime: new Date().toISOString(),
      };

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
      } catch (err) {
        console.warn('Could not persist auth to localStorage:', err);
      }

      setIsAuthenticated(true);
      setCurrentUser(sessionData.user);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid Login ID or Password. Please check your credentials and try again.',
    };
  };

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.warn('Error removing auth session from localStorage:', err);
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        defaultCredentials: {
          id: VALID_CREDENTIALS.id,
          password: VALID_CREDENTIALS.password,
          alternateId: VALID_CREDENTIALS.alternateId,
        },
      }}
    >

      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
