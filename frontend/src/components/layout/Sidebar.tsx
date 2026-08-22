'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Clock,
  DollarSign,
  PieChart,
  User,
  Wallet,
  X,
  ChevronRight,
  Hexagon,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview' },
    { href: '/admin/employees', label: 'Employees', icon: Users, desc: 'Directory' },
    { href: '/admin/attendance', label: 'Attendance', icon: Clock, desc: 'Tracking' },
    { href: '/admin/leave', label: 'Time Off', icon: CalendarDays, desc: 'Approvals' },
    { href: '/admin/payroll', label: 'Payroll', icon: DollarSign, desc: 'Compensation' },
    { href: '/admin/reports', label: 'Analytics', icon: PieChart, desc: 'Reports' },
  ];

  const userLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview' },
    { href: '/profile', label: 'Profile', icon: User, desc: 'My Account' },
    { href: '/attendance', label: 'Attendance', icon: Clock, desc: 'My Records' },
    { href: '/leave', label: 'Time Off', icon: CalendarDays, desc: 'My Leaves' },
    { href: '/salary', label: 'Salary', icon: Wallet, desc: 'Pay Info' },
  ];

  const links = isAdminOrHR ? adminLinks : userLinks;

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const fullName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email?.split('@')[0] || 'User';

  const initials = user?.profile
    ? `${user.profile.firstName?.[0] || ''}${user.profile.lastName?.[0] || ''}`
    : (user?.email?.[0] || 'U').toUpperCase();

  const roleLabel = user?.role === 'ADMIN' ? 'Administrator' : user?.role === 'HR' ? 'HR Manager' : 'Employee';

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#0A0E1A]/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0D1526 0%, #0A1020 100%)',
          borderRight: '1px solid rgba(30, 45, 74, 0.8)',
        }}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(30, 45, 74, 0.6)' }}>
          <Link
            href={isAdminOrHR ? '/admin/dashboard' : '/dashboard'}
            className="flex items-center gap-2.5 group"
          >
            {/* Logo mark */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                <path d="M14 3L24 8.5V19.5L14 25L4 19.5V8.5L14 3Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
                <circle cx="14" cy="14" r="3" fill="white" opacity="0.9" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-[#E8EDFF]">NexusHR</span>
              <span className="text-[9px] text-[#6366F1] font-semibold tracking-widest uppercase">Workforce Platform</span>
            </div>
          </Link>

          <button
            className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#E8EDFF] hover:bg-[#1E2D4A] transition-all"
            onClick={onCloseMobile}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5">
          {/* Section label */}
          <div className="px-3 mb-3">
            <p className="text-[9px] font-bold tracking-widest text-[#374151] uppercase">
              {isAdminOrHR ? 'Administration' : 'My Workspace'}
            </p>
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onCloseMobile()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? 'bg-indigo-600/15 border border-indigo-500/20 text-[#E8EDFF]'
                    : 'text-[#64748B] hover:text-[#CBD5E1] hover:bg-[#1A2540]/60'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-500 rounded-r-full" style={{ boxShadow: '0 0 8px rgba(99,102,241,0.8)' }} />
                )}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    active
                      ? 'bg-indigo-600/25 text-indigo-400'
                      : 'bg-[#131D36] text-[#4B5563] group-hover:text-[#818CF8] group-hover:bg-[#1E2D4A]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-none ${active ? 'text-[#E8EDFF]' : ''}`}>
                    {link.label}
                  </p>
                  <p className="text-[10px] text-[#374151] mt-0.5 group-hover:text-[#64748B] transition-colors">
                    {link.desc}
                  </p>
                </div>
                {active && (
                  <ChevronRight className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Card */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(30, 45, 74, 0.6)' }}>
          <Link href={isAdminOrHR ? '/admin/dashboard' : '/profile'}>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#131D36] border border-[#1E2D4A] hover:border-indigo-500/30 transition-all cursor-pointer group">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#CBD5E1] truncate leading-none">{fullName}</p>
                <p className="text-[10px] text-[#6366F1] font-medium mt-0.5">{roleLabel}</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" style={{ boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)' }} />
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};
