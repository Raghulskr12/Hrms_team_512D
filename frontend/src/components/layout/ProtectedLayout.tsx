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
    return <LoadingSpinner message="Authenticating session..." size="lg" />;
  }

  const getPageTitle = (path: string) => {
    if (path.includes('/admin/employees')) return 'Employee Directory';
    if (path.includes('/admin/attendance')) return 'Attendance Hub';
    if (path.includes('/admin/leave')) return 'Leave Approvals';
    if (path.includes('/admin/payroll')) return 'Payroll Management';
    if (path.includes('/admin/reports')) return 'Analytics & Reports';
    if (path.includes('/admin/dashboard')) return 'HR Dashboard';
    if (path.includes('/profile')) return 'My Profile';
    if (path.includes('/attendance')) return 'My Attendance';
    if (path.includes('/leave')) return 'Time Off Management';
    if (path.includes('/salary')) return 'Salary & Compensation';
    if (path.includes('/notifications')) return 'Notifications';
    return 'Dashboard';
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#0A0E1A' }}
    >
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={getPageTitle(pathname)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main
          className="flex-1 overflow-y-auto"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.04) 0%, transparent 60%), #0A0E1A',
          }}
        >
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
