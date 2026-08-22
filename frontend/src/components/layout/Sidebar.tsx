'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, CalendarDays, Clock,
  DollarSign, PieChart, User, Wallet, X, ChevronRight,
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
    { href: '/admin/dashboard', label: 'Dashboard',  icon: LayoutDashboard, desc: 'Overview' },
    { href: '/admin/employees', label: 'Employees',  icon: Users,            desc: 'Directory' },
    { href: '/admin/attendance',label: 'Attendance', icon: Clock,            desc: 'Tracking' },
    { href: '/admin/leave',     label: 'Time Off',   icon: CalendarDays,     desc: 'Approvals' },
    { href: '/admin/payroll',   label: 'Payroll',    icon: DollarSign,       desc: 'Compensation' },
    { href: '/admin/reports',   label: 'Analytics',  icon: PieChart,         desc: 'Reports' },
  ];
  const userLinks = [
    { href: '/dashboard',  label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview' },
    { href: '/profile',    label: 'Profile',   icon: User,            desc: 'My Account' },
    { href: '/attendance', label: 'Attendance',icon: Clock,           desc: 'My Records' },
    { href: '/leave',      label: 'Time Off',  icon: CalendarDays,    desc: 'My Leaves' },
    { href: '/salary',     label: 'Salary',    icon: Wallet,          desc: 'Pay Info' },
  ];

  const links = isAdminOrHR ? adminLinks : userLinks;
  const isActive = (href: string) =>
    href === '/dashboard' || href === '/admin/dashboard'
      ? pathname === href
      : pathname.startsWith(href);

  const fullName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email?.split('@')[0] || 'User';
  const initials = user?.profile
    ? `${user.profile.firstName?.[0] || ''}${user.profile.lastName?.[0] || ''}`
    : (user?.email?.[0] || 'U').toUpperCase();
  const roleLabel =
    user?.role === 'ADMIN' ? 'Administrator' :
    user?.role === 'HR'    ? 'HR Manager'    : 'Employee';

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`nx-sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <Link href={isAdminOrHR ? '/admin/dashboard' : '/dashboard'}
            className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-all group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)', boxShadow: '0 0 16px var(--accent-glow)' }}>
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                <path d="M14 3L24 8.5V19.5L14 25L4 19.5V8.5L14 3Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
                <circle cx="14" cy="14" r="3" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>NexusHR</p>
              <p className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Workforce Platform</p>
            </div>
          </Link>
          <button className="lg:hidden p-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)' }}
            onClick={onCloseMobile}>
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5">
          <div className="px-3 mb-3">
            <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
              {isAdminOrHR ? 'Administration' : 'My Workspace'}
            </p>
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href} onClick={() => onCloseMobile()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${active ? 'nav-active' : ''}`}
                style={!active ? { color: 'var(--text-muted)' } : { color: 'var(--text-primary)' }}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                    style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }}/>
                )}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                  style={active
                    ? { background: 'var(--accent-glow)', color: 'var(--accent-light)' }
                    : { background: 'var(--bg-elevated)', color: 'var(--text-muted)' }
                  }>
                  <Icon className="w-4 h-4"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold leading-none">{link.label}</p>
                  <p className="text-[10px] mt-0.5 transition-colors" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>{link.desc}</p>
                </div>
                {active && <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--accent)' }}/>}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href={isAdminOrHR ? '/admin/dashboard' : '/profile'}>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-glow)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)' }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate leading-none" style={{ color: 'var(--text-primary)' }}>{fullName}</p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--accent-light)' }}>{roleLabel}</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: 'var(--success)', boxShadow: `0 0 6px var(--success)` }}/>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};
