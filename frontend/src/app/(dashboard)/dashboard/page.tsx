'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { profileService } from '../../../services/profileService';
import { attendanceService } from '../../../services/attendanceService';
import { leaveService } from '../../../services/leaveService';
import { notificationService } from '../../../services/notificationService';
import { EmployeeProfile, Attendance, LeaveBalance, Notification } from '../../../types';
import { CheckInWidget } from '../../../components/attendance/CheckInWidget';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { DonutChart, DonutLegend, ProgressBar } from '../../../components/ui/StatsChart';
import { Calendar, Bell, ArrowRight, Clock, FileText, Wallet, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profData, todayAtt, balData, notifData] = await Promise.all([
        profileService.getProfile(),
        attendanceService.getToday(),
        leaveService.getBalances(),
        notificationService.getAll(),
      ]);
      setProfile(profData || null);
      setTodayAttendance(todayAtt || null);
      setBalances(balData || []);
      setNotifications((notifData || []).slice(0, 5));
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (loading) return <LoadingSpinner message="Loading your workspace..." size="lg" />;

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : user?.email || 'Employee';
  const initials = profile
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`
    : (user?.email?.[0] || 'U').toUpperCase();

  // Build leave donut chart data
  const leaveDonutSlices = balances.slice(0, 4).map((b, i) => {
    const colors = ['#6366F1', '#0EA5E9', '#10B981', '#F59E0B'];
    return {
      value: b.remainingDays,
      color: colors[i % colors.length],
      label: b.leaveType,
    };
  });
  const totalLeaveRemaining = leaveDonutSlices.reduce((s, b) => s + b.value, 0);

  const quickLinks = [
    { href: '/attendance', icon: Clock, label: 'Attendance', desc: 'View calendar', color: '#6366F1' },
    { href: '/leave', icon: Calendar, label: 'Apply Leave', desc: 'Request time off', color: '#0EA5E9' },
    { href: '/salary', icon: Wallet, label: 'Salary', desc: 'View payslip', color: '#10B981' },
    { href: '/profile', icon: FileText, label: 'Documents', desc: 'Manage files', color: '#F59E0B' },
  ];

  const getHourOfDay = () => new Date().getHours();
  const greeting =
    getHourOfDay() < 12 ? 'Good morning' : getHourOfDay() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ============================================================
          HERO WELCOME BANNER
          ============================================================ */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F1629 0%, #131D36 60%, rgba(99,102,241,0.08) 100%)',
          border: '1px solid rgba(99,102,241,0.15)',
        }}
      >
        {/* Background glow */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-xl"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
              >
                {initials}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: '#0A0E1A', background: '#10B981', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }}
              />
            </div>

            <div>
              <p className="text-xs text-[#6366F1] font-semibold mb-0.5">{greeting} 👋</p>
              <h2 className="text-xl font-bold text-[#E8EDFF]">{fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#64748B]">
                  {profile?.designation && <>{profile.designation} · </>}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #818CF8, #38BDF8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {profile?.department}
                  </span>
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  {user?.status || 'ACTIVE'}
                </span>
              </div>
              <p className="text-[11px] text-[#374151] font-mono mt-1">{user?.employeeId}</p>
            </div>
          </div>

          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:-translate-y-0.5"
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#818CF8',
            }}
          >
            View Full Profile
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ============================================================
          CHECK-IN WIDGET
          ============================================================ */}
      <CheckInWidget todayAttendance={todayAttendance} onRefresh={fetchDashboardData} />

      {/* ============================================================
          QUICK LINKS GRID
          ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <div
                className="p-4 rounded-2xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 group"
                style={{
                  background: 'rgba(15, 22, 41, 0.8)',
                  border: '1px solid rgba(30, 45, 74, 0.7)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${link.color}30`;
                  e.currentTarget.style.boxShadow = `0 8px 20px ${link.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(30, 45, 74, 0.7)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `${link.color}15`, border: `1px solid ${link.color}25` }}
                >
                  <Icon className="w-4 h-4" style={{ color: link.color }} />
                </div>
                <p className="text-xs font-bold text-[#E8EDFF]">{link.label}</p>
                <p className="text-[10px] text-[#64748B] mt-0.5">{link.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ============================================================
          LEAVE BALANCES + CHART
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <Card className="flex flex-col items-center justify-center p-6">
          <div className="flex items-center justify-between w-full mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#E8EDFF]">Leave Balances</h3>
              <p className="text-[10px] text-[#64748B] mt-0.5">Remaining days overview</p>
            </div>
            <Link href="/leave" className="text-[10px] text-[#818CF8] hover:text-[#A5B4FC] flex items-center gap-1 transition-colors">
              Apply <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {leaveDonutSlices.length > 0 ? (
            <div className="flex flex-col items-center gap-5 w-full">
              <DonutChart
                slices={leaveDonutSlices}
                size={140}
                strokeWidth={16}
                centerValue={totalLeaveRemaining}
                centerLabel="days left"
              />
              <div className="w-full">
                <DonutLegend slices={leaveDonutSlices} total={totalLeaveRemaining} />
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#64748B] py-8 text-center">No leave balances found.</p>
          )}
        </Card>

        {/* Leave progress cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {balances.slice(0, 4).map((b, i) => {
            const colors = ['#6366F1', '#0EA5E9', '#10B981', '#F59E0B'];
            const color = colors[i % colors.length];
            const pct = b.totalDays > 0 ? Math.round((b.usedDays / b.totalDays) * 100) : 0;
            return (
              <div
                key={b.id}
                className="p-4 rounded-2xl"
                style={{ background: 'rgba(15, 22, 41, 0.8)', border: '1px solid rgba(30, 45, 74, 0.7)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">{b.leaveType}</p>
                    <p className="text-2xl font-black text-[#E8EDFF] font-mono mt-1">{b.remainingDays}</p>
                    <p className="text-[10px] text-[#64748B]">of {b.totalDays} days left</p>
                  </div>
                  <div
                    className="px-2 py-1 rounded-lg text-[10px] font-bold"
                    style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                  >
                    {pct}% used
                  </div>
                </div>
                <ProgressBar value={b.usedDays} max={b.totalDays} color={color} height={5} />
              </div>
            );
          })}
          {balances.length === 0 && (
            <div className="sm:col-span-2 flex items-center justify-center py-8">
              <p className="text-xs text-[#64748B]">No leave balances configured.</p>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          NOTIFICATIONS FEED
          ============================================================ */}
      <Card>
        <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid rgba(30, 45, 74, 0.6)', paddingBottom: '1rem' }}>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E8EDFF]">Recent Activity</h3>
            </div>
          </div>
          <Link href="/notifications" className="text-[10px] text-[#818CF8] hover:text-[#A5B4FC] flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-3 p-3.5 rounded-xl transition-all"
                style={{
                  background: notif.isRead ? 'rgba(15, 22, 41, 0.4)' : 'rgba(99,102,241,0.05)',
                  border: notif.isRead ? '1px solid rgba(30, 45, 74, 0.4)' : '1px solid rgba(99,102,241,0.15)',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{
                    background: notif.isRead ? '#374151' : '#6366F1',
                    boxShadow: notif.isRead ? 'none' : '0 0 6px rgba(99,102,241,0.6)',
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#CBD5E1] truncate">{notif.title}</p>
                    <span className="text-[10px] text-[#374151] font-mono flex-shrink-0">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center">
              <Bell className="w-8 h-8 text-[#1E2D4A] mx-auto mb-3" />
              <p className="text-xs text-[#64748B]">No recent notifications.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
