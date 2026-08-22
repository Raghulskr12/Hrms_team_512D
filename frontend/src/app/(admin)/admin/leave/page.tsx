'use client';

import React, { useState, useEffect } from 'react';
import { leaveService } from '../../../../services/leaveService';
import { LeaveRequest } from '../../../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../components/ui/Table';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { LeaveApprovalModal } from '../../../../components/leave/LeaveApprovalModal';
import { FileCheck, Filter } from 'lucide-react';

export default function AdminLeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getAllRequests(statusFilter !== 'ALL' ? statusFilter : undefined);
      setRequests(data || []);
    } catch (e) {
      console.error('Error loading leave requests:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const tabs = [
    { id: 'PENDING', label: 'Pending Approval' },
    { id: 'APPROVED', label: 'Approved' },
    { id: 'REJECTED', label: 'Rejected' },
    { id: 'ALL', label: 'All Requests' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-purple-400" />
            <span>Leave Approvals Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Review, approve, or reject employee leave applications.</p>
        </div>

        {/* Filter Tabs matching wireframe */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg self-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading leave applications..." />
      ) : requests.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Date Duration</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-semibold text-slate-100">
                  {req.employee ? `${req.employee.firstName} ${req.employee.lastName}` : 'N/A'}
                  <span className="block text-[10px] text-slate-400 font-mono">{req.employee?.user?.employeeId}</span>
                </TableCell>
                <TableCell className="font-semibold text-slate-200">{req.leaveType}</TableCell>
                <TableCell className="font-mono text-xs text-slate-300">
                  {new Date(req.startDate).toLocaleDateString()} — {new Date(req.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-purple-400">
                  {req.numberOfDays} Day(s)
                </TableCell>
                <TableCell className="text-xs text-slate-300 max-w-xs truncate">{req.reason}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      req.status === 'APPROVED'
                        ? 'success'
                        : req.status === 'REJECTED'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {req.status === 'PENDING' ? (
                    <Button variant="primary" size="sm" onClick={() => setSelectedRequest(req)}>
                      Review Application
                    </Button>
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      Processed by {req.approvedBy?.profile?.firstName || 'HR'}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState title="No leave applications found" description="There are no requests under the selected filter." />
      )}

      {/* Review Modal */}
      {selectedRequest && (
        <LeaveApprovalModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onRefresh={fetchRequests}
        />
      )}
    </div>
  );
}
