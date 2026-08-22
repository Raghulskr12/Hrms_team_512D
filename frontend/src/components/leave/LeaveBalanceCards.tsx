import React from 'react';
import { LeaveBalance } from '../../types';
import { Calendar, Stethoscope, Palmtree, GraduationCap, Heart, Clock } from 'lucide-react';

interface LeaveBalanceCardsProps {
  balances: LeaveBalance[];
}

export const LeaveBalanceCards: React.FC<LeaveBalanceCardsProps> = ({ balances }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'PAID': return Palmtree;
      case 'SICK': return Stethoscope;
      case 'CASUAL': return Calendar;
      case 'EXAM': return GraduationCap;
      case 'BEREAVEMENT': return Heart;
      default: return Clock;
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {balances.map((bal) => {
        const Icon = getIcon(bal.leaveType);
        const percent = bal.totalDays > 0 ? Math.round((bal.remainingDays / bal.totalDays) * 100) : 0;

        return (
          <div
            key={bal.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                {bal.leaveType}
              </span>
              <div className="p-1.5 bg-purple-950/60 text-purple-400 rounded-lg border border-purple-800/40">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="my-2">
              <div className="text-2xl font-bold text-slate-100 font-mono">
                {bal.remainingDays} <span className="text-xs text-slate-500 font-sans font-normal">/ {bal.totalDays} Days</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{bal.usedDays} days used</p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-850">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
