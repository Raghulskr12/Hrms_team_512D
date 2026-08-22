'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requireAdminOrHR?: boolean;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  children,
  requireAdminOrHR = false,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (requireAdminOrHR && user.role !== 'ADMIN' && user.role !== 'HR') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, requireAdminOrHR]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner message="Authenticating session..." size="lg" />
      </div>
    );
  }

  // Derive human title from pathname
  const getPageTitle = (path: string) => {
    if (path.includes('/admin/employees')) return 'Employee Directory';
    if (path.includes('/admin/attendance')) return 'Master Attendance Hub';
    if (path.includes('/admin/leave')) return 'Leave Approvals';
    if (path.includes('/admin/payroll')) return 'Payroll Management';
    if (path.includes('/admin/reports')) return 'HR Analytics & Reports';
    if (path.includes('/admin/dashboard')) return 'HR Executive Dashboard';
    if (path.includes('/profile')) return 'My Employee Profile';
    if (path.includes('/attendance')) return 'My Attendance';
    if (path.includes('/leave')) return 'My Leave Management';
    if (path.includes('/salary')) return 'My Salary Breakdown';
    if (path.includes('/notifications')) return 'Notifications Center';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={getPageTitle(pathname)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
