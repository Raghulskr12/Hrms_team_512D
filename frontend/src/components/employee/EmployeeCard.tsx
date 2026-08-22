import React from 'react';
import { EmployeeProfile } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Mail, Phone, Briefcase, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const EmployeeCard: React.FC<{ employee: EmployeeProfile }> = ({ employee }) => {
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const status = employee.user?.status || 'ACTIVE';

  return (
    <Link href={`/admin/employees/${employee.id}`} className="block group">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-500/50 transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden flex flex-col h-full">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Avatar name={fullName} src={employee.profilePicture} size="xl" className="ring-4 ring-slate-50 dark:ring-slate-800" />
            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} title={status}></div>
          </div>
          
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {fullName}
          </h4>
          <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mt-1">{employee.designation}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">{employee.department}</p>
        </div>

        <div className="mt-6 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-center space-x-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{employee.user?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{employee.phone || 'No phone'}</span>
          </div>
        </div>

        <div className="mt-auto pt-5 flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            ID: {employee.user?.employeeId}
          </span>
          <span className="flex items-center text-xs font-bold text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            View <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};
