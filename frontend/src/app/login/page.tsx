'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, Mail, Key, Eye, EyeOff, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/mock/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('rajesh.sharma@audit.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Auditor');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      login(email, selectedRole);
      router.push('/overview');
    }, 600);
  };

  const handleQuickRole = (role: UserRole, userEmail: string) => {
    setSelectedRole(role);
    setEmail(userEmail);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Bar */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-audit-blue flex items-center justify-center font-bold text-white shadow-md">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wide">
              AI PUBLIC PROCUREMENT AUDITOR
            </h1>
            <p className="text-2xs text-slate-400">National Forensic Audit & Compliance Portal</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-2xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>PORTAL SECURE 256-BIT SSL</span>
        </div>
      </header>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-8">
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 text-center">
            <div className="inline-flex p-2 rounded-full bg-navy-900 text-white mb-2 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Auditor Authentication</h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in with your government employee credentials or select a test role.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Role Persona Selector for Testing */}
            <div className="space-y-1">
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-600">
                Simulated Persona Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'Auditor' as UserRole, email: 'rajesh.sharma@audit.gov.in', label: 'Auditor' },
                  { role: 'Senior Auditor' as UserRole, email: 'sunita.deshmukh@audit.gov.in', label: 'Sr. Auditor' },
                  { role: 'Administrator' as UserRole, email: 'vikram.rao@gov.in', label: 'Admin' }
                ].map(item => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleQuickRole(item.role, item.email)}
                    className={`py-1.5 px-2 text-2xs font-medium rounded border text-center transition-all ${
                      selectedRole === item.role
                        ? 'bg-navy-900 text-white border-navy-900 font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email / Employee ID */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">Official Email or Employee ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. rajesh.sharma@audit.gov.in"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-navy-900 focus:border-navy-900 text-slate-900"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-700">Password / Token Key</label>
                <a href="#forgot" className="text-2xs text-audit-blue hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-9 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-navy-900 focus:border-navy-900 text-slate-900 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Session */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-navy-900 focus:ring-navy-900"
                />
                <span>Maintain active secure session</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 active:bg-navy-950 rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Secure Audit Workspace</span>
                </>
              )}
            </button>
          </form>

          {/* Official Footer Notice */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-2xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Official Notice & Access Terms:</p>
            <p className="leading-tight">
              Access to this system is restricted to authorized public audit officers. All queries, exports, and investigative actions are cryptographically logged in compliance with government auditing standards.
            </p>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="text-center text-2xs text-slate-500 space-y-1 max-w-3xl mx-auto">
        <p>© 2026 AI Public Procurement Auditor • Ministry of Finance & Vigilance Audit System</p>
        <p className="font-mono text-slate-600">MOCK ENVIRONMENT • NO REAL BACKEND CONNECTED</p>
      </footer>
    </div>
  );
}
