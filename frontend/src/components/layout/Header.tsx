'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { Bell, Menu, Search, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  onOpenMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Dashboard', onOpenMobileSidebar }) => {
  const { user, logout } = useAuth();
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
        // ignore notification load error
      }
    };
    fetchNotifications();
  }, [user]);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
      </div>

      {/* Search Bar & Actions */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="hidden sm:flex items-center relative w-48 md:w-64">
          <Search className="w-4 h-4 absolute left-3 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search employees, requests..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Notifications Icon */}
        <Link
          href="/notifications"
          className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-purple-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User Pill Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center border border-purple-500/40">
              {user?.profile?.firstName ? `${user.profile.firstName[0]}${user.profile.lastName?.[0] || ''}` : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-none">
                {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : user?.email}
              </p>
              <p className="text-[10px] text-slate-400 leading-none mt-1">{user?.role}</p>
            </div>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in duration-150"
              onClick={() => setUserMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.email}</p>
                <p className="text-[10px] text-slate-400">{user?.employeeId}</p>
              </div>

              <Link
                href="/profile"
                className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </Link>

              <button
                onClick={() => logout()}
                className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs text-rose-400 hover:bg-slate-800"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
