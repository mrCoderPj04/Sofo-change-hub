'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState('TL001');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Save user session in localStorage
      localStorage.setItem('sofo_auth_token', data.accessToken);
      localStorage.setItem('sofo_user', JSON.stringify(data.user));

      const roleLabel =
        data.user.changehubRole === 'team_leader' ? 'Team Leader' : 'Customer';
      setSuccessMsg(
        `Welcome, ${data.user.displayName || data.user.username} (${roleLabel})! Redirecting...`
      );

      setTimeout(() => {
        router.push('/');
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col items-center justify-center p-4 selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,163,255,0.07),rgba(255,255,255,0))] pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="SOFO ChangeHub Logo"
            className="w-16 h-16 object-contain mx-auto mb-3 drop-shadow-md"
          />
          <h1 className="text-xl font-bold tracking-tight text-[#F5F7FA]">
            SOFO ChangeHub
          </h1>
          <p className="text-xs text-[#8D98A8] mt-1 flex items-center justify-center gap-1.5 font-medium">
            <span>PJSOFONIC Ecosystem</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>EMS Authentication</span>
          </p>
        </div>

        {/* Unified Simple Login Box */}
        <div className="bg-[#0D1219] border border-[#222B36] rounded-xl shadow-2xl p-6 relative overflow-hidden backdrop-blur-md">
          {/* Error & Success Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-xs text-red-300 flex items-start gap-2 animate-in fade-in-50">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-xs text-emerald-300 flex items-start gap-2 animate-in fade-in-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Simple Sign-In Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Employee ID */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8D98A8] mb-1.5">
                EMS Employee ID
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-[#8D98A8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. TL001 or CUST001"
                  className="w-full bg-[#111821] border border-[#222B36] rounded-md pl-9 pr-3 py-2 text-xs text-[#F5F7FA] font-code placeholder-[#5B6675] focus:outline-none focus:border-[#00A3FF]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8D98A8] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#8D98A8] absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111821] border border-[#222B36] rounded-md pl-9 pr-3 py-2 text-xs text-[#F5F7FA] placeholder-[#5B6675] focus:outline-none focus:border-[#00A3FF]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[#00A3FF] hover:bg-[#0284C7] text-[#07090D] font-bold text-xs rounded-md shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to ChangeHub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Credentials Helper */}
          <div className="mt-5 pt-4 border-t border-[#222B36]">
            <span className="text-[10px] text-[#8D98A8] uppercase font-bold tracking-wider block mb-2 text-center">
              Quick Sign-In Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmployeeId('TL001');
                  setPassword('Admin@123');
                  setError(null);
                }}
                className="py-1.5 px-2 bg-[#111821] hover:bg-[#161F2B] border border-[#222B36] rounded text-[11px] text-[#F5F7FA] flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                <span>Team Leader</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmployeeId('CUST001');
                  setPassword('Admin@123');
                  setError(null);
                }}
                className="py-1.5 px-2 bg-[#111821] hover:bg-[#161F2B] border border-[#222B36] rounded text-[11px] text-[#F5F7FA] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Building2 className="w-3 h-3 text-cyan-400" />
                <span>Customer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-[10px] text-[#8D98A8] font-code space-y-0.5">
          <div>EMS Backend: <span className="text-[#F5F7FA]">erp-backend-1-02lc.onrender.com</span></div>
          <div>Database: <span className="text-emerald-400">CockroachDB Connected ✓</span></div>
        </div>
      </div>
    </div>
  );
}
