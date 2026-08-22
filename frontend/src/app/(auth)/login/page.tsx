'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Shield, Clock, Users, ChevronRight, Eye, EyeOff } from 'lucide-react';

const LoginFeatures = [
  { icon: Shield, text: 'Role-based access control', color: '#10B981' },
  { icon: Clock, text: 'Real-time attendance tracking', color: '#6366F1' },
  { icon: Users, text: 'Unified HR management', color: '#0EA5E9' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0E1A' }}>
      {/* ============================================================
          LEFT PANEL — Visual / Branding
          ============================================================ */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0D1526 0%, #0A1020 60%, #0F1629 100%)',
          borderRight: '1px solid rgba(30, 45, 74, 0.6)',
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99,102,241,1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <path d="M14 3L24 8.5V19.5L14 25L4 19.5V8.5L14 3Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
                <circle cx="14" cy="14" r="3" fill="white" opacity="0.9" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-[#E8EDFF]">NexusHR</p>
              <p className="text-[9px] text-[#6366F1] font-semibold tracking-widest uppercase">Workforce Platform</p>
            </div>
          </Link>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h2 className="text-4xl font-black tracking-tight text-[#E8EDFF] leading-tight mb-4">
            Manage your{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #818CF8, #38BDF8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              workforce
            </span>
            <br />with precision.
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed mb-8 max-w-xs">
            NexusHR gives HR teams and employees a unified platform to manage time, leave, payroll, and more.
          </p>

          <div className="space-y-3">
            {LoginFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-xl"
                  style={{
                    background: 'rgba(15, 22, 41, 0.5)',
                    border: '1px solid rgba(30, 45, 74, 0.6)',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${feat.color}18`, border: `1px solid ${feat.color}30` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: feat.color }} />
                  </div>
                  <span className="text-xs text-[#CBD5E1] font-medium">{feat.text}</span>
                  <ChevronRight className="w-3 h-3 text-[#374151] ml-auto" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-4">
          {[
            { val: '99.9%', label: 'Uptime' },
            { val: 'SOC 2', label: 'Certified' },
            { val: 'RBAC', label: 'Security' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p
                className="text-sm font-black font-mono"
                style={{
                  background: 'linear-gradient(135deg, #818CF8, #38BDF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.val}
              </p>
              <p className="text-[10px] text-[#64748B]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          RIGHT PANEL — Login Form
          ============================================================ */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        {/* Back link */}
        <div className="absolute top-6 left-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#E8EDFF] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
            >
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                <path d="M14 3L24 8.5V19.5L14 25L4 19.5V8.5L14 3Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" />
                <circle cx="14" cy="14" r="3" fill="white" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#E8EDFF]">NexusHR</p>
            </div>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#E8EDFF] mb-1">Welcome back</h1>
            <p className="text-sm text-[#64748B]">Sign in to your NexusHR workspace</p>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="mb-5 p-3.5 rounded-xl text-xs font-medium flex items-start gap-2"
              style={{
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                color: '#FB7185',
              }}
            >
              <span className="mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 text-sm text-[#E8EDFF] placeholder-[#374151] rounded-xl transition-all focus:outline-none"
                style={{
                  background: 'rgba(15, 22, 41, 0.8)',
                  border: '1px solid rgba(30, 45, 74, 0.9)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(30, 45, 74, 0.9)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 text-sm text-[#E8EDFF] placeholder-[#374151] rounded-xl transition-all focus:outline-none"
                  style={{
                    background: 'rgba(15, 22, 41, 0.8)',
                    border: '1px solid rgba(30, 45, 74, 0.9)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(30, 45, 74, 0.9)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#94A3B8] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-bold rounded-xl text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
                  Signing in...
                </span>
              ) : (
                'Sign In to NexusHR'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#64748B]">
              New to NexusHR?{' '}
              <Link href="/register" className="text-[#818CF8] font-semibold hover:text-[#A5B4FC] transition-colors">
                Create an account
              </Link>
            </p>
          </div>

          {/* Dev credentials */}
          <div
            className="mt-6 p-4 rounded-xl"
            style={{
              background: 'rgba(15, 22, 41, 0.5)',
              border: '1px solid rgba(30, 45, 74, 0.6)',
            }}
          >
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>🔑</span> Development Credentials
            </p>
            <div className="space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-[#374151]">Admin:</span>
                <span className="text-[#818CF8]">admin@dayflow.local</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#374151]">HR:</span>
                <span className="text-[#818CF8]">hr@dayflow.local</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#374151]">Employee:</span>
                <span className="text-[#818CF8]">emp1@dayflow.local</span>
              </div>
              <div
                className="mt-2 pt-2 text-center"
                style={{ borderTop: '1px solid rgba(30, 45, 74, 0.6)' }}
              >
                <span className="text-[#374151]">Password: </span>
                <span className="text-[#10B981]">Password123!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
