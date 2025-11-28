import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { getCurrentSession, signOut } from './services/authService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await getCurrentSession();
      if (session) {
        // Use email or metadata as username
        setUsername(session.user.email?.split('@')[0] || 'User');
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to restore session", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
    setUsername('');
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard username={username} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;