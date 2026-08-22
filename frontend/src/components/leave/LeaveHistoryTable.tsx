import React from 'react';
import { LeaveRequest } from '../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

export const LeaveHistoryTable: React.FC<{ requests: LeaveRequest[] }> = ({ requests }) => {
  if (!requests || requests.length === 0) {
    return <EmptyState title="No leave applications" description="You have not submitted any leave requests yet." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Days</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Approver Remarks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <TableRow key={req.id}>
            <TableCell className="font-semibold text-slate-200">{req.leaveType}</TableCell>
            <TableCell className="font-mono text-xs text-slate-300">
              {new Date(req.startDate).toLocaleDateString()} — {new Date(req.endDate).toLocaleDateString()}
            </TableCell>
            <TableCell className="font-mono text-xs font-semibold text-purple-400">
              {req.numberOfDays} Day(s)
            </TableCell>
            <TableCell className="text-xs text-slate-300 max-w-xs truncate">{req.reason}</TableCell>
            <TableCell>
              <Badge
                variant={
                  req.status === 'APPROVED'
                    ? 'success'
                    : req.status === 'REJECTED'
                    ? 'danger'
                    : 'warning'
                }
              >
                {req.status}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-slate-400 italic">
              {req.approvalComment || '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
