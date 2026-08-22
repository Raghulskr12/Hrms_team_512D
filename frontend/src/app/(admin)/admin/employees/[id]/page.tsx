'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { employeeService } from '../../../../../services/employeeService';
import { EmployeeProfile } from '../../../../../types';
import { Avatar } from '../../../../../components/ui/Avatar';
import { Badge } from '../../../../../components/ui/Badge';
import { Button } from '../../../../../components/ui/Button';
import { Tabs } from '../../../../../components/ui/Tabs';
import { LoadingSpinner } from '../../../../../components/ui/LoadingSpinner';
import { ProfilePersonalTab } from '../../../../../components/employee/ProfilePersonalTab';
import { ProfileJobTab } from '../../../../../components/employee/ProfileJobTab';
import { ProfileBankTab } from '../../../../../components/employee/ProfileBankTab';
import { ProfileSalaryTab } from '../../../../../components/employee/ProfileSalaryTab';
import { ProfileDocumentsTab } from '../../../../../components/employee/ProfileDocumentsTab';
import { ArrowLeft, User, Briefcase, ShieldCheck, DollarSign, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminEmployeeDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('personal');

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getById(id);
      setEmployee(data);
    } catch (e) {
      console.error('Error fetching employee details:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading employee profile..." size="lg" />;
  }

  if (!employee) {
    return (
      <div className="space-y-4">
        <Link href="/admin/employees" className="text-xs text-purple-400 hover:underline flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Employee Directory
        </Link>
        <div className="p-8 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
          Requested employee profile not found.
        </div>
      </div>
    );
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: <User className="w-4 h-4" /> },
    { id: 'job', label: 'Job Information', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'bank', label: 'Bank Information', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'salary', label: 'Salary Information', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin/employees" className="text-xs text-purple-400 hover:underline inline-flex items-center">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Employee Directory
      </Link>

      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-5">
          <Avatar name={fullName} src={employee.profilePicture} size="xl" />
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-slate-100">{fullName}</h2>
              <Badge variant={employee.user?.status === 'ACTIVE' ? 'success' : 'neutral'}>
                {employee.user?.status || 'ACTIVE'}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {employee.designation} • <strong className="text-purple-400">{employee.department}</strong>
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono mt-2">
              <span>ID: {employee.user?.employeeId}</span>
              <span>•</span>
              <span>Role: {employee.user?.role}</span>
              <span>•</span>
              <span>{employee.user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      <div>
        {activeTab === 'personal' && <ProfilePersonalTab profile={employee} />}
        {activeTab === 'job' && <ProfileJobTab profile={employee} />}
        {activeTab === 'bank' && <ProfileBankTab employeeProfileId={employee.id} isEditable={true} />}
        {activeTab === 'salary' && <ProfileSalaryTab employeeProfileId={employee.id} isAdminOrHR={true} />}
        {activeTab === 'documents' && <ProfileDocumentsTab employeeProfileId={employee.id} />}
      </div>
    </div>
  );
}
