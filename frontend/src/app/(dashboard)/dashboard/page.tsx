'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { profileService } from '../../../services/profileService';
import { attendanceService } from '../../../services/attendanceService';
import { leaveService } from '../../../services/leaveService';
import { notificationService } from '../../../services/notificationService';
import { EmployeeProfile, Attendance, LeaveBalance, Notification } from '../../../types';
import { CheckInWidget } from '../../../components/attendance/CheckInWidget';
import { LeaveBalanceCards } from '../../../components/leave/LeaveBalanceCards';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Calendar, Bell, ShieldCheck, ArrowRight } from 'lucide-react';
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

      setProfile(profData);
      setTodayAttendance(todayAtt);
      setBalances(balData || []);
      setNotifications((notifData || []).slice(0, 5));
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading employee dashboard..." size="lg" />;
  }

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : user?.email || 'Employee';

  return (
    <div className="space-y-6">
      {/* Top Banner / Profile Summary Card */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Avatar name={fullName} src={profile?.profilePicture} size="xl" />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-100">{fullName}</h2>
                <Badge variant={user?.status === 'ACTIVE' ? 'success' : 'neutral'}>
                  {user?.status || 'ACTIVE'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {profile?.designation} • <strong className="text-purple-400">{profile?.department}</strong>
              </p>
              <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono mt-2">
                <span>ID: {user?.employeeId}</span>
                <span>•</span>
                <span>Joining: {profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          <Link href="/profile">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg border border-slate-700 transition-colors">
              View Full Profile →
            </button>
          </Link>
        </div>
      </Card>

      {/* Attendance Clock In / Clock Out Widget */}
      <CheckInWidget
        todayAttendance={todayAttendance}
        onRefresh={fetchDashboardData}
      />

      {/* Leave Balances Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-100 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Leave Balances</span>
          </h3>
          <Link href="/leave" className="text-xs text-purple-400 hover:underline flex items-center">
            Apply Leave / View Tracker <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
        <LeaveBalanceCards balances={balances} />
      </div>

      {/* Two Column Grid: Notifications Feed & Quick Action Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notifications Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Bell className="w-4 h-4 text-purple-400" />
              <span>Recent Activity & System Alerts</span>
            </CardTitle>
            <Link href="/notifications" className="text-xs text-purple-400 hover:underline">
              View All
            </Link>
          </CardHeader>

          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-lg border text-xs transition-all ${
                    !notif.isRead
                      ? 'bg-slate-950 border-purple-900/60'
                      : 'bg-slate-950/40 border-slate-850 opacity-80'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="font-semibold text-slate-200">{notif.title}</h5>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-400">{notif.message}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No recent notifications.</p>
            )}
          </div>
        </Card>

        {/* Quick Links & Information */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Employee Portal Tools</span>
            </CardTitle>
          </CardHeader>

          <div className="space-y-2">
            <Link
              href="/attendance"
              className="block p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-colors text-xs font-medium text-slate-200"
            >
              🗓️ View Attendance Calendar
            </Link>
            <Link
              href="/leave"
              className="block p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-colors text-xs font-medium text-slate-200"
            >
              📝 Apply for Leave
            </Link>
            <Link
              href="/salary"
              className="block p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-colors text-xs font-medium text-slate-200"
            >
              💰 View Salary Structure
            </Link>
            <Link
              href="/profile"
              className="block p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-colors text-xs font-medium text-slate-200"
            >
              📁 Manage Documents
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
