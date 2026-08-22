'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  ArrowRight,
  Clock,
  Calendar,
  CreditCard,
  Users,
  ChevronRight,
  Activity,
  Zap,
  Shield,
  CheckCircle2,
  BarChart3,
  Bell,
  Globe,
  TrendingUp,
} from 'lucide-react';

const HeroGradient = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Main gradient orbs */}
    <div
      className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full animate-mesh"
      style={{
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }}
    />
    <div
      className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'meshMove 15s ease-in-out infinite reverse',
      }}
    />
    <div
      className="absolute bottom-[20%] left-[30%] w-[300px] h-[300px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        filter: 'blur(50px)',
        animation: 'meshMove 18s ease-in-out infinite',
        animationDelay: '-5s',
      }}
    />

    {/* Grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(99,102,241,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  </div>
);

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Initializing NexusHR..." size="lg" />;
  }

  const features = [
    {
      icon: Clock,
      title: 'Smart Attendance',
      desc: 'Real-time punch-in/out with geolocation insights, overtime tracking, and multi-view reporting.',
      color: '#6366F1',
      bg: 'rgba(99,102,241,0.08)',
    },
    {
      icon: Calendar,
      title: 'Leave Management',
      desc: 'Automated leave workflows with custom balances, approval routing, and calendar integration.',
      color: '#0EA5E9',
      bg: 'rgba(14,165,233,0.08)',
    },
    {
      icon: CreditCard,
      title: 'Payroll & Salary',
      desc: 'Detailed payslip breakdowns, allowances, deductions tracking with full salary history.',
      color: '#10B981',
      bg: 'rgba(16,185,129,0.08)',
    },
    {
      icon: Users,
      title: 'Employee Directory',
      desc: 'Comprehensive profiles with documents, bank details, and organizational structure view.',
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.08)',
    },
    {
      icon: BarChart3,
      title: 'HR Analytics',
      desc: 'Real-time dashboards with attendance metrics, leave reports, and payroll financials.',
      color: '#8B5CF6',
      bg: 'rgba(139,92,246,0.08)',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      desc: 'Instant alerts for leave approvals, attendance flags, and payroll processing events.',
      color: '#F43F5E',
      bg: 'rgba(244,63,94,0.08)',
    },
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '<50ms', label: 'API Latency' },
    { value: '256-bit', label: 'Encryption' },
    { value: 'RBAC', label: 'Access Control' },
  ];

  const dashboardFeatureRows = [
    { icon: TrendingUp, text: 'Live workforce analytics & KPIs', color: '#6366F1' },
    { icon: Shield, text: 'Role-based access control (Admin / HR / Employee)', color: '#10B981' },
    { icon: Globe, text: 'Multi-timezone attendance tracking', color: '#0EA5E9' },
    { icon: CheckCircle2, text: 'Atomic transaction leave approval engine', color: '#F59E0B' },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: '#0A0E1A', color: '#E8EDFF' }}
    >
      <HeroGradient />

      {/* ================================================================
          NAVBAR
          ================================================================ */}
      <nav
        className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-4 sticky top-0"
        style={{
          background: 'rgba(10, 14, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(30, 45, 74, 0.5)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L24 8.5V19.5L14 25L4 19.5V8.5L14 3Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
              <circle cx="14" cy="14" r="3" fill="white" opacity="0.9" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#E8EDFF] leading-none">NexusHR</p>
            <p className="text-[9px] text-[#6366F1] font-semibold tracking-widest uppercase">Workforce Platform</p>
          </div>
        </div>

        {/* Nav actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href={user.role === 'ADMIN' || user.role === 'HR' ? '/admin/dashboard' : '/dashboard'}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
              }}
            >
              <span>Go to Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-[#E8EDFF] transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                }}
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 animate-fade-in-up"
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#818CF8',
          }}
        >
          <Activity className="w-3 h-3 animate-pulse" />
          <span>Intelligent HR Platform for Modern Teams</span>
          <span className="w-1 h-1 rounded-full bg-indigo-400" />
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.08] mb-6 animate-fade-in-up delay-100"
          style={{ opacity: 0 }}
        >
          Your workforce,{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 40%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            connected.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200"
          style={{ opacity: 0, color: '#64748B' }}
        >
          NexusHR brings attendance, leave management, payroll, and team analytics together in one beautifully powerful platform. Built for teams that demand excellence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300" style={{ opacity: 0 }}>
          {user ? (
            <Link
              href={user.role === 'ADMIN' || user.role === 'HR' ? '/admin/dashboard' : '/dashboard'}
              className="flex items-center gap-2 px-7 py-3.5 text-sm font-bold rounded-2xl text-white transition-all hover:-translate-y-1 group"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
              }}
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="flex items-center gap-2 px-7 py-3.5 text-sm font-bold rounded-2xl text-white transition-all hover:-translate-y-1 group"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                  boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
                }}
              >
                <span>Start for Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-2xl transition-all hover:-translate-y-0.5"
                style={{
                  background: 'rgba(15, 22, 41, 0.8)',
                  border: '1px solid rgba(30, 45, 74, 0.9)',
                  color: '#94A3B8',
                }}
              >
                Sign In to Account
              </Link>
            </>
          )}
        </div>

        {/* Platform badges */}
        <div className="mt-10 flex items-center justify-center gap-6 flex-wrap animate-fade-in-up delay-400" style={{ opacity: 0 }}>
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center px-4 py-2 rounded-xl"
              style={{
                background: 'rgba(15, 22, 41, 0.6)',
                border: '1px solid rgba(30, 45, 74, 0.6)',
              }}
            >
              <span
                className="text-lg font-black font-mono"
                style={{
                  background: 'linear-gradient(135deg, #818CF8, #38BDF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </span>
              <span className="text-[10px] text-[#64748B] font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          FEATURE CARDS
          ================================================================ */}
      <section
        className="relative z-10 max-w-6xl mx-auto px-6 py-16"
        style={{ borderTop: '1px solid rgba(30, 45, 74, 0.4)' }}
      >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold tracking-widest text-[#6366F1] uppercase mb-3">Platform Capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need,{' '}
            <span style={{ color: '#64748B' }}>nothing you don't.</span>
          </h2>
          <p className="text-sm text-[#64748B] mt-4 leading-relaxed">
            Replace spreadsheets and fragmented tools with one unified, intelligent HR platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="p-5 rounded-2xl transition-all duration-300 group hover:-translate-y-1 cursor-default"
                style={{
                  background: 'rgba(15, 22, 41, 0.6)',
                  border: '1px solid rgba(30, 45, 74, 0.7)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${feat.color}40`;
                  e.currentTarget.style.boxShadow = `0 8px 30px ${feat.color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(30, 45, 74, 0.7)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: feat.bg, border: `1px solid ${feat.color}25` }}
                >
                  <Icon className="w-5 h-5" style={{ color: feat.color }} />
                </div>
                <h3 className="text-sm font-bold text-[#E8EDFF] mb-2">{feat.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================
          PLATFORM HIGHLIGHTS
          ================================================================ */}
      <section
        className="relative z-10 max-w-6xl mx-auto px-6 py-16"
        style={{ borderTop: '1px solid rgba(30, 45, 74, 0.4)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold tracking-widest text-[#6366F1] uppercase mb-3">Why NexusHR</p>
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              Built for security,{' '}
              <span style={{ color: '#818CF8' }}>designed for speed.</span>
            </h2>
            <div className="space-y-3">
              {dashboardFeatureRows.map((row, i) => {
                const Icon = row.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3.5 rounded-xl transition-all"
                    style={{ background: 'rgba(15, 22, 41, 0.6)', border: '1px solid rgba(30, 45, 74, 0.5)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${row.color}18`, border: `1px solid ${row.color}30` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: row.color }} />
                    </div>
                    <span className="text-sm text-[#CBD5E1]">{row.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dashboard preview card */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: 'rgba(15, 22, 41, 0.8)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              boxShadow: '0 0 60px rgba(99,102,241,0.08)',
            }}
          >
            {/* Mock dashboard */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-[#64748B] ml-2 font-mono">NexusHR Dashboard</span>
            </div>

            {/* Mock metrics */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Present', val: '87', color: '#10B981' },
                { label: 'On Leave', val: '12', color: '#0EA5E9' },
                { label: 'Pending', val: '5', color: '#F59E0B' },
              ].map((m, i) => (
                <div key={i} className="rounded-lg p-3 text-center" style={{ background: 'rgba(30,45,74,0.5)' }}>
                  <p className="text-lg font-black font-mono" style={{ color: m.color }}>{m.val}</p>
                  <p className="text-[10px] text-[#64748B]">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Mock bars */}
            <div className="space-y-2">
              <p className="text-[10px] text-[#64748B] font-medium">Attendance — Last 7 days</p>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => {
                const widths = [85, 92, 78, 95, 88];
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] text-[#374151] w-6 text-right font-mono">{day}</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(30,45,74,0.6)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${widths[i]}%`,
                          background: 'linear-gradient(90deg, #6366F1, #818CF8)',
                          boxShadow: '0 0 6px rgba(99,102,241,0.4)',
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-[#64748B] w-8 font-mono">{widths[i]}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer
        className="relative z-10 py-10 text-center"
        style={{ borderTop: '1px solid rgba(30, 45, 74, 0.4)' }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L24 8.5V19.5L14 25L4 19.5V8.5L14 3Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" />
              <circle cx="14" cy="14" r="3" fill="white" />
            </svg>
          </div>
          <span className="text-sm font-bold text-[#E8EDFF]">NexusHR</span>
        </div>
        <p className="text-xs text-[#374151]">
          © {new Date().getFullYear()} NexusHR — Workforce Intelligence Platform. Built with precision.
        </p>
      </footer>
    </div>
  );
}
