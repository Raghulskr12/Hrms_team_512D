'use client';

import React, { useState, useEffect } from 'react';
import { leaveService } from '../../../services/leaveService';
import { LeaveBalance, LeaveRequest } from '../../../types';
import { LeaveBalanceCards } from '../../../components/leave/LeaveBalanceCards';
import { LeaveHistoryTable } from '../../../components/leave/LeaveHistoryTable';
import { ApplyLeaveModal } from '../../../components/leave/ApplyLeaveModal';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Plus, CalendarDays } from 'lucide-react';

export default function EmployeeLeavePage() {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [applyModalOpen, setApplyModalOpen] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [balRes, reqRes] = await Promise.all([
        leaveService.getBalances(),
        leaveService.getMyRequests(),
      ]);

      setBalances(balRes || []);
      setRequests(reqRes || []);
    } catch (e) {
      console.error('Error loading leave data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-purple-400" />
            <span>My Leave Tracker</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">View available leave balances and track application statuses.</p>
        </div>

        <Button variant="primary" onClick={() => setApplyModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Apply for Leave
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading leave tracker..." />
      ) : (
        <div className="space-y-6">
          {/* Balance Cards */}
          <LeaveBalanceCards balances={balances} />

          {/* Leave Application History Table */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-100">Leave Request History</h3>
            <LeaveHistoryTable requests={requests} />
          </div>
        </div>
      )}

      {/* Apply Leave Form Modal */}
      <ApplyLeaveModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
