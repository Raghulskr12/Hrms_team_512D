'use client';

import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../../../services/attendanceService';
import { Attendance, AttendanceStatus } from '../../../../types';
import { AttendanceCalendar } from '../../../../components/attendance/AttendanceCalendar';
import { Card } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { Modal } from '../../../../components/ui/Modal';
import { Select } from '../../../../components/ui/Select';
import { Input } from '../../../../components/ui/Input';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { Clock, Filter, Edit2, Users, CalendarDays, TrendingUp } from 'lucide-react';

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [view, setView] = useState<'table' | 'calendar'>('table');

  const [editRecord, setEditRecord] = useState<Attendance | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>('PRESENT');
  const [editRemarks, setEditRemarks] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAll({
        department: departmentFilter !== 'ALL' ? departmentFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setRecords(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttendance(); }, [departmentFilter, statusFilter, startDate, endDate]);

  const handleSaveCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRecord) return;
    try {
      setSaving(true);
      await attendanceService.adminUpdate(editRecord.id, { status: editStatus, remarks: editRemarks });
      setEditRecord(null);
      fetchAttendance();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    fontSize: 12,
    outline: 'none',
    cursor: 'pointer',
  };

  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const absentCount  = records.filter((r) => r.status === 'ABSENT').length;
  const leaveCount   = records.filter((r) => r.status === 'LEAVE').length;

  const statusColor = (s: string) =>
    s === 'PRESENT'  ? 'success' as const :
    s === 'ABSENT'   ? 'danger'  as const :
    s === 'HALF_DAY' ? 'warning' as const : 'purple' as const;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)', boxShadow: '0 0 16px var(--accent-glow)' }}>
            <Clock className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Attendance Hub</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Filter, review and correct workforce attendance records</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setView('table')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            style={view === 'table'
              ? { background: 'var(--accent)', color: '#fff' }
              : { color: 'var(--text-muted)', background: 'transparent' }}
          >
            <TrendingUp className="w-3.5 h-3.5"/> Records
          </button>
          <button
            onClick={() => setView('calendar')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            style={view === 'calendar'
              ? { background: 'var(--accent)', color: '#fff' }
              : { color: 'var(--text-muted)', background: 'transparent' }}
          >
            <CalendarDays className="w-3.5 h-3.5"/> Calendar
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Present',  value: presentCount, color: 'var(--success)', icon: <Users className="w-4 h-4"/> },
          { label: 'Absent',   value: absentCount,  color: 'var(--danger)',  icon: <Users className="w-4 h-4"/> },
          { label: 'On Leave', value: leaveCount,   color: 'var(--violet)',  icon: <CalendarDays className="w-4 h-4"/> },
        ].map((s, i) => (
          <Card key={i} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${s.color}18`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-black font-mono" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }}/>
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Filters</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} style={selectStyle}>
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="HALF_DAY">Half Day</option>
            <option value="LEAVE">Leave</option>
          </select>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={selectStyle}/>
          <input type="date" value={endDate}   onChange={(e) => setEndDate(e.target.value)}   style={selectStyle}/>
        </div>
      </Card>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading attendance records..."/>
      ) : view === 'calendar' ? (
        <AttendanceCalendar records={records} className="w-full"/>
      ) : records.length > 0 ? (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                  {['Date','Employee','Department','Check In','Check Out','Hours','Status','Action'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)', fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r.id}
                    className="nx-table-row transition-all"
                    style={{ borderBottom: i < records.length - 1 ? '1px solid var(--border-muted)' : 'none' }}>
                    <td className="px-4 py-3 font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)' }}>
                          {r.employee?.firstName?.[0]}{r.employee?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {r.employee?.firstName} {r.employee?.lastName}
                          </p>
                          <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                            {r.employee?.user?.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.employee?.department}</td>
                    <td className="px-4 py-3 font-mono" style={{ color: 'var(--success)' }}>
                      {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : '—'}
                    </td>
                    <td className="px-4 py-3 font-mono" style={{ color: 'var(--danger)' }}>
                      {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : '—'}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold" style={{ color: 'var(--accent)' }}>
                      {r.workedHours || 0}h
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusColor(r.status)}>{r.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setEditRecord(r); setEditStatus(r.status); setEditRemarks(r.remarks || ''); }}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                      >
                        <Edit2 className="w-3.5 h-3.5"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="py-16 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--border)' }}/>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No attendance records found</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            Adjust your filters to find records
          </p>
        </Card>
      )}

      {/* Edit Modal */}
      {editRecord && (
        <Modal isOpen={!!editRecord} onClose={() => setEditRecord(null)}
          title={`Correct: ${editRecord.employee?.firstName} ${editRecord.employee?.lastName}`}
          maxWidth="sm">
          <form onSubmit={handleSaveCorrection} className="space-y-4">
            <Select label="Attendance Status" value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as AttendanceStatus)}
              options={[
                { value:'PRESENT',  label:'Present'  },
                { value:'ABSENT',   label:'Absent'   },
                { value:'HALF_DAY', label:'Half Day' },
                { value:'LEAVE',    label:'Leave'    },
              ]}
            />
            <Input label="HR Correction Remarks" value={editRemarks}
              onChange={(e) => setEditRemarks(e.target.value)}
              placeholder="e.g. Manual correction authorized by HR"/>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditRecord(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl transition-all"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="px-4 py-2 text-xs font-bold rounded-xl text-white transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)' }}>
                {saving ? 'Saving...' : 'Save Correction'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
