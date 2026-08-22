'use client';

import React, { useState, useEffect } from 'react';
import { Salary } from '../../types';
import { payrollService } from '../../services/payrollService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DollarSign, Edit3 } from 'lucide-react';

interface ProfileSalaryTabProps {
  employeeProfileId: string;
  isAdminOrHR?: boolean;
}

export const ProfileSalaryTab: React.FC<ProfileSalaryTabProps> = ({
  employeeProfileId,
  isAdminOrHR = false,
}) => {
  const [salary, setSalary] = useState<Salary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    basicSalary: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
  });

  const fetchSalary = async () => {
    try {
      setLoading(true);
      const data = isAdminOrHR
        ? await payrollService.getEmployeeSalary(employeeProfileId)
        : await payrollService.getMySalary();

      setSalary(data || null);
      if (data) {
        setFormData({
          basicSalary: data.basicSalary,
          hra: data.hra,
          allowances: data.allowances,
          deductions: data.deductions,
        });
      }
    } catch (e: any) {
      setError(e.message || 'Unable to load salary details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, [employeeProfileId]);

  const calculatedGross = Number(formData.basicSalary) + Number(formData.hra) + Number(formData.allowances);
  const calculatedNet = Math.max(0, calculatedGross - Number(formData.deductions));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      const updated = await payrollService.updateSalary(employeeProfileId, {
        basicSalary: Number(formData.basicSalary),
        hra: Number(formData.hra),
        allowances: Number(formData.allowances),
        deductions: Number(formData.deductions),
      });
      setSalary(updated);
      setIsEditing(false);
    } catch (e: any) {
      setError(e.message || 'Failed to update salary');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading compensation structure...</div>;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-semibold text-slate-100">Salary & Compensation Breakdown</h3>
        </div>
        {isAdminOrHR && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            Update Salary
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-lg">
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Basic Salary ($)"
              type="number"
              value={formData.basicSalary}
              onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
              required
            />
            <Input
              label="House Rent Allowance (HRA) ($)"
              type="number"
              value={formData.hra}
              onChange={(e) => setFormData({ ...formData, hra: Number(e.target.value) })}
              required
            />
            <Input
              label="Special Allowances ($)"
              type="number"
              value={formData.allowances}
              onChange={(e) => setFormData({ ...formData, allowances: Number(e.target.value) })}
              required
            />
            <Input
              label="Total Deductions (PF/Tax) ($)"
              type="number"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
            <div>
              <p className="text-xs text-slate-500">Calculated Gross</p>
              <p className="text-base font-bold text-slate-100">${calculatedGross.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Calculated Net Payable</p>
              <p className="text-base font-bold text-purple-400">${calculatedNet.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setIsEditing(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={saving}>
              Save Salary Structure
            </Button>
          </div>
        </form>
      ) : salary ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <p className="text-xs text-slate-500 font-medium">BASIC SALARY</p>
              <p className="text-xl font-bold font-mono text-slate-100 mt-1">${salary.basicSalary.toLocaleString()}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <p className="text-xs text-slate-500 font-medium">HRA ALLOWANCE</p>
              <p className="text-xl font-bold font-mono text-slate-100 mt-1">${salary.hra.toLocaleString()}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <p className="text-xs text-slate-500 font-medium">SPECIAL ALLOWANCES</p>
              <p className="text-xl font-bold font-mono text-slate-100 mt-1">${salary.allowances.toLocaleString()}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
              <p className="text-xs text-slate-500 font-medium">DEDUCTIONS (PF / TAX)</p>
              <p className="text-xl font-bold font-mono text-rose-400 mt-1">-${salary.deductions.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 p-5 rounded-xl border border-purple-800/50 flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-300 font-semibold tracking-wider uppercase">Net Monthly Take-Home Salary</p>
              <p className="text-2xl font-extrabold font-mono text-white mt-1">${salary.netSalary.toLocaleString()}</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>Gross: <strong className="text-slate-200">${salary.grossSalary.toLocaleString()}</strong></p>
              <p className="text-[11px] mt-0.5">Effective: {new Date(salary.effectiveFrom).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-950/40 border border-slate-800 rounded-xl text-slate-400">
          No active salary structure record found.
        </div>
      )}
    </div>
  );
};
