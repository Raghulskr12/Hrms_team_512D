import React from 'react';
import { Attendance } from '../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

export const DayView: React.FC<{ attendances: Attendance[] }> = ({ attendances }) => {
  if (!attendances || attendances.length === 0) {
    return <EmptyState title="No daily attendance records" description="No check-in or check-out logs found." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Employee</TableHead>
          <TableHead>Check In</TableHead>
          <TableHead>Check Out</TableHead>
          <TableHead>Worked Hours</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Remarks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendances.map((att) => (
          <TableRow key={att.id}>
            <TableCell className="font-mono text-xs text-slate-300">
              {new Date(att.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </TableCell>
            <TableCell className="font-medium text-slate-200">
              {att.employee ? `${att.employee.firstName} ${att.employee.lastName}` : 'Self'}
            </TableCell>
            <TableCell className="font-mono text-xs">
              {att.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </TableCell>
            <TableCell className="font-mono text-xs">
              {att.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </TableCell>
            <TableCell className="font-mono font-semibold text-purple-400">
              {att.workedHours || 0} hrs
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  att.status === 'PRESENT'
                    ? 'success'
                    : att.status === 'ABSENT'
                    ? 'danger'
                    : att.status === 'HALF_DAY'
                    ? 'warning'
                    : 'purple'
                }
              >
                {att.status}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-slate-400 max-w-xs truncate">
              {att.remarks || '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
