'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  CreditCard,
  Bell,
  Users,
  FileCheck,
  BarChart3,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const employeeLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', href: '/profile', icon: User },
    { label: 'Attendance', href: '/attendance', icon: Clock },
    { label: 'Leave', href: '/leave', icon: CalendarDays },
    { label: 'Salary', href: '/salary', icon: CreditCard },
    { label: 'Notifications', href: '/notifications', icon: Bell },
  ];

  const adminLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Employees', href: '/admin/employees', icon: Users },
    { label: 'Attendance', href: '/admin/attendance', icon: Clock },
    { label: 'Leave Requests', href: '/admin/leave', icon: FileCheck },
    { label: 'Payroll', href: '/admin/payroll', icon: CreditCard },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Notifications', href: '/notifications', icon: Bell },
  ];

  const links = isAdminOrHR ? adminLinks : employeeLinks;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <Link href={isAdminOrHR ? '/admin/dashboard' : '/dashboard'} className="flex flex-col">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-900/40">
                D
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-100">DAYFLOW</span>
            </div>
            <span className="text-[10px] font-medium text-purple-400 mt-0.5 tracking-wide">
              Every workday, perfectly aligned.
            </span>
          </Link>

          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            {isAdminOrHR ? 'HR Administration' : 'Employee Portal'}
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/dashboard' && link.href !== '/admin/dashboard' && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobile}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom User Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-slate-800 text-purple-400 border border-purple-500/30 flex items-center justify-center font-semibold text-xs shrink-0">
                {user?.profile?.firstName ? `${user.profile.firstName[0]}${user.profile.lastName?.[0] || ''}` : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : user?.email}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.role} • {user?.employeeId}
                </p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
