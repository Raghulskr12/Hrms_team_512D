'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Sun, Moon, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-200">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar for Back Navigation & Theme Switching */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Link 
          href="/" 
          className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors border border-slate-200/60 dark:border-slate-800"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-8 shadow-xl relative z-10 space-y-6 transition-colors duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 font-bold text-xl text-white shadow-md shadow-purple-500/20 mb-1">
            D
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Sign in to Dayflow</h2>
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Every workday, perfectly aligned.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-450 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Work Email Address"
            type="email"
            placeholder="e.g. employee@dayflow.local"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button variant="primary" type="submit" isLoading={loading} className="w-full py-2.5">
            Sign In
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-150 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-405 space-y-4">
          <p>
            Don't have an account?{' '}
            <Link href="/register" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
              Quick Sign Up
            </Link>
          </p>

          <div className="p-4 bg-slate-50/80 dark:bg-slate-950/60 rounded-xl border border-slate-150 dark:border-slate-850/60 text-[10px] text-slate-500 dark:text-slate-400 space-y-1.5 text-left">
            <p className="font-bold text-slate-700 dark:text-slate-300">🔑 Development Credentials:</p>
            <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
              <div>Admin: admin@dayflow.local</div>
              <div>HR: hr@dayflow.local</div>
              <div className="col-span-2">Employee: emp1@dayflow.local (Password123!)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
