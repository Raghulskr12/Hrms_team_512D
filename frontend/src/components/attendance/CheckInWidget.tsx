'use client';

import React, { useState, useEffect } from 'react';
import { Attendance } from '../../types';
import { attendanceService } from '../../services/attendanceService';
import { Button } from '../ui/Button';
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

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
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
      setErrorMsg(e.message || 'Check-in failed');
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
      setErrorMsg(e.message || 'Check-out failed');
    } finally {
      setLoadingCheckOut(false);
    }
  };

  const isCheckedIn = !!todayAttendance?.checkIn;
  const isCheckedOut = !!todayAttendance?.checkOut;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 shadow-md relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 tracking-wider uppercase mb-1">
            <Clock className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Real-time Attendance Punch</span>
          </div>
          <div className="text-3xl font-bold font-mono text-slate-100 tracking-tight">{time || '--:--:--'}</div>
          <p className="text-xs text-slate-400 mt-1">{dateStr}</p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2.5 rounded-lg border border-slate-800">
          <div className="text-right">
            <p className="text-[11px] text-slate-500 uppercase font-medium">Today's Status</p>
            <p className="text-xs font-semibold text-slate-200 mt-0.5">
              {todayAttendance?.status || 'NOT CHECKED IN'}
            </p>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${
              isCheckedOut
                ? 'bg-purple-500 shadow-sm shadow-purple-500'
                : isCheckedIn
                ? 'bg-emerald-500 shadow-sm shadow-emerald-500 animate-ping'
                : 'bg-amber-500'
            }`}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 p-2.5 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Action Punch Area */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <input
          type="text"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Optional remarks (e.g., Working remotely)"
          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          disabled={isCheckedOut}
        />

        <div className="flex items-center space-x-3">
          {!isCheckedIn ? (
            <Button
              variant="primary"
              onClick={handleCheckIn}
              isLoading={loadingCheckIn}
              className="w-full sm:w-auto"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Clock In
            </Button>
          ) : !isCheckedOut ? (
            <Button
              variant="danger"
              onClick={handleCheckOut}
              isLoading={loadingCheckOut}
              className="w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Clock Out
            </Button>
          ) : (
            <div className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-4 py-2 rounded-lg border border-emerald-800/50">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Shift Completed ({todayAttendance?.workedHours || 0} hrs)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
