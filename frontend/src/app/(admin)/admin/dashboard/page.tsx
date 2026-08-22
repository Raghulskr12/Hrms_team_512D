'use client';

import React, { useState, useEffect } from 'react';
import { employeeService } from '../../../../services/employeeService';
import { attendanceService } from '../../../../services/attendanceService';
import { leaveService } from '../../../../services/leaveService';
import { LeaveRequest, Attendance } from '../../../../types';
import { Card } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { DonutChart, DonutLegend, Sparkline, BarChart, MetricCard } from '../../../../components/ui/StatsChart';
import { LeaveApprovalModal } from '../../../../components/leave/LeaveApprovalModal';
import {
  Users,
  UserCheck,
  UserX,
  CalendarDays,
  FileCheck,
  ArrowRight,
  Clock,
  Shield,
  TrendingUp,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

// Generate mock sparkline data for visual interest
const genSpark = (base: number, len = 7) =>
  Array.from({ length: len }, () => Math.max(0, base + Math.floor((Math.random() - 0.4) * base * 0.4)));

export default function AdminDashboardPage() {
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([]);
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const todayStr = new Date().toISOString().split('T')[0];
      const [empRes, attRes, leaveRes] = await Promise.all([
        employeeService.getAll({ limit: 1 }),
        attendanceService.getAll({ startDate: todayStr, endDate: todayStr }),
        leaveService.getAllRequests('PENDING'),
      ]);
      setTotalEmployees(empRes?.total || 0);
      setTodayAttendance(attRes || []);
      setPendingRequests(leaveRes || []);
    } catch (e) {
      console.error('Error loading admin dashboard metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  if (loading) return <LoadingSpinner message="Loading HR executive dashboard..." size="lg" />;

  const presentCount = todayAttendance.filter((a) => a.status === 'PRESENT' || a.status === 'HALF_DAY').length;
  const leaveCount = todayAttendance.filter((a) => a.status === 'LEAVE').length;
  const absentCount = Math.max(0, totalEmployees - presentCount - leaveCount);

  // Attendance donut slices
  const attendanceSlices = [
    { value: presentCount, color: '#10B981', label: 'Present' },
    { value: absentCount, color: '#F43F5E', label: 'Absent' },
    { value: leaveCount, color: '#0EA5E9', label: 'On Leave' },
  ].filter((s) => s.value >= 0);

  // Leave request bar data
  const leaveBarData = [
    { label: 'Pending', value: pendingRequests.length, color: '#F59E0B' },
    { label: 'Today', value: leaveCount, color: '#0EA5E9' },
    { label: 'Total', value: totalEmployees, color: '#6366F1' },
  ];

  const metrics = [
    {
      label: 'Total Employees',
      value: totalEmployees,
      icon: <Users className="w-4 h-4" />,
      color: '#6366F1',
      sparkData: genSpark(totalEmployees || 5),
      change: 'Active workforce',
    },
    {
      label: 'Present Today',
      value: presentCount,
      icon: <UserCheck className="w-4 h-4" />,
      color: '#10B981',
      sparkData: genSpark(presentCount || 2),
      change: totalEmployees > 0 ? `${Math.round((presentCount / totalEmployees) * 100)}% attendance rate` : 'No data',
      changePositive: true,
    },
    {
      label: 'Absent Today',
      value: absentCount,
      icon: <UserX className="w-4 h-4" />,
      color: '#F43F5E',
      sparkData: genSpark(absentCount || 1),
    },
    {
      label: 'On Leave',
      value: leaveCount,
      icon: <CalendarDays className="w-4 h-4" />,
      color: '#0EA5E9',
      sparkData: genSpark(leaveCount || 1),
    },
    {
      label: 'Pending Approvals',
      value: pendingRequests.length,
      icon: <FileCheck className="w-4 h-4" />,
      color: '#F59E0B',
      sparkData: genSpark(pendingRequests.length || 2),
      change: pendingRequests.length > 0 ? 'Requires attention' : 'All clear',
    },
  ];

  const adminLinks = [
    { href: '/admin/employees', icon: Users, label: 'Employee Directory', desc: 'Manage profiles & roles', color: '#6366F1' },
    { href: '/admin/attendance', icon: Clock, label: 'Attendance Hub', desc: 'View & correct records', color: '#10B981' },
    { href: '/admin/leave', icon: CalendarDays, label: 'Leave Approvals', desc: 'Review pending requests', color: '#0EA5E9' },
    { href: '/admin/payroll', icon: Activity, label: 'Payroll', desc: 'Compensation management', color: '#8B5CF6' },
    { href: '/admin/reports', icon: TrendingUp, label: 'Analytics', desc: 'HR reports & insights', color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ============================================================
          WELCOME BANNER
          ============================================================ */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F1629 0%, #131D36 100%)',
          border: '1px solid rgba(99,102,241,0.15)',
        }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
              }}
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#E8EDFF]">HR Executive Dashboard</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Real-time workforce monitoring — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/employees">
              <Button variant="primary" size="sm" className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Manage Employees
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                View Reports
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================
          KPI METRIC CARDS
          ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {metrics.map((m, i) => (
          <MetricCard
            key={i}
            label={m.label}
            value={m.value}
            icon={m.icon}
            color={m.color}
            sparkData={m.sparkData}
            change={m.change}
            changePositive={m.changePositive}
          />
        ))}
      </div>

      {/* ============================================================
          CHARTS ROW
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Donut */}
        <Card>
          <div className="flex items-center gap-2 mb-5" style={{ borderBottom: '1px solid rgba(30,45,74,0.6)', paddingBottom: '1rem' }}>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E8EDFF]">Today's Attendance</h3>
              <p className="text-[10px] text-[#64748B]">Real-time workforce status</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart
              slices={attendanceSlices}
              size={160}
              strokeWidth={18}
              centerValue={totalEmployees}
              centerLabel="total"
            />
            <div className="flex-1 w-full">
              <DonutLegend slices={attendanceSlices} total={totalEmployees} />
              {/* Attendance rate bar */}
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(30,45,74,0.5)' }}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-[#64748B]">Attendance Rate</span>
                  <span className="text-[10px] font-bold font-mono text-[#10B981]">
                    {totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(30,45,74,0.6)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: totalEmployees > 0 ? `${(presentCount / totalEmployees) * 100}%` : '0%',
                      background: 'linear-gradient(90deg, #10B981, #34D399)',
                      boxShadow: '0 0 8px rgba(16,185,129,0.4)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Leave Overview Bar Chart */}
        <Card>
          <div className="flex items-center gap-2 mb-5" style={{ borderBottom: '1px solid rgba(30,45,74,0.6)', paddingBottom: '1rem' }}>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E8EDFF]">Leave Overview</h3>
              <p className="text-[10px] text-[#64748B]">Pending & active requests</p>
            </div>
            <Link href="/admin/leave" className="ml-auto text-[10px] text-[#818CF8] flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <BarChart data={leaveBarData} height={120} showValues={true} className="mb-2" />

          <div className="grid grid-cols-3 gap-2 mt-3">
            {leaveBarData.map((d, i) => (
              <div
                key={i}
                className="text-center p-2.5 rounded-xl"
                style={{ background: 'rgba(15,22,41,0.6)', border: '1px solid rgba(30,45,74,0.5)' }}
              >
                <p className="text-lg font-black font-mono" style={{ color: d.color }}>{d.value}</p>
                <p className="text-[10px] text-[#64748B]">{d.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ============================================================
          PENDING APPROVALS + QUICK LINKS
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending leave requests */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid rgba(30,45,74,0.6)', paddingBottom: '1rem' }}>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#E8EDFF]">
                  Pending Leave Approvals
                  {pendingRequests.length > 0 && (
                    <span
                      className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
                    >
                      {pendingRequests.length}
                    </span>
                  )}
                </h3>
              </div>
            </div>
            <Link href="/admin/leave" className="text-[10px] text-[#818CF8] flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingRequests.length > 0 ? (
              pendingRequests.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3.5 rounded-xl transition-all group"
                  style={{
                    background: 'rgba(15,22,41,0.6)',
                    border: '1px solid rgba(30,45,74,0.7)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(30,45,74,0.7)'; }}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                    >
                      {req.employee?.firstName?.[0]}{req.employee?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#E8EDFF]">
                        {req.employee?.firstName} {req.employee?.lastName}
                      </p>
                      <p className="text-[10px] text-[#64748B] mt-0.5">
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold mr-1.5"
                          style={{ background: 'rgba(99,102,241,0.15)', color: '#818CF8' }}
                        >
                          {req.leaveType}
                        </span>
                        {req.numberOfDays} day{req.numberOfDays !== 1 ? 's' : ''} ·{' '}
                        {new Date(req.startDate).toLocaleDateString()} – {new Date(req.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="primary" size="xs" onClick={() => setSelectedRequest(req)}>
                    Review
                  </Button>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <FileCheck className="w-8 h-8 text-[#1E2D4A] mx-auto mb-3" />
                <p className="text-xs text-[#64748B]">No pending leave applications. All clear!</p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick navigation */}
        <Card>
          <div className="flex items-center gap-2 mb-4" style={{ borderBottom: '1px solid rgba(30,45,74,0.6)', paddingBottom: '1rem' }}>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-[#E8EDFF]">Quick Actions</h3>
          </div>

          <div className="space-y-2">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl transition-all group cursor-pointer"
                    style={{
                      background: 'rgba(15,22,41,0.6)',
                      border: '1px solid rgba(30,45,74,0.6)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${link.color}30`;
                      e.currentTarget.style.background = `${link.color}08`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(30,45,74,0.6)';
                      e.currentTarget.style.background = 'rgba(15,22,41,0.6)';
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${link.color}15`, border: `1px solid ${link.color}25` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: link.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#CBD5E1]">{link.label}</p>
                      <p className="text-[10px] text-[#64748B]">{link.desc}</p>
                    </div>
                    <ChevronRightIcon className="w-3 h-3 text-[#374151] group-hover:text-[#818CF8] transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Leave Approval Modal */}
      {selectedRequest && (
        <LeaveApprovalModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onRefresh={fetchDashboardData}
        />
      )}
    </div>
  );
}

// Inline chevron to avoid extra import
const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
