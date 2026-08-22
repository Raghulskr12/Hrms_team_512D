'use client';

import React, { useState, useEffect } from 'react';
import { payrollService } from '../../../../services/payrollService';
import { Salary } from '../../../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../components/ui/Table';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';
import { Input } from '../../../../components/ui/Input';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { CreditCard, Edit3, DollarSign } from 'lucide-react';

export default function AdminPayrollPage() {
  const [payrolls, setPayrolls] = useState<Salary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editSalary, setEditSalary] = useState<Salary | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    basicSalary: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
  });

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const data = await payrollService.getAllPayroll();
      setPayrolls(data || []);
    } catch (e) {
      console.error('Error fetching payroll directory:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const totalGross = payrolls.reduce((sum, p) => sum + p.grossSalary, 0);
  const totalNet = payrolls.reduce((sum, p) => sum + p.netSalary, 0);

  const handleEditClick = (s: Salary) => {
    setEditSalary(s);
    setFormData({
      basicSalary: s.basicSalary,
      hra: s.hra,
      allowances: s.allowances,
      deductions: s.deductions,
    });
  };

  const handleSaveSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSalary) return;

    try {
      setSaving(true);
      setError('');
      await payrollService.updateSalary(editSalary.employeeId, {
        basicSalary: Number(formData.basicSalary),
        hra: Number(formData.hra),
        allowances: Number(formData.allowances),
        deductions: Number(formData.deductions),
      });
      setEditSalary(null);
      fetchPayroll();
    } catch (e: any) {
      setError(e.message || 'Failed to update salary');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-purple-400" />
            <span>Workforce Payroll Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage employee salary structures, allowances, and tax deductions.</p>
        </div>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono">
          <p className="text-xs text-slate-500 font-sans">TOTAL GROSS PAYROLL</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">${totalGross.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono">
          <p className="text-xs text-slate-500 font-sans">TOTAL NET PAYABLE</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">${totalNet.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono">
          <p className="text-xs text-slate-500 font-sans">EMPLOYEES ON PAYROLL</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{payrolls.length}</p>
        </div>
      </div>

      {/* Payroll Table */}
      {loading ? (
        <LoadingSpinner message="Loading payroll directory..." />
      ) : payrolls.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Basic</TableHead>
              <TableHead>HRA</TableHead>
              <TableHead>Allowances</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Gross</TableHead>
              <TableHead>Net Salary</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrolls.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-semibold text-slate-100">
                  {p.employee ? `${p.employee.firstName} ${p.employee.lastName}` : 'N/A'}
                  <span className="block text-[10px] text-slate-400 font-mono">{p.employee?.user?.employeeId}</span>
                </TableCell>
                <TableCell className="text-xs text-slate-300">{p.employee?.department}</TableCell>
                <TableCell className="font-mono text-xs">${p.basicSalary.toLocaleString()}</TableCell>
                <TableCell className="font-mono text-xs">${p.hra.toLocaleString()}</TableCell>
                <TableCell className="font-mono text-xs">${p.allowances.toLocaleString()}</TableCell>
                <TableCell className="font-mono text-xs text-rose-400">-${p.deductions.toLocaleString()}</TableCell>
                <TableCell className="font-mono text-xs font-semibold text-slate-200">${p.grossSalary.toLocaleString()}</TableCell>
                <TableCell className="font-mono text-xs font-bold text-purple-400">${p.netSalary.toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(p)}>
                    <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState title="No payroll records found" description="Initialize employee salary structures to get started." />
      )}

      {/* Edit Salary Structure Modal */}
      {editSalary && (
        <Modal
          isOpen={!!editSalary}
          onClose={() => setEditSalary(null)}
          title={`Update Salary Structure — ${editSalary.employee?.firstName} ${editSalary.employee?.lastName}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveSalary} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Basic Salary ($)"
                type="number"
                value={formData.basicSalary}
                onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                required
              />

              <Input
                label="HRA ($)"
                type="number"
                value={formData.hra}
                onChange={(e) => setFormData({ ...formData, hra: Number(e.target.value) })}
                required
              />

              <Input
                label="Allowances ($)"
                type="number"
                value={formData.allowances}
                onChange={(e) => setFormData({ ...formData, allowances: Number(e.target.value) })}
                required
              />

              <Input
                label="Deductions ($)"
                type="number"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setEditSalary(null)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" isLoading={saving}>
                Save Structure
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
