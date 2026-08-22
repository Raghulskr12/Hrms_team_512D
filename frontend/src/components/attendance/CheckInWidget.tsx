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
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [loadingCheckIn, setLoadingCheckIn] = useState<boolean>(false);
  const [loadingCheckOut, setLoadingCheckOut] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
      setSeconds(now.getSeconds());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    try {
      setLoadingCheckIn(true);
      setErrorMsg('');
      await attendanceService.checkIn(remarks);
      setRemarks('');
      onRefresh();
    } catch (e: any) {
      setErrorMsg(e.message || 'Check-in failed. Please try again.');
    } finally {
      setLoadingCheckIn(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoadingCheckOut(true);
      setErrorMsg('');
      await attendanceService.checkOut(remarks);
      setRemarks('');
      onRefresh();
    } catch (e: any) {
      setErrorMsg(e.message || 'Check-out failed. Please try again.');
    } finally {
      setLoadingCheckOut(false);
    }
  };

  const isCheckedIn = !!todayAttendance?.checkIn;
  const isCheckedOut = !!todayAttendance?.checkOut;

  // Determine status
  const statusConfig = isCheckedOut
    ? { label: 'Shift Complete', color: '#8B5CF6', glow: 'rgba(139,92,246,0.6)', bg: 'rgba(139,92,246,0.1)' }
    : isCheckedIn
    ? { label: 'Clocked In', color: '#10B981', glow: 'rgba(16,185,129,0.6)', bg: 'rgba(16,185,129,0.1)' }
    : { label: 'Not Clocked In', color: '#F59E0B', glow: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.08)' };

  // Progress ring for clock seconds
  const ringSize = 56;
  const ringStroke = 3;
  const r = (ringSize - ringStroke) / 2;
  const circumference = 2 * Math.PI * r;
  const secProgress = (seconds / 60) * circumference;

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0D1526 0%, #0F1E3A 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        boxShadow: '0 0 40px rgba(99,102,241,0.05)',
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          {/* Left: Clock display */}
          <div className="flex items-center gap-4">
            {/* Animated clock ring */}
            <div className="relative flex-shrink-0">
              <svg width={ringSize} height={ringSize} className="rotate-[-90deg]">
                {/* Background ring */}
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={r}
                  fill="none"
                  stroke="rgba(30, 45, 74, 0.8)"
                  strokeWidth={ringStroke}
                />
                {/* Progress ring */}
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={r}
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth={ringStroke}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - secProgress}
                  style={{ transition: 'stroke-dashoffset 0.3s ease', filter: 'drop-shadow(0 0 4px rgba(99,102,241,0.8))' }}
                />
              </svg>
              {/* Clock icon in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-400" />
              </div>
            </div>

            {/* Time display */}
            <div>
              <div
                className="text-3xl font-black font-mono leading-none mb-1"
                style={{
                  background: 'linear-gradient(135deg, #E8EDFF, #818CF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {time || '--:--:--'}
              </div>
              <p className="text-xs text-[#64748B]">{dateStr}</p>
              {/* Check-in time indicator */}
              {isCheckedIn && todayAttendance?.checkIn && (
                <p className="text-[10px] text-indigo-400 mt-0.5 font-mono">
                  Clocked in at {new Date(todayAttendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>

          {/* Right: Status badge + worked hours */}
          <div className="flex items-center gap-3">
            {isCheckedOut && todayAttendance?.workedHours && (
              <div
                className="px-3 py-2 rounded-xl text-center"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                <p className="text-[10px] text-[#94A3B8] mb-0.5">Worked</p>
                <p className="text-sm font-black font-mono text-[#8B5CF6]">{todayAttendance.workedHours}h</p>
              </div>
            )}

            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{ background: statusConfig.bg, border: `1px solid ${statusConfig.color}30` }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  background: statusConfig.color,
                  boxShadow: `0 0 8px ${statusConfig.glow}`,
                  animation: isCheckedIn && !isCheckedOut ? 'dotPulse 2s ease-in-out infinite' : undefined,
                }}
              />
              <span className="text-xs font-bold" style={{ color: statusConfig.color }}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div
            className="mt-4 p-3 rounded-xl text-xs font-medium"
            style={{
              background: 'rgba(244,63,94,0.08)',
              border: '1px solid rgba(244,63,94,0.2)',
              color: '#FB7185',
            }}
          >
            ⚠ {errorMsg}
          </div>
        )}

        {/* Action row */}
        <div
          className="mt-5 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          style={{ borderTop: '1px solid rgba(30, 45, 74, 0.6)' }}
        >
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional remarks (e.g., Working remotely)"
            className="flex-1 px-3.5 py-2.5 text-xs text-[#CBD5E1] placeholder-[#374151] rounded-xl transition-all focus:outline-none"
            style={{
              background: 'rgba(15,22,41,0.8)',
              border: '1px solid rgba(30,45,74,0.8)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(30,45,74,0.8)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            disabled={isCheckedOut}
          />

          <div className="flex items-center gap-2">
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                disabled={loadingCheckIn}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
                }}
              >
                {loadingCheckIn ? (
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <LogIn className="w-3.5 h-3.5" />
                )}
                Clock In
              </button>
            ) : !isCheckedOut ? (
              <button
                onClick={handleCheckOut}
                disabled={loadingCheckOut}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #F43F5E, #E11D48)',
                  boxShadow: '0 4px 15px rgba(244,63,94,0.35)',
                }}
              >
                {loadingCheckOut ? (
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <LogOut className="w-3.5 h-3.5" />
                )}
                Clock Out
              </button>
            ) : (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
                style={{
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  color: '#10B981',
                }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Shift complete · {todayAttendance?.workedHours || 0} hrs logged
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
