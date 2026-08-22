'use client';

import React, { useState, useEffect } from 'react';
import { leaveService } from '../../../services/leaveService';
import { LeaveBalance, LeaveRequest } from '../../../types';
import { LeaveBalanceCards } from '../../../components/leave/LeaveBalanceCards';
import { LeaveHistoryTable } from '../../../components/leave/LeaveHistoryTable';
import { ApplyLeaveModal } from '../../../components/leave/ApplyLeaveModal';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Time Off
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage your leave balances and upcoming time off.</p>
        </div>

        <Button variant="primary" onClick={() => setApplyModalOpen(true)} className="shadow-md shadow-purple-500/20">
          <Plus className="w-4 h-4 mr-1.5" />
          Request Time Off
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><LoadingSpinner message="Loading leave tracker..." /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (Calendar & Requests) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Leave Request History</h3>
              </div>
              <div className="p-0 sm:p-4">
                <LeaveHistoryTable requests={requests} />
              </div>
            </div>
            
            {/* Visual Calendar Placeholder */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 text-center">
               <CalendarIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
               <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">Calendar View</h4>
               <p className="text-sm text-slate-500 mt-1 mb-4">View your scheduled time off in a calendar format.</p>
               <Button variant="outline" size="sm">Coming Soon</Button>
            </div>
          </div>
          
          {/* Side Panel (Balances) */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">Available Balances</h3>
            <LeaveBalanceCards balances={balances} />
            
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-2xl p-5 mt-6">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300">Pending Approvals</h4>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                    You currently have {requests.filter(r => r.status === 'PENDING').length} request(s) waiting for managerial approval.
                  </p>
                </div>
              </div>
            </div>
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
