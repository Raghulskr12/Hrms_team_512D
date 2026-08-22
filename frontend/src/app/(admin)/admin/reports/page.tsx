'use client';

import React, { useState, useEffect } from 'react';
import { reportService } from '../../../../services/reportService';
import { Card } from '../../../../components/ui/Card';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { DonutChart, DonutLegend, BarChart, ProgressBar } from '../../../../components/ui/StatsChart';
import {
  BarChart3,
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

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

  useEffect(() => { fetchReports(); }, []);

  if (loading) return <LoadingSpinner message="Generating analytics reports..." size="lg" />;

  // Attendance donut
  const attSlices = [
    { value: attReport?.present || 0, color: '#10B981', label: 'Present' },
    { value: attReport?.absent || 0, color: '#F43F5E', label: 'Absent' },
    { value: attReport?.halfDay || 0, color: '#F59E0B', label: 'Half Day' },
    { value: attReport?.leave || 0, color: '#6366F1', label: 'On Leave' },
  ].filter((s) => s.value > 0);
  const attTotal = attSlices.reduce((s, sl) => s + sl.value, 0);

  // Leave donut
  const leaveSlices = [
    { value: leaveReport?.approved || 0, color: '#10B981', label: 'Approved' },
    { value: leaveReport?.pending || 0, color: '#F59E0B', label: 'Pending' },
    { value: leaveReport?.rejected || 0, color: '#F43F5E', label: 'Rejected' },
  ].filter((s) => s.value >= 0);
  const leaveTotal = leaveReport?.totalRequests || 0;

  // Payroll metrics
  const payrollMetrics = [
    {
      label: 'Employees on Payroll',
      value: payrollReport?.employeeCount || 0,
      color: '#6366F1',
      icon: Users,
      suffix: '',
    },
    {
      label: 'Total Monthly Gross',
      value: (payrollReport?.totalGrossSalary || 0).toLocaleString(),
      color: '#0EA5E9',
      icon: TrendingUp,
      prefix: '₹',
    },
    {
      label: 'Total Monthly Net',
      value: (payrollReport?.totalNetSalary || 0).toLocaleString(),
      color: '#10B981',
      icon: CreditCard,
      prefix: '₹',
    },
    {
      label: 'Average Net Salary',
      value: (payrollReport?.averageNetSalary || 0).toLocaleString(),
      color: '#8B5CF6',
      icon: BarChart3,
      prefix: '₹',
    },
  ];

  // Attendance bar chart data (by status)
  const attBarData = [
    { label: 'Present', value: attReport?.present || 0, color: '#10B981' },
    { label: 'Absent', value: attReport?.absent || 0, color: '#F43F5E' },
    { label: 'Half', value: attReport?.halfDay || 0, color: '#F59E0B' },
    { label: 'Leave', value: attReport?.leave || 0, color: '#6366F1' },
  ];

  // Leave bar chart data
  const leaveBarData = [
    { label: 'Approved', value: leaveReport?.approved || 0, color: '#10B981' },
    { label: 'Pending', value: leaveReport?.pending || 0, color: '#F59E0B' },
    { label: 'Rejected', value: leaveReport?.rejected || 0, color: '#F43F5E' },
  ];

  // Payroll split bar
  const grossSalary = payrollReport?.totalGrossSalary || 1;
  const netSalary = payrollReport?.totalNetSalary || 0;
  const deductions = Math.max(0, grossSalary - netSalary);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ============================================================
          HEADER
          ============================================================ */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F1629 0%, #131D36 100%)',
          border: '1px solid rgba(99,102,241,0.15)',
        }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(30px)' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}
            >
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#E8EDFF]">HR Analytics & Reports</h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Aggregated workforce intelligence — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          ATTENDANCE REPORT
          ============================================================ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-1 h-5 rounded-full"
            style={{ background: 'linear-gradient(180deg, #6366F1, #818CF8)', boxShadow: '0 0 8px rgba(99,102,241,0.6)' }}
          />
          <h2 className="text-sm font-bold text-[#E8EDFF]">Workforce Attendance Metrics</h2>
          <div className="ml-auto flex items-center gap-1 text-[10px] text-[#64748B]">
            <ArrowUpRight className="w-3 h-3 text-[#10B981]" />
            <span>All-time aggregate</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Donut */}
          <Card className="flex flex-col items-center">
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-4">Status Distribution</h3>
            {attTotal > 0 ? (
              <>
                <DonutChart slices={attSlices} size={150} strokeWidth={18} centerValue={attTotal} centerLabel="records" />
                <div className="mt-4 w-full">
                  <DonutLegend slices={attSlices} total={attTotal} />
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-xs text-[#64748B]">No attendance data available.</p>
              </div>
            )}
          </Card>

          {/* Bar chart */}
          <Card>
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-4">Attendance Breakdown</h3>
            <BarChart data={attBarData} height={130} showValues={true} className="mb-3" />
          </Card>

          {/* Key stats */}
          <Card className="space-y-3">
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Key Metrics</h3>
            {[
              { label: 'Total Employees', value: attReport?.totalEmployees || 0, color: '#6366F1' },
              { label: 'Present Logs', value: attReport?.present || 0, color: '#10B981' },
              { label: 'Absent Logs', value: attReport?.absent || 0, color: '#F43F5E' },
              { label: 'Half Days', value: attReport?.halfDay || 0, color: '#F59E0B' },
              { label: 'Leave Days', value: attReport?.leave || 0, color: '#6366F1' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px] text-[#64748B]">{item.label}</span>
                  <span className="text-[11px] font-bold font-mono" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
                <ProgressBar
                  value={item.value}
                  max={Math.max(attReport?.totalEmployees || 1, item.value)}
                  color={item.color}
                  height={4}
                />
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* ============================================================
          LEAVE REPORT
          ============================================================ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-1 h-5 rounded-full"
            style={{ background: 'linear-gradient(180deg, #0EA5E9, #38BDF8)', boxShadow: '0 0 8px rgba(14,165,233,0.6)' }}
          />
          <h2 className="text-sm font-bold text-[#E8EDFF]">Leave Application Distribution</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Leave donut */}
          <Card className="flex flex-col">
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-4">Application Status</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6 flex-1">
              {leaveTotal > 0 ? (
                <>
                  <DonutChart slices={leaveSlices} size={140} strokeWidth={16} centerValue={leaveTotal} centerLabel="total" />
                  <div className="flex-1 w-full">
                    <DonutLegend slices={leaveSlices} total={leaveTotal} />
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(30,45,74,0.5)' }}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[10px] text-[#64748B]">Approval Rate</span>
                        <span className="text-[10px] font-bold font-mono text-[#10B981]">
                          {leaveTotal > 0 ? Math.round(((leaveReport?.approved || 0) / leaveTotal) * 100) : 0}%
                        </span>
                      </div>
                      <ProgressBar
                        value={leaveReport?.approved || 0}
                        max={leaveTotal}
                        color="#10B981"
                        height={5}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xs text-[#64748B] py-8 text-center w-full">No leave data available.</p>
              )}
            </div>
          </Card>

          {/* Leave bar + stats */}
          <Card>
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-4">Request Breakdown</h3>
            <BarChart data={leaveBarData} height={120} showValues={true} className="mb-4" />
            <div className="grid grid-cols-3 gap-2">
              {leaveSlices.map((sl, i) => (
                <div
                  key={i}
                  className="text-center p-2.5 rounded-xl"
                  style={{ background: 'rgba(15,22,41,0.6)', border: `1px solid ${sl.color}25` }}
                >
                  <p className="text-lg font-black font-mono" style={{ color: sl.color }}>{sl.value}</p>
                  <p className="text-[10px] text-[#64748B]">{sl.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ============================================================
          PAYROLL REPORT
          ============================================================ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-1 h-5 rounded-full"
            style={{ background: 'linear-gradient(180deg, #10B981, #34D399)', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }}
          />
          <h2 className="text-sm font-bold text-[#E8EDFF]">Aggregate Payroll Financials</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {payrollMetrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl hover-lift"
                style={{ background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(30,45,74,0.7)' }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}
                >
                  <Icon className="w-4 h-4" style={{ color: m.color }} />
                </div>
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">{m.label}</p>
                <p className="text-xl font-black text-[#E8EDFF] font-mono" style={{ color: m.color }}>
                  {m.prefix || ''}{m.value}{m.suffix || ''}
                </p>
              </div>
            );
          })}
        </div>

        {/* Gross vs Net comparison */}
        <Card>
          <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-5">Gross vs Net Salary Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-[#94A3B8]">Total Gross Salary</span>
                <span className="text-xs font-bold font-mono text-[#0EA5E9]">
                  ₹{(payrollReport?.totalGrossSalary || 0).toLocaleString()}
                </span>
              </div>
              <ProgressBar value={grossSalary} max={grossSalary} color="#0EA5E9" height={8} />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-[#94A3B8]">Total Net Salary</span>
                <span className="text-xs font-bold font-mono text-[#10B981]">
                  ₹{(payrollReport?.totalNetSalary || 0).toLocaleString()}
                </span>
              </div>
              <ProgressBar value={netSalary} max={grossSalary} color="#10B981" height={8} />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-[#94A3B8]">Total Deductions</span>
                <span className="text-xs font-bold font-mono text-[#F43F5E]">
                  ₹{deductions.toLocaleString()}
                </span>
              </div>
              <ProgressBar value={deductions} max={grossSalary} color="#F43F5E" height={8} />
            </div>
          </div>

          {/* Summary stats */}
          <div className="mt-5 pt-4 grid grid-cols-3 gap-3" style={{ borderTop: '1px solid rgba(30,45,74,0.5)' }}>
            <div className="text-center">
              <p className="text-[10px] text-[#64748B]">Net / Gross Ratio</p>
              <p className="text-sm font-black font-mono text-[#10B981]">
                {grossSalary > 0 ? Math.round((netSalary / grossSalary) * 100) : 0}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-[#64748B]">Avg Gross</p>
              <p className="text-sm font-black font-mono text-[#0EA5E9]">
                ₹{payrollReport?.employeeCount > 0
                  ? Math.round(grossSalary / payrollReport.employeeCount).toLocaleString()
                  : 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-[#64748B]">Avg Net</p>
              <p className="text-sm font-black font-mono text-[#8B5CF6]">
                ₹{(payrollReport?.averageNetSalary || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
