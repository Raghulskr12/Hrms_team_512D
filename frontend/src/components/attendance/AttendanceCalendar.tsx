'use client';

import React, { useState } from 'react';
import { Attendance } from '../../types';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface AttendanceCalendarProps {
  attendances: Attendance[];
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ attendances }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayRecord, setSelectedDayRecord] = useState<{ date: Date; attendance?: Attendance } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Map attendances by YYYY-MM-DD
  const attendanceMap = new Map<string, Attendance>();
  attendances.forEach((att) => {
    const d = new Date(att.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    attendanceMap.set(key, att);
  });

  const calendarCells = [];
  // Blank padding cells for leading days
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  const getStatusBadge = (att?: Attendance, isWeekend?: boolean) => {
    if (isWeekend) {
      return <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-sm bg-slate-800 text-slate-500">Weekend</span>;
    }
    if (!att) {
      return <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-sm bg-slate-800/60 text-slate-500">No Record</span>;
    }
    switch (att.status) {
      case 'PRESENT':
        return <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-sm bg-emerald-950/90 text-emerald-400 border border-emerald-800/60">Present</span>;
      case 'ABSENT':
        return <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-sm bg-rose-950/90 text-rose-400 border border-rose-800/60">Absent</span>;
      case 'HALF_DAY':
        return <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-sm bg-amber-950/90 text-amber-400 border border-amber-800/60">Half Day</span>;
      case 'LEAVE':
        return <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-sm bg-purple-950/90 text-purple-400 border border-purple-800/60">Leave</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-4">
      {/* Calendar Month Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-base font-semibold text-slate-100">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-slate-400 pb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarCells.map((day, idx) => {
          if (day === null) {
            return <div key={`blank-${idx}`} className="h-20 bg-slate-950/30 rounded-lg border border-slate-900/50" />;
          }

          const cellDate = new Date(year, month, day);
          const dayOfWeek = cellDate.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const att = attendanceMap.get(dateKey);

          return (
            <div
              key={day}
              onClick={() => setSelectedDayRecord({ date: cellDate, attendance: att })}
              className={`h-20 p-2 rounded-lg border transition-all flex flex-col justify-between cursor-pointer ${
                att?.status === 'PRESENT'
                  ? 'bg-emerald-950/20 border-emerald-900/40 hover:border-emerald-500/50'
                  : att?.status === 'ABSENT'
                  ? 'bg-rose-950/20 border-rose-900/40 hover:border-rose-500/50'
                  : att?.status === 'LEAVE'
                  ? 'bg-purple-950/20 border-purple-900/40 hover:border-purple-500/50'
                  : isWeekend
                  ? 'bg-slate-950/60 border-slate-900 text-slate-600'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${isWeekend ? 'text-slate-500' : 'text-slate-200'}`}>
                  {day}
                </span>
                {att?.workedHours ? (
                  <span className="text-[10px] font-mono text-slate-400">{att.workedHours}h</span>
                ) : null}
              </div>

              <div>{getStatusBadge(att, isWeekend)}</div>
            </div>
          );
        })}
      </div>

      {/* Day Details Modal Popover */}
      {selectedDayRecord && (
        <Modal
          isOpen={!!selectedDayRecord}
          onClose={() => setSelectedDayRecord(null)}
          title={`Attendance Details — ${selectedDayRecord.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
          maxWidth="sm"
        >
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">Status</span>
              {getStatusBadge(selectedDayRecord.attendance, selectedDayRecord.date.getDay() === 0 || selectedDayRecord.date.getDay() === 6)}
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div>
                <p className="text-xs text-slate-500">Check In</p>
                <p className="font-mono text-slate-200 mt-0.5">
                  {selectedDayRecord.attendance?.checkIn
                    ? new Date(selectedDayRecord.attendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--:--'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Check Out</p>
                <p className="font-mono text-slate-200 mt-0.5">
                  {selectedDayRecord.attendance?.checkOut
                    ? new Date(selectedDayRecord.attendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--:--'}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Worked Hours</span>
              <span className="font-semibold text-purple-400 font-mono">
                {selectedDayRecord.attendance?.workedHours || 0} Hours
              </span>
            </div>

            {selectedDayRecord.attendance?.remarks && (
              <div>
                <p className="text-xs text-slate-500">Remarks</p>
                <p className="text-xs text-slate-300 mt-1 italic bg-slate-950 p-2 rounded border border-slate-850">
                  "{selectedDayRecord.attendance.remarks}"
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
