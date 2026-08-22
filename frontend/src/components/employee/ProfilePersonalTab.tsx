import React from 'react';
import { EmployeeProfile } from '../../types';

export const ProfilePersonalTab: React.FC<{ profile: EmployeeProfile }> = ({ profile }) => {
  const dob = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Not specified';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Private Info</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-4 border-b border-purple-100 dark:border-purple-900/30 pb-2">Personal Details</h4>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Gender</span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{profile.gender || 'Not specified'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">DOB</span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{dob}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Marital Status</span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Not specified</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Nationality</span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Not specified</span>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4 border-b border-indigo-100 dark:border-indigo-900/30 pb-2">Contact & Address</h4>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email Address</span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{profile.user?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Phone</span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{profile.phone || 'N/A'}</span>
            </div>
            <div className="flex flex-col space-y-1.5 border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Residing Address</span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {profile.address || 'No address provided'}
                {(profile.city || profile.state) && <><br />{profile.city}, {profile.state} {profile.postalCode}</>}
              </span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
