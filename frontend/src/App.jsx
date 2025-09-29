import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/check', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      {!user ? (
        <div className="auth-container">
          {showRegister ? (
            <Register 
              onRegister={() => setShowRegister(false)}
              onSwitchToLogin={() => setShowRegister(false)}
            />
          ) : (
            <Login 
              onLogin={handleLogin}
              onSwitchToRegister={() => setShowRegister(true)}
            />
          )}
        </div>
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
