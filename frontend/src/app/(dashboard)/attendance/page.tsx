'use client';

import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../../services/attendanceService';
import { Attendance } from '../../../types';
import { CheckInWidget } from '../../../components/attendance/CheckInWidget';
import { AttendanceCalendar } from '../../../components/attendance/AttendanceCalendar';
import { DayView } from '../../../components/attendance/DayView';
import { WeekView } from '../../../components/attendance/WeekView';
import { MonthView } from '../../../components/attendance/MonthView';
import { Tabs } from '../../../components/ui/Tabs';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Clock, Calendar as CalendarIcon, Table as TableIcon, Layers } from 'lucide-react';

export default function EmployeeAttendancePage() {
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('calendar');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [todayRes, historyRes] = await Promise.all([
        attendanceService.getToday(),
        attendanceService.getMyHistory(),
      ]);

      setTodayAttendance(todayRes);
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

  const tabs = [
    { id: 'calendar', label: 'Calendar View', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'day', label: 'Daily View', icon: <Clock className="w-4 h-4" /> },
    { id: 'week', label: 'Weekly View', icon: <TableIcon className="w-4 h-4" /> },
    { id: 'month', label: 'Monthly View', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Live Punch Widget */}
      <CheckInWidget todayAttendance={todayAttendance} onRefresh={fetchData} />

      {/* Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Views */}
      {loading ? (
        <LoadingSpinner message="Loading attendance logs..." />
      ) : (
        <div>
          {activeTab === 'calendar' && <AttendanceCalendar attendances={history} />}
          {activeTab === 'day' && <DayView attendances={history} />}
          {activeTab === 'week' && <WeekView attendances={history} />}
          {activeTab === 'month' && <MonthView attendances={history} />}
        </div>
      )}
    </div>
  );
}
