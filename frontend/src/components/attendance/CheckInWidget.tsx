'use client';

import React, { useState, useEffect } from 'react';
import { Attendance } from '../../types';
import { attendanceService } from '../../services/attendanceService';
import { LogIn, LogOut, Clock, CheckCircle2 } from 'lucide-react';

interface CheckInWidgetProps {
  todayAttendance: Attendance | null;
  onRefresh: () => void;
}

export const CheckInWidget: React.FC<CheckInWidgetProps> = ({ todayAttendance, onRefresh }) => {
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [loadingIn, setLoadingIn] = useState(false);
  const [loadingOut, setLoadingOut] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
      setSeconds(now.getSeconds());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleCheckIn = async () => {
    try { setLoadingIn(true); setError(''); await attendanceService.checkIn(remarks); setRemarks(''); onRefresh(); }
    catch (e: any) { setError(e.message || 'Check-in failed.'); }
    finally { setLoadingIn(false); }
  };

  const handleCheckOut = async () => {
    try { setLoadingOut(true); setError(''); await attendanceService.checkOut(remarks); setRemarks(''); onRefresh(); }
    catch (e: any) { setError(e.message || 'Check-out failed.'); }
    finally { setLoadingOut(false); }
  };

  const isCheckedIn  = !!todayAttendance?.checkIn;
  const isCheckedOut = !!todayAttendance?.checkOut;

  const statusCfg = isCheckedOut
    ? { label: 'Shift Complete', color: 'var(--violet)',  glow: 'rgba(139,92,246,0.6)'  }
    : isCheckedIn
    ? { label: 'Clocked In',     color: 'var(--success)', glow: 'rgba(16,185,129,0.6)'  }
    : { label: 'Not Clocked In', color: 'var(--warning)', glow: 'rgba(245,158,11,0.4)'  };

  // Seconds ring
  const ringSize = 56, ringStroke = 3;
  const r = (ringSize - ringStroke) / 2;
  const circ = 2 * Math.PI * r;
  const secProgress = (seconds / 60) * circ;

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', filter: 'blur(30px)' }}/>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          {/* Left: clock */}
          <div className="flex items-center gap-4">
            {/* Seconds ring */}
            <div className="relative flex-shrink-0">
              <svg width={ringSize} height={ringSize} className="rotate-[-90deg]">
                <circle cx={ringSize/2} cy={ringSize/2} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth={ringStroke}/>
                <circle cx={ringSize/2} cy={ringSize/2} r={r} fill="none" stroke="var(--accent)" strokeWidth={ringStroke}
                  strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - secProgress}
                  style={{ transition: 'stroke-dashoffset 0.3s ease', filter: 'drop-shadow(0 0 4px var(--accent))' }}/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-5 h-5" style={{ color: 'var(--accent)' }}/>
              </div>
            </div>

            {/* Time + date */}
            <div>
              <div className="text-3xl font-black font-mono leading-none mb-1 gradient-brand-text">
                {time || '--:--:--'}
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{dateStr}</p>
              {isCheckedIn && todayAttendance?.checkIn && (
                <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--accent)' }}>
                  Clocked in at {new Date(todayAttendance.checkIn).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                </p>
              )}
            </div>
          </div>

          {/* Right: status + hours */}
          <div className="flex items-center gap-3">
            {isCheckedOut && todayAttendance?.workedHours && (
              <div className="px-3 py-2 rounded-xl text-center"
                style={{ background: 'var(--accent-glow-sm)', border: '1px solid var(--border)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Worked</p>
                <p className="text-sm font-black font-mono" style={{ color: 'var(--violet)' }}>{todayAttendance.workedHours}h</p>
              </div>
            )}
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: 'var(--bg-elevated)', border: `1px solid ${statusCfg.color}30` }}>
              <div className="w-2.5 h-2.5 rounded-full"
                style={{ background: statusCfg.color, boxShadow: `0 0 8px ${statusCfg.glow}`,
                  animation: isCheckedIn && !isCheckedOut ? 'dotPulse 2s ease-in-out infinite' : undefined }}/>
              <span className="text-xs font-bold" style={{ color: statusCfg.color }}>{statusCfg.label}</span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl text-xs font-medium"
            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: 'var(--danger)' }}>
            ⚠ {error}
          </div>
        )}

        {/* Action row */}
        <div className="mt-5 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          style={{ borderTop: '1px solid var(--border)' }}>
          <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional remarks (e.g. Working remotely)"
            disabled={isCheckedOut}
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl transition-all focus:outline-none"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow-sm)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />

          {!isCheckedIn ? (
            <button onClick={handleCheckIn} disabled={loadingIn}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)', boxShadow: '0 4px 15px var(--accent-glow)' }}>
              {loadingIn ? <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <LogIn className="w-3.5 h-3.5"/>}
              Clock In
            </button>
          ) : !isCheckedOut ? (
            <button onClick={handleCheckOut} disabled={loadingOut}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,var(--danger),#E11D48)', boxShadow: '0 4px 15px rgba(244,63,94,0.35)' }}>
              {loadingOut ? <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <LogOut className="w-3.5 h-3.5"/>}
              Clock Out
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: 'var(--success)' }}>
              <CheckCircle2 className="w-4 h-4"/>
              Shift complete · {todayAttendance?.workedHours || 0} hrs logged
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
