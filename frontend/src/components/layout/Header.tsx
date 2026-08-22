'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/notificationService';
import { Bell, Menu, Search, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  onOpenMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Dashboard', onOpenMobileSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (user) {
          const list = await notificationService.getAll();
          setUnreadCount((list || []).filter((n) => !n.isRead).length);
        }
      } catch {}
    };
    load();
  }, [user]);

  const initials = user?.profile
    ? `${user.profile.firstName?.[0] || ''}${user.profile.lastName?.[0] || ''}`
    : (user?.email?.[0] || 'U').toUpperCase();
  const fullName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user?.email || 'User';

  return (
    <header className="nx-header h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl transition-all"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
          <Menu className="w-5 h-5"/>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full hidden sm:block"
            style={{ background: 'linear-gradient(180deg,var(--accent),#60A5FA)', boxShadow: '0 0 8px var(--accent-glow)' }}/>
          <h1 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden sm:flex items-center relative w-40 md:w-52">
          <Search className="w-3.5 h-3.5 absolute left-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}/>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl transition-all focus:outline-none"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow-sm)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl transition-all"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4" style={{ color: 'var(--warning)' }}/>
            : <Moon className="w-4 h-4" style={{ color: 'var(--accent)' }}/>}
        </button>

        {/* Notifications */}
        <Link href="/notifications"
          className="relative p-2 rounded-xl transition-all"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <Bell className="w-4 h-4"/>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full"
              style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl transition-all"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          >
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)', boxShadow: '0 0 10px var(--accent-glow)' }}>
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[11px] font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>{fullName}</p>
              <p className="text-[9px] font-medium mt-0.5" style={{ color: 'var(--accent)' }}>{user?.role}</p>
            </div>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-2xl py-1.5 z-50 animate-fade-in overflow-hidden"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              onClick={() => setUserMenuOpen(false)}
            >
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)' }}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{fullName}</p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <Link href="/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs transition-all"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <UserIcon className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }}/>
                  My Profile
                </Link>
                <button onClick={() => logout()}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs transition-all"
                  style={{ color: 'var(--danger)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut className="w-3.5 h-3.5"/>
                  Sign Out
                </button>
              </div>
              <div className="px-4 py-2" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{user?.employeeId}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
