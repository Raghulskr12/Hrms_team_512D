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
  X 
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
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/employees', label: 'Employees', icon: Users },
    { href: '/admin/attendance', label: 'Attendance', icon: Clock },
    { href: '/admin/leave', label: 'Time Off', icon: CalendarDays },
    { href: '/admin/payroll', label: 'Payroll', icon: DollarSign },
    { href: '/admin/reports', label: 'Reports', icon: PieChart },
  ];

  const userLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/attendance', label: 'Attendance', icon: Clock },
    { href: '/leave', label: 'Time Off', icon: CalendarDays },
    { href: '/salary', label: 'Salary Info', icon: Wallet },
  ];

  const links = isAdminOrHR ? adminLinks : userLinks;

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const navClasses = "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium";

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}
      >
        {/* Logo / Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href={isAdminOrHR ? '/admin/dashboard' : '/dashboard'} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
              D
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100">Dayflow</span>
          </Link>
          <button 
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            onClick={onCloseMobile}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <div className="px-3 mb-2">
            <p className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {isAdminOrHR ? 'Administration' : 'My Account'}
            </p>
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${navClasses} ${
                  active 
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-100/50 dark:border-purple-800/30' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                onClick={() => onCloseMobile()}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info (optional) */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/50 flex flex-col items-center text-center">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Need help?</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Contact IT Support</span>
          </div>
        </div>
      </aside>
    </>
  );
};
