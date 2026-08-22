'use client';

import React, { useState, useEffect } from 'react';
import { employeeService } from '../../../../services/employeeService';
import { attendanceService } from '../../../../services/attendanceService';
import { leaveService } from '../../../../services/leaveService';
import { LeaveRequest, Attendance } from '../../../../types';
import { Card, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { LeaveApprovalModal } from '../../../../components/leave/LeaveApprovalModal';
import { Users, UserCheck, UserX, CalendarDays, FileCheck, ArrowRight, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

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

      setTotalEmployees(empRes.total || 0);
      setTodayAttendance(attRes || []);
      setPendingRequests(leaveRes || []);
    } catch (e) {
      console.error('Error loading admin dashboard metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading HR executive dashboard..." size="lg" />;
  }

  const presentCount = todayAttendance.filter((a) => a.status === 'PRESENT' || a.status === 'HALF_DAY').length;
  const leaveCount = todayAttendance.filter((a) => a.status === 'LEAVE').length;
  const absentCount = totalEmployees > 0 ? Math.max(0, totalEmployees - presentCount - leaveCount) : 0;

  const metricCards = [
    { label: 'Total Employees', value: totalEmployees, icon: Users, color: 'text-purple-400', bg: 'bg-purple-950/60 border-purple-800/40' },
    { label: 'Present Today', value: presentCount, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800/40' },
    { label: 'Absent Today', value: absentCount, icon: UserX, color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-800/40' },
    { label: 'On Leave', value: leaveCount, icon: CalendarDays, color: 'text-sky-400', bg: 'bg-sky-950/60 border-sky-800/40' },
    { label: 'Pending Leave Requests', value: pendingRequests.length, icon: FileCheck, color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-800/40' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-950 text-purple-400 rounded-xl border border-purple-800/50">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">HR Executive Portal</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time workforce operational monitoring and approvals.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/admin/employees">
              <Button variant="primary" size="sm">Manage Employees</Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Metrics Row matching wireframe */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {metricCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{c.label}</span>
                <div className={`p-1.5 rounded-lg border ${c.bg} ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <p className="text-2xl font-extrabold text-slate-100 font-mono">{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Leave Applications Needing Approval */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-purple-400" />
              <span>Pending Leave Approvals ({pendingRequests.length})</span>
            </CardTitle>
            <Link href="/admin/leave" className="text-xs text-purple-400 hover:underline">
              View All
            </Link>
          </CardHeader>

          {pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {pendingRequests.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-100">
                      {req.employee?.firstName} {req.employee?.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {req.leaveType} Leave • {req.numberOfDays} Day(s) ({new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()})
                    </p>
                    <p className="text-[11px] text-slate-500 italic mt-1 max-w-md truncate">"{req.reason}"</p>
                  </div>

                  <Button variant="primary" size="sm" onClick={() => setSelectedRequest(req)}>
                    Review
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No pending leave applications requiring approval.</p>
          )}
        </Card>

        {/* Quick Admin Navigation */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Quick Administrative Links</span>
            </CardTitle>
          </CardHeader>

          <div className="space-y-2.5">
            <Link href="/admin/employees" className="block p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 hover:border-purple-500/40">
              👥 Employee Directory & Profiles
            </Link>
            <Link href="/admin/attendance" className="block p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 hover:border-purple-500/40">
              📊 Master Attendance Hub
            </Link>
            <Link href="/admin/leave" className="block p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 hover:border-purple-500/40">
              ✅ Leave Request Approvals
            </Link>
            <Link href="/admin/payroll" className="block p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 hover:border-purple-500/40">
              💳 Payroll & Compensation Management
            </Link>
            <Link href="/admin/reports" className="block p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 hover:border-purple-500/40">
              📈 HR Analytics & Operational Reports
            </Link>
          </div>
        </Card>
      </div>

      {/* Review Modal */}
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
