'use client';

import React, { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

interface Rule {
  label: string;
  test: (pw: string) => boolean;
}

const RULES: Rule[] = [
  { label: 'At least 8 characters',       test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter (A–Z)',   test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter (a–z)',   test: (pw) => /[a-z]/.test(pw) },
  { label: 'One number (0–9)',             test: (pw) => /\d/.test(pw) },
  { label: 'One special character (!@#…)', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

const STRENGTH_CONFIG = [
  { label: 'Very Weak', color: '#F43F5E', width: '20%' },
  { label: 'Weak',      color: '#F97316', width: '40%' },
  { label: 'Fair',      color: '#F59E0B', width: '60%' },
  { label: 'Good',      color: '#22C55E', width: '80%' },
  { label: 'Strong',    color: '#10B981', width: '100%' },
];

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const passed = useMemo(() => RULES.filter((r) => r.test(password)).length, [password]);
  const strength = Math.max(0, passed - 1); // 0–4
  const cfg = STRENGTH_CONFIG[strength];

  if (!password) return null;

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Strength meter */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Password Strength
          </span>
          <span className="text-[10px] font-bold" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
          <div
            className="pw-strength-bar"
            style={{ width: cfg.width, background: cfg.color, boxShadow: `0 0 8px ${cfg.color}60` }}
          />
        </div>
      </div>

      {/* Rules checklist */}
      <div className="space-y-1.5">
        {RULES.map((rule, i) => {
          const ok = rule.test(password);
          return (
            <div key={i} className="flex items-center gap-2">
              {ok
                ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--success)' }}/>
                : <XCircle    className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)', opacity: 0.5 }}/>
              }
              <span className="text-[11px]" style={{ color: ok ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Returns true if password passes all rules */
export const isPasswordStrong = (password: string): boolean =>
  RULES.every((r) => r.test(password));

/** Returns count of passed rules */
export const passwordScore = (password: string): number =>
  RULES.filter((r) => r.test(password)).length;
