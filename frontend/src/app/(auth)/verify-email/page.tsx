'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authService } from '../../../services/authService';
import { Button } from '../../../components/ui/Button';
import { CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      handleVerify(token);
    }
  }, [token]);

  const handleVerify = async (tok: string) => {
    try {
      setLoading(true);
      const res = await authService.verifyEmail(tok);
      setSuccess(true);
      setMessage(res.message || 'Email successfully verified!');
    } catch (e: any) {
      setSuccess(false);
      setMessage(e.message || 'Email verification failed or link expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        {loading ? (
          <p className="text-slate-300">Verifying account email token...</p>
        ) : success ? (
          <div className="space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-100">Email Verified!</h3>
            <p className="text-sm text-slate-400">{message}</p>
            <Button variant="primary" onClick={() => router.push('/login')} className="w-full">
              Proceed to Login
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-100">Verification Link Invalid</h3>
            <p className="text-sm text-slate-400">{message || 'No verification token provided.'}</p>
            <Link href="/login" className="inline-block text-sm text-purple-400 font-semibold hover:underline">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
