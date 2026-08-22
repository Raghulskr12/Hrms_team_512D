'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { Input } from '../../../components/ui/Input';
import { PasswordStrength, isPasswordStrong } from '../../../components/ui/PasswordStrength';
import { ArrowLeft, CheckCircle2, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();

  const [employeeId, setEmployeeId]         = useState('');
  const [fullName, setFullName]             = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw]                 = useState(false);
  const [showConfirmPw, setShowConfirmPw]   = useState(false);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');
  const [successMsg, setSuccessMsg]         = useState('');

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    if (!isPasswordStrong(password)) { setError('Password does not meet all requirements.'); return; }
    try {
      setLoading(true); setError(''); setSuccessMsg('');
      await register({ employeeId, fullName, email, password, confirmPassword });
      setSuccessMsg('Account created! Verify your email to login.');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      style={{ background: 'var(--bg-base)' }}>
      {/* Background orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', filter: 'blur(60px)' }}/>

      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="w-3.5 h-3.5"/> Back to Home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)', boxShadow: '0 0 20px var(--accent-glow)' }}>
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L24 8.5V19.5L14 25L4 19.5V8.5L14 3Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
              <circle cx="14" cy="14" r="3" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>NexusHR</p>
            <p className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Workforce Platform</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <UserPlus className="w-4 h-4" style={{ color: 'var(--accent)' }}/>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Account</h1>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Join NexusHR as an Employee</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: 'var(--danger)' }}>
              ⚠ {error}
            </div>
          )}

          {/* Success */}
          {successMsg ? (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success)' }}/>
                <p className="text-xs font-semibold" style={{ color: 'var(--success)' }}>Account Created!</p>
              </div>
              <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>{successMsg}</p>
              <Link href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)' }}>
                Proceed to Sign In →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Employee ID" placeholder="e.g. EMP-010"
                value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required/>

              <Input label="Full Name" placeholder="John Doe"
                value={fullName} onChange={(e) => setFullName(e.target.value)} required/>

              <Input label="Work Email" type="email" placeholder="you@company.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required/>

              {/* Password with eye toggle */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 pr-11 text-sm rounded-xl transition-all focus:outline-none"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow-sm)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--text-muted)' }}>
                    {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
                {/* Password strength */}
                {password && (
                  <div className="mt-3 p-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    <PasswordStrength password={password}/>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 pr-11 text-sm rounded-xl transition-all focus:outline-none"
                    style={{
                      ...inputStyle,
                      borderColor: passwordMismatch ? 'var(--danger)' : 'var(--border)',
                    }}
                    onFocus={(e) => { if (!passwordMismatch) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow-sm)'; }}}
                    onBlur={(e) => { if (!passwordMismatch) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}}
                  />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--text-muted)' }}>
                    {showConfirmPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
                {passwordMismatch && (
                  <p className="text-[11px] mt-1 font-medium" style={{ color: 'var(--danger)' }}>
                    ⚠ Passwords do not match
                  </p>
                )}
              </div>

              {/* Role badge */}
              <div className="p-3 rounded-xl text-[11px]"
                style={{ background: 'var(--accent-glow-sm)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>System Role: </span>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>EMPLOYEE</span>
                <span style={{ color: 'var(--text-muted)' }}> (Standard access)</span>
              </div>

              <button type="submit" disabled={loading || passwordMismatch}
                className="w-full py-3 text-sm font-bold rounded-xl text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)', boxShadow: loading ? 'none' : '0 4px 20px var(--accent-glow)' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Creating Account...
                  </span>
                ) : 'Create NexusHR Account'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold transition-colors" style={{ color: 'var(--accent)' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
