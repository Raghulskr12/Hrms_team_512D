'use client';

import React, { useState, useEffect } from 'react';
import { profileService } from '../../../services/profileService';
import { EmployeeProfile } from '../../../types';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Tabs } from '../../../components/ui/Tabs';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ProfilePersonalTab } from '../../../components/employee/ProfilePersonalTab';
import { ProfileJobTab } from '../../../components/employee/ProfileJobTab';
import { ProfileBankTab } from '../../../components/employee/ProfileBankTab';
import { ProfileSalaryTab } from '../../../components/employee/ProfileSalaryTab';
import { ProfileDocumentsTab } from '../../../components/employee/ProfileDocumentsTab';
import { EditProfileModal } from '../../../components/employee/EditProfileModal';
import { Edit3, User, Briefcase, ShieldCheck, DollarSign, FileText } from 'lucide-react';

export default function EmployeeProfilePage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data || null);
    } catch (e) {
      console.error('Error fetching profile:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading employee profile..." size="lg" />;
  }

  if (!profile) {
    return <div className="p-8 text-center text-slate-400">Employee profile not found.</div>;
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;

  const tabs = [
    { id: 'resume', label: 'Resume', icon: <User className="w-4 h-4" /> },
    { id: 'personal', label: 'Private Info', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'salary', label: 'Salary Info', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header matching wireframe */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-5">
          <Avatar name={fullName} src={profile.profilePicture} size="xl" />
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-slate-100">{fullName}</h2>
              <Badge variant={profile.user?.status === 'ACTIVE' ? 'success' : 'neutral'}>
                {profile.user?.status || 'ACTIVE'}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {profile.designation} • <strong className="text-purple-400">{profile.department}</strong>
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono mt-2">
              <span>ID: {profile.user?.employeeId}</span>
              <span>•</span>
              <span>{profile.user?.email}</span>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
          <Edit3 className="w-4 h-4 mr-1.5" />
          Edit Contact Info
        </Button>
      </div>

      {/* Tabs Navigation matching wireframe */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      <div>
        {activeTab === 'resume' && <ProfileJobTab profile={profile} />}
        {activeTab === 'personal' && <ProfilePersonalTab profile={profile} />}
        {activeTab === 'salary' && <ProfileSalaryTab employeeProfileId={profile.id} isAdminOrHR={false} />}
        {activeTab === 'security' && <div className="p-8 text-center text-slate-500">Security settings coming soon...</div>}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        profile={profile}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={fetchProfile}
      />
    </div>
  );
}
