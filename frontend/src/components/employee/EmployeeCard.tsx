import React from 'react';
import { EmployeeProfile } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Mail, Phone, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const EmployeeCard: React.FC<{ employee: EmployeeProfile }> = ({ employee }) => {
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const status = employee.user?.status || 'ACTIVE';

  return (
    <Link href={`/admin/employees/${employee.id}`} className="block group">
      <div
        className="rounded-2xl p-6 transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden flex flex-col h-full hover-lift"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Decorative Top Accent */}
        <div
          className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(90deg, var(--accent), #60A5FA)' }}
        />

        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Avatar name={fullName} src={employee.profilePicture} size="xl" />
            <div
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
              style={{
                borderColor: 'var(--bg-surface)',
                background: status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)',
                boxShadow: `0 0 6px ${status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)'}`,
              }}
              title={status}
            />
          </div>

          <h4
            className="text-base font-bold transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            {fullName}
          </h4>
          <p className="text-xs font-semibold mt-1" style={{ color: 'var(--accent)' }}>
            {employee.designation}
          </p>
          <p className="text-[10px] mt-0.5 uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
            {employee.department}
          </p>
        </div>

        <div className="mt-5 space-y-2 text-xs">
          <div
            className="flex items-center justify-center gap-2 p-2 rounded-xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          >
            <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
            <span className="truncate" style={{ color: 'var(--text-secondary)' }}>{employee.user?.email || 'N/A'}</span>
          </div>
          <div
            className="flex items-center justify-center gap-2 p-2 rounded-xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          >
            <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>{employee.phone || 'No phone'}</span>
          </div>
        </div>

        <div className="mt-auto pt-5 flex items-center justify-between">
          <span
            className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            ID: {employee.user?.employeeId}
          </span>
          <span
            className="flex items-center text-xs font-bold transition-colors group-hover:translate-x-0.5"
            style={{ color: 'var(--accent)' }}
          >
            View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};
