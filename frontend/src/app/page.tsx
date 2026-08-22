'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'ADMIN' || user.role === 'HR') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <LoadingSpinner message="Initializing Dayflow HRMS..." size="lg" />
    </div>
  );
}
