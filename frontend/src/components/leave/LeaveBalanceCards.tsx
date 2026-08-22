import React from 'react';
import { LeaveBalance } from '../../types';
import { Calendar, Stethoscope, Palmtree, GraduationCap, Heart, Clock } from 'lucide-react';
import { ProgressBar } from '../ui/StatsChart';

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

  const colors = ['var(--accent)', 'var(--info)', 'var(--success)', 'var(--warning)', 'var(--violet)'];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {balances.map((bal, i) => {
        const Icon = getIcon(bal.leaveType);
        const color = colors[i % colors.length];

        return (
          <div
            key={bal.id}
            className="rounded-2xl p-4 flex flex-col justify-between transition-all hover-lift"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                {bal.leaveType}
              </span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="my-2">
              <div className="text-xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                {bal.remainingDays} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>/ {bal.totalDays} Days</span>
              </div>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{bal.usedDays} days used</p>
            </div>

            <ProgressBar value={bal.remainingDays} max={bal.totalDays || 1} color={color} height={4} />
          </div>
        );
      })}
    </div>
  );
};
