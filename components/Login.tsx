import React, { useState } from 'react';
import { Button } from './Button';
import { Lock, User as UserIcon, AlertCircle, UserPlus, LogIn } from 'lucide-react';
import { validateCredentials, signUp } from '../services/authService';

interface LoginProps {
  onLogin: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        const result = await signUp(username, password);
        if (result.success) {
          if (result.message) {
             setSuccessMsg(result.message);
             setIsSignUp(false); // Switch back to login
          } else {
             // Auto login successful
             onLogin(username);
          }
        } else {
          setError(result.message || "Failed to create account.");
        }
      } else {
        const isValid = await validateCredentials(username, password);
        if (isValid) {
          onLogin(username);
        } else {
          setError("Invalid credentials. Please check your username/email and password.");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
           <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
            Sttock
           </h1>
           <p className="text-slate-400">News Collection & Market Intelligence</p>
        </div>

        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMsg(null); }}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              {isSignUp ? 'Back to Login' : 'Create an account'}
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Username or Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  placeholder="admin or admin@sttock.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full py-3">
              {isSignUp ? (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Sign Up
                </span>
              ) : (
                 <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" /> Sign In
                </span>
              )}
            </Button>
          </form>

          {!isSignUp && (
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-500 text-center mb-1">Demo Credentials</p>
              <p className="text-xs text-slate-600 text-center">
                User: <strong>admin</strong> <br/>
                Pass: <strong>user123</strong>
              </p>
              <p className="text-[10px] text-slate-700 text-center mt-2 italic">
                (Click "Create an account" above to register these first)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};