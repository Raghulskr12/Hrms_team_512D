import React from 'react';
import { Attendance } from '../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { EmptyState } from '../ui/EmptyState';

export const WeekView: React.FC<{ attendances: Attendance[] }> = ({ attendances }) => {
  if (!attendances || attendances.length === 0) {
    return <EmptyState title="No weekly records" description="No attendance logs to summarize by week." />;
  }

  // Group by week
  const getWeekNumber = (d: Date) => {
    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.round((firstThursday - target.valueOf()) / 604800000);
  };

  const grouped = attendances.reduce((acc: any, curr) => {
    const d = new Date(curr.date);
    const weekKey = `Week ${getWeekNumber(d)}, ${d.getFullYear()}`;
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(curr);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([weekLabel, items]: [string, any]) => {
        const totalHours = items.reduce((sum: number, i: Attendance) => sum + (i.workedHours || 0), 0);
        const presentCount = items.filter((i: Attendance) => i.status === 'PRESENT').length;

        return (
          <div key={weekLabel} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-semibold text-slate-200">{weekLabel}</h4>
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-slate-400">Days Present: <strong className="text-emerald-400">{presentCount}</strong></span>
                <span className="text-slate-400">Total Worked: <strong className="text-purple-400 font-mono">{totalHours.toFixed(1)} hrs</strong></span>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((att: Attendance) => (
                  <TableRow key={att.id}>
                    <TableCell className="font-mono text-xs">
                      {new Date(att.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {att.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {att.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-purple-400">
                      {att.workedHours}h
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-300">
                      {att.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
};
