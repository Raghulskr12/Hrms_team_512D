'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 font-bold text-xl text-white shadow-lg shadow-purple-900/50 mb-1">
            D
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Sign in to Dayflow</h2>
          <p className="text-xs text-purple-400 font-medium">Every workday, perfectly aligned.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl font-medium">
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

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 space-y-3">
          <p>
            Don't have an account?{' '}
            <Link href="/register" className="text-purple-400 font-semibold hover:underline">
              Quick Sign Up
            </Link>
          </p>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">🔑 Development Test Accounts:</p>
            <p>Admin: <span className="font-mono text-purple-300">admin@dayflow.local</span> / Password123!</p>
            <p>HR: <span className="font-mono text-purple-300">hr@dayflow.local</span> / Password123!</p>
            <p>Employee: <span className="font-mono text-purple-300">emp1@dayflow.local</span> / Password123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
