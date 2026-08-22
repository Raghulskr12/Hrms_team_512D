'use client';

import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../../../services/attendanceService';
import { Attendance, AttendanceStatus } from '../../../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../components/ui/Table';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';
import { Select } from '../../../../components/ui/Select';
import { Input } from '../../../../components/ui/Input';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { Clock, Filter, Edit2 } from 'lucide-react';

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [editRecord, setEditRecord] = useState<Attendance | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>('PRESENT');
  const [editRemarks, setEditRemarks] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAll({
        department: departmentFilter,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setRecords(data || []);
    } catch (e) {
      console.error('Error fetching master attendance:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [departmentFilter, statusFilter, startDate, endDate]);

  const handleSaveCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRecord) return;

    try {
      setSaving(true);
      await attendanceService.adminUpdate(editRecord.id, {
        status: editStatus,
        remarks: editRemarks,
      });
      setEditRecord(null);
      fetchAttendance();
    } catch (e) {
      console.error('Error saving correction:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span>Master Attendance Records</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Filter workforce attendance across departments and dates.</p>
        </div>
      </div>

      {/* Filter Bar matching wireframe */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-purple-400" />
          <span>Attendance Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="HALF_DAY">Half Day</option>
            <option value="LEAVE">Leave</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Loading attendance records..." />
      ) : records.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs text-slate-300">
                  {new Date(r.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-semibold text-slate-100">
                  {r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : 'N/A'}
                  <span className="block text-[10px] text-slate-400 font-mono">{r.employee?.user?.employeeId}</span>
                </TableCell>
                <TableCell className="text-xs text-slate-300">{r.employee?.department}</TableCell>
                <TableCell className="font-mono text-xs">
                  {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </TableCell>
                <TableCell className="font-mono font-semibold text-purple-400">
                  {r.workedHours || 0} hrs
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      r.status === 'PRESENT'
                        ? 'success'
                        : r.status === 'ABSENT'
                        ? 'danger'
                        : r.status === 'HALF_DAY'
                        ? 'warning'
                        : 'purple'
                    }
                  >
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => {
                      setEditRecord(r);
                      setEditStatus(r.status);
                      setEditRemarks(r.remarks || '');
                    }}
                    className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Correct Attendance Record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState title="No attendance logs found" description="Adjust your date or department filters." />
      )}

      {/* Manual Correction Modal */}
      {editRecord && (
        <Modal
          isOpen={!!editRecord}
          onClose={() => setEditRecord(null)}
          title={`Correct Attendance Record — ${editRecord.employee?.firstName} ${editRecord.employee?.lastName}`}
          maxWidth="sm"
        >
          <form onSubmit={handleSaveCorrection} className="space-y-4">
            <Select
              label="Attendance Status"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as AttendanceStatus)}
              options={[
                { value: 'PRESENT', label: 'Present' },
                { value: 'ABSENT', label: 'Absent' },
                { value: 'HALF_DAY', label: 'Half Day' },
                { value: 'LEAVE', label: 'Leave' },
              ]}
            />

            <Input
              label="HR Correction Remarks"
              value={editRemarks}
              onChange={(e) => setEditRemarks(e.target.value)}
              placeholder="e.g. Manual correction authorized by HR"
            />

            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setEditRecord(null)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" isLoading={saving}>
                Save Correction
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
