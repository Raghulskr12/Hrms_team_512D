import React from 'react';
import { LeaveRequest } from '../../types';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

export const LeaveHistoryTable: React.FC<{ requests: LeaveRequest[] }> = ({ requests }) => {
  if (!requests || requests.length === 0) {
    return <EmptyState title="No leave applications" description="You have not submitted any leave requests yet." />;
  }

  const statusVariant = (status: string) =>
    status === 'APPROVED' ? 'success' as const :
    status === 'REJECTED' ? 'danger' as const : 'warning' as const;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
            {['Type', 'Dates', 'Days', 'Reason', 'Status', 'Approver Remarks'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-muted)', fontSize: 10 }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requests.map((req, i) => (
            <tr
              key={req.id}
              className="nx-table-row transition-all"
              style={{ borderBottom: i < requests.length - 1 ? '1px solid var(--border-muted)' : 'none' }}
            >
              <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                {req.leaveType}
              </td>
              <td className="px-4 py-3 font-mono" style={{ color: 'var(--text-secondary)' }}>
                {new Date(req.startDate).toLocaleDateString()} — {new Date(req.endDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--accent)' }}>
                {req.numberOfDays} Day(s)
              </td>
              <td className="px-4 py-3 max-w-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {req.reason}
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant(req.status)}>{req.status}</Badge>
              </td>
              <td className="px-4 py-3 italic" style={{ color: 'var(--text-muted)' }}>
                {req.approvalComment || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
