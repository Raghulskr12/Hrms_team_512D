'use client';

import React, { useState, useEffect } from 'react';
import { reportService } from '../../../../services/reportService';
import { Card, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { BarChart3, Users, Calendar, CreditCard, PieChart } from 'lucide-react';

export default function AdminReportsPage() {
  const [attReport, setAttReport] = useState<any>(null);
  const [leaveReport, setLeaveReport] = useState<any>(null);
  const [payrollReport, setPayrollReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [att, leave, pay] = await Promise.all([
        reportService.getAttendanceReport(),
        reportService.getLeaveReport(),
        reportService.getPayrollReport(),
      ]);

      setAttReport(att);
      setLeaveReport(leave);
      setPayrollReport(pay);
    } catch (e) {
      console.error('Error loading reports:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Generating HR analytics & reports..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <span>HR Operations & Analytics Reports</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Aggregated reports for workforce attendance, leave utilization, and payroll finances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Summary Report Card */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Workforce Attendance Metrics</span>
            </CardTitle>
          </CardHeader>

          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Total Employees</span>
              <span className="font-bold text-slate-100">{attReport?.totalEmployees || 0}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Present Logs</span>
              <span className="font-bold text-emerald-400">{attReport?.present || 0}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Absent Logs</span>
              <span className="font-bold text-rose-400">{attReport?.absent || 0}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Half Days</span>
              <span className="font-bold text-amber-400">{attReport?.halfDay || 0}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Leave Days</span>
              <span className="font-bold text-purple-400">{attReport?.leave || 0}</span>
            </div>
          </div>
        </Card>

        {/* Leave Requests Report Card */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Leave Application Distribution</span>
            </CardTitle>
          </CardHeader>

          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Total Applications</span>
              <span className="font-bold text-slate-100">{leaveReport?.totalRequests || 0}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Pending Approvals</span>
              <span className="font-bold text-amber-400">{leaveReport?.pending || 0}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Approved Applications</span>
              <span className="font-bold text-emerald-400">{leaveReport?.approved || 0}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Rejected Applications</span>
              <span className="font-bold text-rose-400">{leaveReport?.rejected || 0}</span>
            </div>
          </div>
        </Card>

        {/* Payroll Financial Summary Card */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Aggregate Payroll Financials</span>
            </CardTitle>
          </CardHeader>

          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Employees on Payroll</span>
              <span className="font-bold text-slate-100">{payrollReport?.employeeCount || 0}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Total Monthly Gross</span>
              <span className="font-bold text-slate-100">${(payrollReport?.totalGrossSalary || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Total Monthly Net</span>
              <span className="font-bold text-purple-400">${(payrollReport?.totalNetSalary || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 font-sans text-xs">Average Take-Home Salary</span>
              <span className="font-bold text-emerald-400">${(payrollReport?.averageNetSalary || 0).toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
