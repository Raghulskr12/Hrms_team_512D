'use client';

import React, { useState } from 'react';
import { LeaveType } from '../../types';
import { leaveService } from '../../services/leaveService';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

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
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-lg">
            {error}
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
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Total Working Days</span>
            <span className="font-bold text-purple-400 font-mono text-sm">{calculatedDays} Day(s)</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">Reason / Remarks</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="State the reason for taking leave..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={loading}>
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
