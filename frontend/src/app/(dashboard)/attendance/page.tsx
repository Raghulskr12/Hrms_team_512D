'use client';

import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../../services/attendanceService';
import { Attendance } from '../../../types';
import { CheckInWidget } from '../../../components/attendance/CheckInWidget';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Clock, Info, Calendar as CalendarIcon } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';

export default function EmployeeAttendancePage() {
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [todayRes, historyRes] = await Promise.all([
        attendanceService.getToday(),
        attendanceService.getMyHistory(),
      ]);

      setTodayAttendance(todayRes || null);
      setHistory(historyRes || []);
    } catch (e) {
      console.error('Error fetching attendance data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Attendance
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage and track your daily work hours.</p>
        </div>
      </div>

      {/* Live Punch Widget */}
      <CheckInWidget todayAttendance={todayAttendance} onRefresh={fetchData} />

      {/* Note Section */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex items-start space-x-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">NOTE</h4>
          <p className="text-xs text-amber-700 dark:text-amber-500/80 mt-1 leading-relaxed">
            Please ensure you check in and check out promptly to accurately record your working hours.
            Overtime hours must be pre-approved by your manager. Contact HR for any discrepancies in your logs.
          </p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Attendance Log</h3>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <CalendarIcon className="w-3.5 h-3.5 mr-1" />
            This Month
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center"><LoadingSpinner message="Loading attendance logs..." /></div>
        ) : history.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Work Hours</TableHead>
                <TableHead>Extra Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record) => {
                const date = new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const checkIn = record.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--';
                const checkOut = record.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--';
                
                // Mocking hours for UI showcase
                const workHours = record.checkOut ? '8h 15m' : '--';
                const extraHours = record.checkOut ? '15m' : '--';

                return (
                  <TableRow key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100 py-4">{date}</TableCell>
                    <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">{checkIn}</TableCell>
                    <TableCell className="text-rose-600 dark:text-rose-400 font-medium">{checkOut}</TableCell>
                    <TableCell className="font-mono text-slate-600 dark:text-slate-300">{workHours}</TableCell>
                    <TableCell className="font-mono text-purple-600 dark:text-purple-400">{extraHours}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="p-12 text-center text-slate-500">
            No attendance records found for this period.
          </div>
        )}
      </div>
    </div>
  );
}
