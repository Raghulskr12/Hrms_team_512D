import React from 'react';
import { EmployeeProfile } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Mail, Phone, Building2 } from 'lucide-react';
import Link from 'next/link';

export const EmployeeCard: React.FC<{ employee: EmployeeProfile }> = ({ employee }) => {
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const status = employee.user?.status || 'ACTIVE';

  return (
    <Link href={`/admin/employees/${employee.id}`}>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-purple-500/50 hover:bg-slate-900/90 transition-all flex flex-col justify-between space-y-4 group">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar name={fullName} src={employee.profilePicture} size="md" />
            <div>
              <h4 className="text-sm font-semibold text-slate-100 group-hover:text-purple-400 transition-colors">
                {fullName}
              </h4>
              <p className="text-xs text-slate-400">{employee.designation}</p>
            </div>
          </div>
          <Badge variant={status === 'ACTIVE' ? 'success' : 'neutral'}>
            {status}
          </Badge>
        </div>

        <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-850">
          <div className="flex items-center space-x-2">
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{employee.department} • {employee.employmentType}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{employee.user?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{employee.phone || 'No phone'}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-850/60 font-mono">
          <span>ID: {employee.user?.employeeId}</span>
          <span className="text-purple-400 group-hover:underline">View Profile →</span>
        </div>
      </div>
    </Link>
  );
};
