'use client';

import React, { useState } from 'react';
import { LeaveRequest } from '../../types';
import { leaveService } from '../../services/leaveService';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
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
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-slate-100">
                {request.employee?.firstName} {request.employee?.lastName}
              </p>
              <p className="text-xs text-slate-400">
                {request.employee?.designation} • {request.employee?.department}
              </p>
            </div>
            <Badge variant="purple">{request.leaveType}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-850">
            <div>
              <span className="text-slate-500">Date Duration</span>
              <p className="font-mono text-slate-200 font-medium">
                {new Date(request.startDate).toLocaleDateString()} — {new Date(request.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Total Working Days</span>
              <p className="font-mono text-purple-400 font-bold">{request.numberOfDays} Day(s)</p>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500">Employee Reason</span>
            <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 mt-1">
              "{request.reason}"
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            HR Approver Remarks / Rejection Reason
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Add comments or rejection explanation..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          <Button
            variant="danger"
            onClick={handleReject}
            isLoading={loadingReject}
            disabled={loadingApprove}
          >
            <XCircle className="w-4 h-4 mr-1.5" />
            Reject Request
          </Button>

          <Button
            variant="primary"
            onClick={handleApprove}
            isLoading={loadingApprove}
            disabled={loadingReject}
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Approve Request
          </Button>
        </div>
      </div>
    </Modal>
  );
};
