'use client';

import React, { useState } from 'react';
import { LeaveRequest } from '../../types';
import { leaveService } from '../../services/leaveService';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface LeaveApprovalModalProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const LeaveApprovalModal: React.FC<LeaveApprovalModalProps> = ({
  request,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [comment, setComment] = useState<string>('');
  const [loadingApprove, setLoadingApprove] = useState<boolean>(false);
  const [loadingReject, setLoadingReject] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!request) return null;

  const handleApprove = async () => {
    try {
      setLoadingApprove(true);
      setError('');
      await leaveService.approve(request.id, comment);
      onRefresh();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Approval failed');
    } finally {
      setLoadingApprove(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      setError('Please provide a reason for rejecting the leave request.');
      return;
    }
    try {
      setLoadingReject(true);
      setError('');
      await leaveService.reject(request.id, comment);
      onRefresh();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Rejection failed');
    } finally {
      setLoadingReject(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Leave Request" maxWidth="md">
      <div className="space-y-4 text-sm">
        {error && (
          <div
            className="p-3 text-xs font-medium rounded-xl"
            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: 'var(--danger)' }}
          >
            ⚠ {error}
          </div>
        )}

        <div
          className="p-4 rounded-xl space-y-3"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {request.employee?.firstName} {request.employee?.lastName}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {request.employee?.designation} • {request.employee?.department}
              </p>
            </div>
            <Badge variant="indigo">{request.leaveType}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Date Duration</span>
              <p className="font-mono font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {new Date(request.startDate).toLocaleDateString()} — {new Date(request.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Total Working Days</span>
              <p className="font-mono font-bold mt-0.5" style={{ color: 'var(--accent)' }}>{request.numberOfDays} Day(s)</p>
            </div>
          </div>

          <div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Employee Reason</span>
            <p
              className="text-xs italic p-2.5 rounded-lg mt-1"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              "{request.reason}"
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            HR Approver Remarks / Rejection Reason
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Add comments or rejection explanation..."
            className="w-full px-3.5 py-2.5 rounded-xl text-xs transition-all focus:outline-none"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow-sm)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            onClick={handleReject}
            disabled={loadingApprove || loadingReject}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,var(--danger),#E11D48)', boxShadow: '0 4px 15px rgba(244,63,94,0.35)' }}
          >
            <XCircle className="w-4 h-4" />
            {loadingReject ? 'Rejecting...' : 'Reject Request'}
          </button>

          <button
            type="button"
            onClick={handleApprove}
            disabled={loadingApprove || loadingReject}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)', boxShadow: '0 4px 15px var(--accent-glow)' }}
          >
            <CheckCircle2 className="w-4 h-4" />
            {loadingApprove ? 'Approving...' : 'Approve Request'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
