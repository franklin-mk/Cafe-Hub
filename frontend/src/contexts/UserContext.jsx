// src/contexts/UserContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user'); // Remove invalid data
      }
    }
  }, []);

  const login = (userData) => {
    const userWithToken = {
      ...userData,
      token: userData.token // Make sure the token is included in userData
    };
    setUser(userWithToken);
    try {
      localStorage.setItem('user', JSON.stringify(userWithToken));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <UserContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}