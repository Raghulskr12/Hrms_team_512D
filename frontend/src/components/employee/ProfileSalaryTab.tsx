'use client';

import React, { useState, useEffect } from 'react';
import { Salary } from '../../types';
import { payrollService } from '../../services/payrollService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DollarSign, Edit3, Briefcase, Calculator } from 'lucide-react';

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
      setSalary(updated || null);
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Salary Info</h3>
          <p className="text-xs text-slate-500 mt-1">Detailed breakdown of monthly compensation.</p>
        </div>
        {isAdminOrHR && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="border-slate-200 dark:border-slate-700">
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            Edit Package
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 mb-6 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs rounded-xl">
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Basic Salary"
              type="number"
              value={formData.basicSalary}
              onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
              required
            />
            <Input
              label="House Rent Allowance (HRA)"
              type="number"
              value={formData.hra}
              onChange={(e) => setFormData({ ...formData, hra: Number(e.target.value) })}
              required
            />
            <Input
              label="Standard Allowance"
              type="number"
              value={formData.allowances}
              onChange={(e) => setFormData({ ...formData, allowances: Number(e.target.value) })}
              required
            />
            <Input
              label="Tax / Deductions"
              type="number"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 font-mono">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Calculated Gross</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">${calculatedGross.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Calculated Net Payable</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">${calculatedNet.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsEditing(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={saving}>
              Save Structure
            </Button>
          </div>
        </form>
      ) : salary ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Month Wage</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">${salary.netSalary.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yearly Wage</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">${(salary.netSalary * 12).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">Salary Components</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Basic</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">${salary.basicSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">House Rent Allowance</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">${salary.hra.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Standard Allowance</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">${salary.allowances.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">Provident Fund Contribution</h4>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">PF Deduction</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">$0</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">Tax Deductions</h4>
              <div className="flex justify-between items-center bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/40">
                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">Total Deductions</span>
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400">-${salary.deductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500">
          <Briefcase className="w-8 h-8 mx-auto mb-3 opacity-50" />
          No active salary structure record found.
        </div>
      )}
    </div>
  );
};
