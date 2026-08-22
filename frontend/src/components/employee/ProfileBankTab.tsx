'use client';

import React, { useState, useEffect } from 'react';
import { BankDetails } from '../../types';
import { employeeService } from '../../services/employeeService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ShieldCheck, Edit3 } from 'lucide-react';

interface ProfileBankTabProps {
  employeeProfileId: string;
  isEditable?: boolean;
}

export const ProfileBankTab: React.FC<ProfileBankTabProps> = ({ employeeProfileId, isEditable = true }) => {
  const [bank, setBank] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
  });

  const fetchBank = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getBankDetails(employeeProfileId);
      setBank(data || null);
      if (data) {
        setFormData({
          accountHolderName: data.accountHolderName || '',
          accountNumber: data.accountNumber || '',
          ifscCode: data.ifscCode || '',
          bankName: data.bankName || '',
          branchName: data.branchName || '',
        });
      }
    } catch (e: any) {
      setError(e.message || 'Unable to load bank details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBank();
  }, [employeeProfileId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      const updated = await employeeService.updateBankDetails(employeeProfileId, formData);
      setBank(updated);
      setIsEditing(false);
    } catch (e: any) {
      setError(e.message || 'Failed to update bank details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading bank information...</div>;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-semibold text-slate-100">Bank Account & Remittance Details</h3>
        </div>
        {isEditable && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            Edit Details
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
          <Input
            label="Account Holder Name"
            value={formData.accountHolderName}
            onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bank Name"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              required
            />
            <Input
              label="Branch Name"
              value={formData.branchName}
              onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
              required
            />
            <Input
              label="Account Number"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              required
            />
            <Input
              label="IFSC / Swift Code"
              value={formData.ifscCode}
              onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setIsEditing(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={saving}>
              Save Bank Details
            </Button>
          </div>
        </form>
      ) : bank ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-850">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Account Holder</p>
            <p className="text-slate-200 font-medium mt-1">{bank.accountHolderName}</p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-850">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Bank Name</p>
            <p className="text-slate-200 font-medium mt-1">{bank.bankName}</p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-850">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Account Number</p>
            <p className="font-mono text-purple-300 font-medium mt-1">{bank.accountNumber}</p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-850">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">IFSC Code</p>
            <p className="font-mono text-slate-200 font-medium mt-1">{bank.ifscCode}</p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-850 md:col-span-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Branch Location</p>
            <p className="text-slate-200 font-medium mt-1">{bank.branchName}</p>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-950/40 border border-slate-800 rounded-xl text-slate-400">
          No bank account details configured yet.
        </div>
      )}
    </div>
  );
};
