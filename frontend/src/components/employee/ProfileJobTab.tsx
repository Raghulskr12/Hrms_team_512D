import React from 'react';
import { EmployeeProfile } from '../../types';
import { Badge } from '../ui/Badge';

export const ProfileJobTab: React.FC<{ profile: EmployeeProfile }> = ({ profile }) => {
  const fields = [
    { label: 'Designation / Title', value: profile.designation },
    { label: 'Department', value: profile.department },
    { label: 'Employment Type', value: profile.employmentType },
    {
      label: 'Date of Joining',
      value: new Date(profile.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    },
    { label: 'Reporting Manager', value: profile.manager || 'HR Administration' },
    { label: 'Employment Status', value: profile.user?.status || 'ACTIVE', isStatus: true },
    { label: 'System Role', value: profile.user?.role || 'EMPLOYEE' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <h3 className="text-base font-semibold text-slate-100 pb-3 border-b border-slate-800">
        Job & Employment Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {fields.map((f) => (
          <div key={f.label} className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-850">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{f.label}</p>
            {f.isStatus ? (
              <div className="mt-1.5">
                <Badge variant={f.value === 'ACTIVE' ? 'success' : 'neutral'}>{f.value}</Badge>
              </div>
            ) : (
              <p className="text-slate-200 font-medium mt-1">{f.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
