'use client';

import React, { useState, useEffect } from 'react';
import { profileService } from '../../../services/profileService';
import { EmployeeProfile } from '../../../types';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { PasswordStrength, isPasswordStrong } from '../../../components/ui/PasswordStrength';
import { ProfilePersonalTab } from '../../../components/employee/ProfilePersonalTab';
import { ProfileJobTab } from '../../../components/employee/ProfileJobTab';
import { ProfileBankTab } from '../../../components/employee/ProfileBankTab';
import { ProfileSalaryTab } from '../../../components/employee/ProfileSalaryTab';
import { ProfileDocumentsTab } from '../../../components/employee/ProfileDocumentsTab';
import { EditProfileModal } from '../../../components/employee/EditProfileModal';
import { Edit3, User, ShieldCheck, DollarSign, FileText, Briefcase, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const tabList = [
  { id: 'resume',   label: 'Resume',       icon: <User className="w-3.5 h-3.5"/> },
  { id: 'personal', label: 'Private Info',  icon: <ShieldCheck className="w-3.5 h-3.5"/> },
  { id: 'salary',   label: 'Salary',        icon: <DollarSign className="w-3.5 h-3.5"/> },
  { id: 'security', label: 'Security',      icon: <Lock className="w-3.5 h-3.5"/> },
];

function ChangePasswordSection() {
  const [currentPw,  setCurrentPw]  = useState('');
  const [newPw,      setNewPw]      = useState('');
  const [confirmPw,  setConfirmPw]  = useState('');
  const [showCurr,   setShowCurr]   = useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');

  const mismatch = confirmPw.length > 0 && newPw !== confirmPw;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { setError("New passwords don't match."); return; }
    if (!isPasswordStrong(newPw)) { setError('New password does not meet all requirements.'); return; }
    try {
      setLoading(true); setError(''); setSuccess('');
      await profileService.changePassword({ currentPassword: currentPw, newPassword: newPw });
      setSuccess('Password changed successfully!');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', borderRadius: 10, padding: '10px 40px 10px 14px',
    fontSize: 13, width: '100%', outline: 'none', transition: 'all 0.2s',
  };

  const PasswordField = ({ label, value, onChange, show, onToggle, invalid }: {
    label: string; value: string; onChange: (v: string) => void;
    show: boolean; onToggle: () => void; invalid?: boolean;
  }) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••" required style={{ ...inputStyle, borderColor: invalid ? 'var(--danger)' : 'var(--border)' }}
          onFocus={(e) => { if (!invalid) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-glow-sm)'; }}}
          onBlur={(e) => { if (!invalid) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}}
        />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: 'var(--text-muted)' }}>
          {show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--accent-glow-sm)', border: '1px solid var(--border)' }}>
          <Lock className="w-4 h-4" style={{ color: 'var(--accent)' }}/>
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Change Password</h3>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Update your account password</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl text-xs font-medium" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: 'var(--danger)' }}>
          ⚠ {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3.5 rounded-xl text-xs font-medium flex items-center gap-2"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--success)' }}>
          <CheckCircle2 className="w-4 h-4"/> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField label="Current Password" value={currentPw} onChange={setCurrentPw} show={showCurr} onToggle={() => setShowCurr(!showCurr)}/>
        <PasswordField label="New Password"     value={newPw}     onChange={setNewPw}     show={showNew}  onToggle={() => setShowNew(!showNew)}/>

        {/* Strength meter */}
        {newPw && (
          <div className="p-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <PasswordStrength password={newPw}/>
          </div>
        )}

        <PasswordField label="Confirm New Password" value={confirmPw} onChange={setConfirmPw} show={showConf} onToggle={() => setShowConf(!showConf)} invalid={mismatch}/>
        {mismatch && <p className="text-[11px] -mt-2 font-medium" style={{ color: 'var(--danger)' }}>⚠ Passwords do not match</p>}

        <button type="submit" disabled={loading || mismatch || !currentPw || !newPw}
          className="px-5 py-2.5 text-sm font-bold rounded-xl text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)', boxShadow: '0 4px 15px var(--accent-glow)' }}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

export default function EmployeeProfilePage() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resume');
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setProfile((await profileService.getProfile()) || null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (loading) return <LoadingSpinner message="Loading profile..." size="lg"/>;
  if (!profile) return (
    <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
      Employee profile not found.
    </div>
  );

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', filter: 'blur(30px)' }}/>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt={fullName} className="w-16 h-16 rounded-2xl object-cover shadow-xl"/>
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl"
                style={{ background: 'linear-gradient(135deg,var(--accent),#60A5FA)', boxShadow: '0 0 20px var(--accent-glow)' }}>
                {initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{fullName}</h2>
                <Badge variant={profile.user?.status === 'ACTIVE' ? 'success' : 'neutral'}>
                  {profile.user?.status || 'ACTIVE'}
                </Badge>
              </div>
              <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                {profile.designation && <span>{profile.designation} · </span>}
                <span className="font-semibold" style={{ color: 'var(--accent)' }}>{profile.department}</span>
              </p>
              <div className="flex items-center gap-3 text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                <span>ID: {profile.user?.employeeId}</span>
                <span>·</span>
                <span>{profile.user?.email}</span>
              </div>
            </div>
          </div>

          <button onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--accent-glow-sm)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
            <Edit3 className="w-3.5 h-3.5"/> Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        {tabList.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
            style={activeTab === tab.id
              ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 0 10px var(--accent-glow)' }
              : { color: 'var(--text-muted)', background: 'transparent' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'resume'   && <ProfileJobTab  profile={profile}/>}
        {activeTab === 'personal' && <ProfilePersonalTab profile={profile}/>}
        {activeTab === 'salary'   && <ProfileSalaryTab employeeProfileId={profile.id} isAdminOrHR={false}/>}
        {activeTab === 'security' && (
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <ChangePasswordSection/>
          </div>
        )}
      </div>

      <EditProfileModal profile={profile} isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)} onSuccess={fetchProfile}/>
    </div>
  );
}
