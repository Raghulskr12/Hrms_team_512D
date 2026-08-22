'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/notificationService';
import { Bell, Menu, Search, LogOut, User as UserIcon, Sun, Moon, Settings } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  onOpenMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Dashboard', onOpenMobileSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (user) {
          const list = await notificationService.getAll();
          const unread = (list || []).filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchNotifications();
  }, [user]);

  const initials = user?.profile
    ? `${user.profile.firstName?.[0] || ''}${user.profile.lastName?.[0] || ''}`
    : (user?.email?.[0] || 'U').toUpperCase();

  const fullName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email || 'User';

  return (
    <header
      className="h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 flex-shrink-0"
      style={{
        background: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(30, 45, 74, 0.6)',
      }}
    >
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[#64748B] hover:text-[#E8EDFF] hover:bg-[#131D36] transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 hidden sm:block" style={{ boxShadow: '0 0 8px rgba(99,102,241,0.6)' }} />
          <h1 className="text-sm font-bold text-[#E8EDFF]">{title}</h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden sm:flex items-center relative w-40 md:w-52">
          <Search className="w-3.5 h-3.5 absolute left-3 text-[#4B5563] pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#CBD5E1] placeholder-[#4B5563] focus:outline-none transition-all rounded-xl"
            style={{
              background: 'rgba(19, 29, 54, 0.8)',
              border: '1px solid rgba(30, 45, 74, 0.8)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.08)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(30, 45, 74, 0.8)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[#64748B] hover:text-[#E8EDFF] hover:bg-[#131D36] border border-transparent hover:border-[#1E2D4A] transition-all"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-xl text-[#64748B] hover:text-[#E8EDFF] hover:bg-[#131D36] border border-transparent hover:border-[#1E2D4A] transition-all"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                boxShadow: '0 0 8px rgba(99,102,241,0.6)',
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#131D36] border border-transparent hover:border-[#1E2D4A] transition-all"
          >
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                boxShadow: '0 0 10px rgba(99,102,241,0.4)',
              }}
            >
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[11px] font-semibold text-[#CBD5E1] leading-none">{fullName}</p>
              <p className="text-[9px] text-[#6366F1] font-medium mt-0.5">{user?.role}</p>
            </div>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-2xl py-1.5 z-50 animate-fade-in overflow-hidden"
              style={{
                background: '#0F1629',
                border: '1px solid rgba(30, 45, 74, 0.9)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)',
              }}
              onClick={() => setUserMenuOpen(false)}
            >
              {/* User info header */}
              <div className="px-4 py-3 border-b border-[#1E2D4A]">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#E8EDFF] truncate">{fullName}</p>
                    <p className="text-[10px] text-[#64748B] truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#94A3B8] hover:text-[#E8EDFF] hover:bg-[#131D36] transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>My Profile</span>
                </Link>

                <button
                  onClick={() => logout()}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Employee ID footer */}
              <div className="px-4 py-2 border-t border-[#1E2D4A]">
                <p className="text-[10px] text-[#374151] font-mono">{user?.employeeId}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
