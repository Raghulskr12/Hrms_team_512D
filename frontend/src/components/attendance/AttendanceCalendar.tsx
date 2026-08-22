'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Attendance } from '../../types';

interface AttendanceCalendarProps {
  records: Attendance[];
  className?: string;
}

type StatusType = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'WEEKEND' | 'EMPTY';

interface DayInfo {
  date: Date;
  status: StatusType;
  record?: Attendance;
}

const STATUS_CONFIG: Record<StatusType, { label: string; cellClass: string; dot: string }> = {
  PRESENT:  { label: 'Present',  cellClass: 'cal-cell-present',  dot: '#10B981' },
  ABSENT:   { label: 'Absent',   cellClass: 'cal-cell-absent',   dot: '#F43F5E' },
  HALF_DAY: { label: 'Half Day', cellClass: 'cal-cell-half',     dot: '#F59E0B' },
  LEAVE:    { label: 'Leave',    cellClass: 'cal-cell-leave',    dot: '#8B5CF6' },
  WEEKEND:  { label: 'Weekend',  cellClass: 'cal-cell-weekend',  dot: '#64748B' },
  EMPTY:    { label: '—',        cellClass: 'cal-cell-empty',    dot: 'transparent' },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ records, className = '' }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun

  // Map records by date string
  const recordMap: Record<string, Attendance> = {};
  records.forEach((r) => {
    const key = new Date(r.date).toISOString().split('T')[0];
    recordMap[key] = r;
  });

  // Build cells
  const cells: (DayInfo | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const key = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const record = recordMap[key];
    let status: StatusType = isWeekend ? 'WEEKEND' : 'EMPTY';
    if (record) status = record.status as StatusType;
    cells.push({ date, status, record });
  }

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday  = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

  // Stats for this month
  const presentCount  = cells.filter((c) => c?.status === 'PRESENT').length;
  const absentCount   = cells.filter((c) => c?.status === 'ABSENT').length;
  const leaveCount    = cells.filter((c) => c?.status === 'LEAVE').length;
  const halfDayCount  = cells.filter((c) => c?.status === 'HALF_DAY').length;

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      
      {/* ── Calendar Header ── */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <ChevronLeft className="w-4 h-4"/>
          </button>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {MONTHS[month]} {year}
          </h3>
          <button onClick={nextMonth}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
        <button onClick={goToday}
          className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
          style={{ background: 'var(--accent-glow-sm)', color: 'var(--accent)', border: '1px solid var(--border)' }}
        >
          Today
        </button>
      </div>

      {/* ── Month Stats ── */}
      <div className="grid grid-cols-4 gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
        {[
          { label: 'Present',  value: presentCount,  color: '#10B981' },
          { label: 'Absent',   value: absentCount,   color: '#F43F5E' },
          { label: 'Leave',    value: leaveCount,    color: '#8B5CF6' },
          { label: 'Half Day', value: halfDayCount,  color: '#F59E0B' },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center py-3 px-2"
            style={{ borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <span className="text-lg font-black font-mono" style={{ color: s.color }}>{s.value}</span>
            <span className="text-[9px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Day Headers ── */}
      <div className="grid grid-cols-7 px-4 pt-3 pb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{d}</span>
          </div>
        ))}
      </div>

      {/* ── Calendar Grid ── */}
      <div className="grid grid-cols-7 gap-1.5 px-4 pb-4">
        {cells.map((cell, idx) => {
          if (!cell) {
            return <div key={`empty-${idx}`} className="aspect-square rounded-lg" style={{ background: 'var(--bg-elevated)', opacity: 0.2 }}/>;
          }
          const { date, status, record } = cell;
          const cfg = STATUS_CONFIG[status];
          const isT = isToday(date);
          return (
            <button
              key={idx}
              onClick={() => cell.status !== 'EMPTY' ? setSelectedDay(cell) : undefined}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all text-center ${cfg.cellClass} ${isT ? 'cal-cell-today' : ''} ${status !== 'EMPTY' ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
              title={cfg.label}
            >
              <span className="text-[11px] font-bold" style={{ color: 'inherit' }}>
                {date.getDate()}
              </span>
              {status !== 'EMPTY' && status !== 'WEEKEND' && (
                <div className="w-1 h-1 rounded-full" style={{ background: cfg.dot }}/>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-3 px-4 pb-4 justify-center">
        {Object.entries(STATUS_CONFIG)
          .filter(([k]) => k !== 'EMPTY')
          .map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: cfg.dot }}/>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{cfg.label}</span>
            </div>
          ))}
      </div>

      {/* ── Day Detail Popover ── */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedDay(null)}>
          <div
            className="rounded-2xl p-5 w-full max-w-xs animate-calendar-pop"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h4>
              <button onClick={() => setSelectedDay(null)}
                className="p-1 rounded-lg transition-all"
                style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
                <X className="w-4 h-4"/>
              </button>
            </div>

            {selectedDay.record ? (
              <div className="space-y-3">
                {/* Status badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${STATUS_CONFIG[selectedDay.status].cellClass}`}>
                  <div className="w-2 h-2 rounded-full" style={{ background: STATUS_CONFIG[selectedDay.status].dot }}/>
                  {STATUS_CONFIG[selectedDay.status].label}
                </div>
                <div className="space-y-2">
                  {[
                    {
                      label: 'Check In',
                      value: selectedDay.record.checkIn
                        ? new Date(selectedDay.record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—',
                      color: 'var(--success)',
                    },
                    {
                      label: 'Check Out',
                      value: selectedDay.record.checkOut
                        ? new Date(selectedDay.record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—',
                      color: 'var(--danger)',
                    },
                    {
                      label: 'Hours Worked',
                      value: selectedDay.record.workedHours ? `${selectedDay.record.workedHours} hrs` : '—',
                      color: 'var(--accent)',
                    },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                      <span className="text-xs font-bold font-mono" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                  {selectedDay.record.remarks && (
                    <div className="p-2.5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                      <p className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Remarks</p>
                      <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>"{selectedDay.record.remarks}"</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>
                No attendance record for this day.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
