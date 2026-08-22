'use client';

import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../../services/attendanceService';
import { Attendance } from '../../../types';
import { CheckInWidget } from '../../../components/attendance/CheckInWidget';
import { AttendanceCalendar } from '../../../components/attendance/AttendanceCalendar';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ProgressBar } from '../../../components/ui/StatsChart';
import { Clock, AlertCircle, CalendarDays, TrendingUp } from 'lucide-react';

export default function EmployeeAttendancePage() {
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

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
      console.error('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Summary stats
  const presentDays  = history.filter((r) => r.status === 'PRESENT').length;
  const absentDays   = history.filter((r) => r.status === 'ABSENT').length;
  const leaveDays    = history.filter((r) => r.status === 'LEAVE').length;
  const halfDays     = history.filter((r) => r.status === 'HALF_DAY').length;
  const totalLogged  = history.length;
  const attendancePct = totalLogged > 0 ? Math.round((presentDays / totalLogged) * 100) : 0;

  const statCards = [
    { label: 'Present',  value: presentDays,  color: 'var(--success)',  bg: 'rgba(16,185,129,0.1)' },
    { label: 'Absent',   value: absentDays,   color: 'var(--danger)',   bg: 'rgba(244,63,94,0.1)' },
    { label: 'On Leave', value: leaveDays,    color: 'var(--violet)',   bg: 'rgba(139,92,246,0.1)' },
    { label: 'Half Day', value: halfDays,     color: 'var(--warning)',  bg: 'rgba(245,158,11,0.1)' },
  ];

  if (loading) return <LoadingSpinner message="Loading attendance..." size="lg"/>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)', boxShadow: '0 0 16px var(--accent-glow)' }}>
            <Clock className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>My Attendance</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Track your daily work hours and history</p>
          </div>
        </div>
        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setView('calendar')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            style={view === 'calendar'
              ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 0 10px var(--accent-glow)' }
              : { color: 'var(--text-muted)', background: 'transparent' }}
          >
            <CalendarDays className="w-3.5 h-3.5 inline mr-1"/>Calendar
          </button>
          <button
            onClick={() => setView('list')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            style={view === 'list'
              ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 0 10px var(--accent-glow)' }
              : { color: 'var(--text-muted)', background: 'transparent' }}
          >
            <TrendingUp className="w-3.5 h-3.5 inline mr-1"/>Log
          </button>
        </div>
      </div>

      {/* Check-in Widget */}
      <CheckInWidget todayAttendance={todayAttendance} onRefresh={fetchData}/>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <Card key={i} className="text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
              style={{ background: s.bg }}>
              <span className="text-xl font-black font-mono" style={{ color: s.color }}>{s.value}</span>
            </div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Attendance Rate */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Overall Attendance Rate</span>
          <span className="text-sm font-black font-mono" style={{ color: 'var(--success)' }}>{attendancePct}%</span>
        </div>
        <ProgressBar value={presentDays} max={totalLogged || 1} color="var(--success)" height={8}/>
        <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
          {presentDays} present out of {totalLogged} recorded days
        </p>
      </Card>

      {/* Calendar / List View */}
      {view === 'calendar' ? (
        <AttendanceCalendar records={history} className="w-full"/>
      ) : (
        <Card>
          <div className="flex items-center gap-2 mb-4"
            style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent)' }}/>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Attendance Log</h3>
          </div>

          {history.length > 0 ? (
            <div className="space-y-2">
              {history.map((rec) => {
                const checkIn  = rec.checkIn  ? new Date(rec.checkIn).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : '—';
                const checkOut = rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : '—';
                const statusColor = rec.status === 'PRESENT' ? 'var(--success)'
                  : rec.status === 'ABSENT' ? 'var(--danger)'
                  : rec.status === 'HALF_DAY' ? 'var(--warning)'
                  : 'var(--violet)';

                return (
                  <div key={rec.id}
                    className="flex items-center justify-between p-3 rounded-xl transition-all"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-glow)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}/>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {new Date(rec.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}
                        </p>
                        <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {checkIn} → {checkOut}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {rec.workedHours != null && (
                        <span className="text-xs font-bold font-mono" style={{ color: 'var(--accent)' }}>
                          {rec.workedHours}h
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}30` }}>
                        {rec.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Clock className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--border)' }}/>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No records yet</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>Clock in to start tracking</p>
            </div>
          )}
        </Card>
      )}

      {/* Info note */}
      <div className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }}/>
        <div>
          <p className="text-xs font-bold" style={{ color: 'var(--warning)' }}>Reminder</p>
          <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Please check in and out promptly to accurately record your working hours.
            Overtime requires manager approval. Contact HR for any attendance discrepancies.
          </p>
        </div>
      </div>
    </div>
  );
}
