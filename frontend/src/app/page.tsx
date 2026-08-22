'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { 
  Sun, 
  Moon, 
  ArrowRight, 
  Clock, 
  Calendar, 
  CreditCard, 
  Users, 
  ChevronRight, 
  Activity, 
  Zap, 
  Shield, 
  CheckCircle2 
} from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <LoadingSpinner message="Initializing Dayflow HRMS..." size="lg" />
      </div>
    );
  }

  const features = [
    {
      icon: Clock,
      title: 'Smart Attendance Tracker',
      desc: 'Seamless clock-in and clock-out with geolocation insights, history logging, and real-time status reporting.',
    },
    {
      icon: Calendar,
      title: 'Leave & Time-off Planner',
      desc: 'Submit, track, and approve leave requests with customized balances, automated notifications, and multi-level flows.',
    },
    {
      icon: CreditCard,
      title: 'Automated Payroll & Salary',
      desc: 'Access beautiful monthly payslip breakdown, track allowance items, deductions, and tax computations instantly.',
    },
    {
      icon: Users,
      title: 'Unified Employee Directory',
      desc: 'Comprehensive employee database with quick profile search, roles designation, division structure, and team tracking.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40 dark:opacity-20 blur-[120px] bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-full" />
      
      {/* Header */}
      <nav className="relative z-10 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md shadow-purple-500/20">
            D
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-purple-700 to-indigo-800 dark:from-white dark:via-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">
            DAYFLOW
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all border border-slate-200/50 dark:border-slate-800"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <Link
              href={user.role === 'ADMIN' || user.role === 'HR' ? '/admin/dashboard' : '/dashboard'}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-600/35 transition-all flex items-center space-x-1.5"
            >
              <span>Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xs"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 text-purple-600 dark:text-purple-400 mb-6 text-xs font-medium animate-fade-in">
          <Activity className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
          <span>Intelligent HR Workspaces for Modern Teams</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
          Every workday,{' '}
          <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent dark:from-purple-400 dark:via-indigo-400 dark:to-pink-400">
            perfectly aligned.
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Dayflow streamlines attendance logging, smart schedules, real-time leaves management, and payroll compliance. All in one beautifully simple interface.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              href={user.role === 'ADMIN' || user.role === 'HR' ? '/admin/dashboard' : '/dashboard'}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/20 hover:shadow-purple-500/35 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Go to Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/20 hover:shadow-purple-500/35 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all flex items-center justify-center"
              >
                Sign In to Account
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-16 border-t border-slate-150 dark:border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Powerful capabilities, zero friction</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            Designed for teams that demand simplicity. Ditch spreadsheets for modern workflow automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index} 
                className="p-6 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 hover:border-purple-500/30 dark:hover:border-purple-500/20 transition-all duration-300 group hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 transition-all group-hover:scale-105">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social Proof / Security section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center border-t border-slate-150 dark:border-slate-900">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <Zap className="w-6 h-6 text-purple-500 mb-3" />
            <span className="text-sm font-semibold">Sub-millisecond API Latency</span>
            <span className="text-xs text-slate-400 mt-1">Blazing fast state updates</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-6 h-6 text-indigo-500 mb-3" />
            <span className="text-sm font-semibold">Enterprise-Grade Security</span>
            <span className="text-xs text-slate-400 mt-1">Role Based Access Control</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-3" />
            <span className="text-sm font-semibold">100% Data Integrity</span>
            <span className="text-xs text-slate-400 mt-1">PostgreSQL audit trail logs</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50 py-8 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Dayflow HRMS. Built with focus and visual excellence.</p>
      </footer>
    </div>
  );
}
