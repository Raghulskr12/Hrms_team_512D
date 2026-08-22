'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function RegisterPage() {
  const { register } = useAuth();

  const [employeeId, setEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');
      const res = await register({
        employeeId,
        fullName,
        email,
        password,
        confirmPassword,
      });

      setSuccessMsg('Account created successfully! Check email verification link or verify email to login.');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Quick Sign Up</h2>
          <p className="text-xs text-purple-400 font-medium">Create your Dayflow Employee Account</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl font-medium space-y-2">
            <p>{successMsg}</p>
            <Link href="/login" className="inline-block font-semibold underline text-emerald-200">
              Proceed to Sign In →
            </Link>
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Employee ID (e.g. EMP-010)"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />

            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Work Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              System Role: <span className="font-semibold text-purple-400">EMPLOYEE</span> (Standard)
            </div>

            <Button variant="primary" type="submit" isLoading={loading} className="w-full py-2.5">
              Complete Registration
            </Button>
          </form>
        )}

        <div className="pt-2 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/login" className="text-purple-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
