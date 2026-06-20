import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mindsprint_token') || null);
  const [loading, setLoading] = useState(true);

  // Set Authorization Header and Token
  const loginUser = (userData, userToken) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem('mindsprint_token', userToken);
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mindsprint_token');
  };

  const updateProfileState = (updatedUser) => {
    setUser(updatedUser);
  };

  // Fetch current user details on start
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          logoutUser();
        }
      } catch (err) {
        console.error('Failed to load user profile on startup:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
