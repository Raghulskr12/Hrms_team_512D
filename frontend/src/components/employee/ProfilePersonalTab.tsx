import React from 'react';
import { EmployeeProfile } from '../../types';

export const ProfilePersonalTab: React.FC<{ profile: EmployeeProfile }> = ({ profile }) => {
  const fields = [
    { label: 'Full Name', value: `${profile.firstName} ${profile.lastName}` },
    { label: 'Employee ID', value: profile.user?.employeeId || 'N/A' },
    { label: 'Work Email', value: profile.user?.email || 'N/A' },
    { label: 'Phone Number', value: profile.phone || 'Not specified' },
    {
      label: 'Date of Birth',
      value: profile.dateOfBirth
        ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Not specified',
    },
    { label: 'Gender', value: profile.gender || 'Not specified' },
    { label: 'Residential Address', value: profile.address || 'Not specified' },
    { label: 'City', value: profile.city || 'Not specified' },
    { label: 'State / Province', value: profile.state || 'Not specified' },
    { label: 'Postal Code', value: profile.postalCode || 'Not specified' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <h3 className="text-base font-semibold text-slate-100 pb-3 border-b border-slate-800">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {fields.map((f) => (
          <div key={f.label} className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-850">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{f.label}</p>
            <p className="text-slate-200 font-medium mt-1">{f.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
