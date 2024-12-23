import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  hasAccess: () => false,
  canAccessSite: () => false,
  setUser: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (isValidUser(parsedUser)) {
            setUser(parsedUser);
          }
        }
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('user');
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  function isValidUser(data) {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.id === 'string' &&
      typeof data.username === 'string' &&
      typeof data.role === 'string'
    );
  }

  const hasAccess = (requiredRoles) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const canAccessSite = (siteId) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'strip_admin') return true;
    return user.assignedSites?.includes(siteId) || false;
  };

  const handleSetUser = (newUser) => {
    setLoading(true);
    try {
      setUser(newUser);
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('user');
      }
    } catch (err) {
      console.error('Error setting user:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    hasAccess,
    canAccessSite,
    setUser: handleSetUser
  };

  return (
    <AuthContext.Provider value={value}>
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