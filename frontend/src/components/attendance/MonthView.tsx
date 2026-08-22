import React from 'react';
import { Attendance } from '../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { EmptyState } from '../ui/EmptyState';

export const MonthView: React.FC<{ attendances: Attendance[] }> = ({ attendances }) => {
  if (!attendances || attendances.length === 0) {
    return <EmptyState title="No monthly records" description="No attendance data to aggregate by month." />;
  }

  const monthlyGrouped = attendances.reduce((acc: any, curr) => {
    const d = new Date(curr.date);
    const monthKey = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        present: 0,
        absent: 0,
        halfDay: 0,
        leave: 0,
        totalHours: 0,
        records: 0,
      };
    }
    acc[monthKey].records += 1;
    acc[monthKey].totalHours += curr.workedHours || 0;

    if (curr.status === 'PRESENT') acc[monthKey].present += 1;
    else if (curr.status === 'ABSENT') acc[monthKey].absent += 1;
    else if (curr.status === 'HALF_DAY') acc[monthKey].halfDay += 1;
    else if (curr.status === 'LEAVE') acc[monthKey].leave += 1;

    return acc;
  }, {});

  const rows = Object.values(monthlyGrouped);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead>Total Days Logged</TableHead>
          <TableHead>Present</TableHead>
          <TableHead>Absent</TableHead>
          <TableHead>Half Days</TableHead>
          <TableHead>On Leave</TableHead>
          <TableHead>Total Hours Worked</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row: any) => (
          <TableRow key={row.month}>
            <TableCell className="font-semibold text-slate-100">{row.month}</TableCell>
            <TableCell className="font-mono text-slate-300">{row.records} Days</TableCell>
            <TableCell className="font-mono text-emerald-400 font-semibold">{row.present}</TableCell>
            <TableCell className="font-mono text-rose-400">{row.absent}</TableCell>
            <TableCell className="font-mono text-amber-400">{row.halfDay}</TableCell>
            <TableCell className="font-mono text-purple-400">{row.leave}</TableCell>
            <TableCell className="font-mono font-bold text-purple-400">{row.totalHours.toFixed(1)} hrs</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
