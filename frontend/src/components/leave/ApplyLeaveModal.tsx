'use client';

import React, { useState } from 'react';
import { LeaveType } from '../../types';
import { leaveService } from '../../services/leaveService';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [leaveType, setLeaveType] = useState<LeaveType>('PAID');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (s > e) return 0;

    let count = 0;
    const curr = new Date(s);
    while (curr <= e) {
      const day = curr.getDay();
      if (day !== 0 && day !== 6) count++;
      curr.setDate(curr.getDate() + 1);
    }
    return count;
  };

  const calculatedDays = calculateDays();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    if (calculatedDays <= 0) {
      setError('Selected date range must include at least one working day');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason for your leave request');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await leaveService.applyLeave({
        leaveType,
        startDate,
        endDate,
        reason,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Leave" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            className="p-3 text-xs font-medium rounded-xl"
            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: 'var(--danger)' }}
          >
            ⚠ {error}
          </div>
        )}

        <Select
          label="Leave Type"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value as LeaveType)}
          options={[
            { value: 'PAID', label: 'Paid Leave' },
            { value: 'SICK', label: 'Sick Leave' },
            { value: 'CASUAL', label: 'Casual Leave' },
            { value: 'UNPAID', label: 'Unpaid Leave' },
            { value: 'BEREAVEMENT', label: 'Bereavement Leave' },
            { value: 'EXAM', label: 'Exam Leave (Eligible Interns Only)' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {calculatedDays > 0 && (
          <div
            className="p-3 rounded-xl flex justify-between items-center text-xs font-medium"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Total Working Days</span>
            <span className="font-bold font-mono text-sm" style={{ color: 'var(--accent)' }}>{calculatedDays} Day(s)</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Reason / Remarks</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="State the reason for taking leave..."
            className="w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow-sm)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl transition-all"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-xs font-bold rounded-xl text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)', boxShadow: '0 4px 15px var(--accent-glow)' }}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
