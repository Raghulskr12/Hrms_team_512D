'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, CheckCircle2, UserPlus } from 'lucide-react';

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
      setError("Passwords don't match.");
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');
      await register({ employeeId, fullName, email, password, confirmPassword });
      setSuccessMsg('Account created! Verify your email to login.');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative" style={{ background: '#0A0E1A' }}>
      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      {/* Back link */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#E8EDFF] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
          >
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L24 8.5V19.5L14 25L4 19.5V8.5L14 3Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
              <circle cx="14" cy="14" r="3" fill="white" opacity="0.9" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#E8EDFF]">NexusHR</p>
            <p className="text-[9px] text-[#6366F1] font-semibold tracking-widest uppercase">Workforce Platform</p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: '#0F1629',
            border: '1px solid rgba(30, 45, 74, 0.9)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="w-4 h-4 text-indigo-400" />
              <h1 className="text-xl font-bold text-[#E8EDFF]">Create Account</h1>
            </div>
            <p className="text-xs text-[#64748B]">Join NexusHR as an Employee</p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-5 p-3.5 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#FB7185' }}
            >
              ⚠ {error}
            </div>
          )}

          {/* Success */}
          {successMsg && (
            <div
              className="mb-5 p-4 rounded-xl"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-semibold text-emerald-400">Account Created!</p>
              </div>
              <p className="text-[11px] text-[#64748B] mb-3">{successMsg}</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
              >
                Proceed to Sign In →
              </Link>
            </div>
          )}

          {!successMsg && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Employee ID"
                placeholder="e.g. EMP-010"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />

              <Input
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <Input
                label="Work Email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Role notice */}
              <div
                className="p-3 rounded-xl text-[11px]"
                style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}
              >
                <span className="text-[#64748B]">System Role: </span>
                <span className="font-bold text-[#818CF8]">EMPLOYEE</span>
                <span className="text-[#64748B]"> (Standard access)</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-bold rounded-xl text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create NexusHR Account'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-[#64748B]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#818CF8] font-semibold hover:text-[#A5B4FC] transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
