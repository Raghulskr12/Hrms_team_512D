'use client';

import React, { useState, useEffect } from 'react';
import { profileService } from '../../../services/profileService';
import { EmployeeProfile } from '../../../types';
import { ProfileSalaryTab } from '../../../components/employee/ProfileSalaryTab';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export default function EmployeeSalaryPage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProf = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data || null);
      } catch (e) {
        console.error('Error fetching profile:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProf();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading salary information..." size="lg" />;
  }

  if (!profile) {
    return <div className="p-8 text-center text-slate-400">Employee profile not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">My Salary & Paystub Summary</h2>
        <p className="text-xs text-slate-400 mt-1">Authorized breakdown of your current basic salary, allowances, and deductions.</p>
      </div>

      <ProfileSalaryTab employeeProfileId={profile.id} isAdminOrHR={false} />
    </div>
  );
}
