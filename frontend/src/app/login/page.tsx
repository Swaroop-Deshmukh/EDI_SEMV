'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Building,
  CheckCircle,
  ArrowRight,
  UserCheck,
  ChevronLeft,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole, MOCK_USERS } from '@/mock/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [userId, setUserId] = useState('SAUD-1092');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Senior Auditor');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'Senior Auditor') setUserId('SAUD-1092');
    else if (role === 'Auditor') setUserId('AUD-8842');
    else if (role === 'Administrator') setUserId('ADM-0041');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      login(userId, selectedRole);
      router.push('/overview');
    }, 400);
  };

  const handleSSOLogin = (role: UserRole, id: string) => {
    login(id, role);
    router.push('/overview');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Container matching the exact split mockup */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-slate-200">
        
        {/* LEFT BRANDING PANEL (Deep Navy with Glowing Shield) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#06172E] via-[#0B2545] to-[#041021] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,0.22),transparent_70%)] pointer-events-none" />

          {/* Top Emblem & Govt Headers */}
          <div className="relative z-10 text-center space-y-1.5">
            <div className="text-2xl">🏛️</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
              Government of India
            </div>
            <div className="text-[9px] text-slate-400">
              Central Vigilance Commission & Ministry of Finance
            </div>
          </div>

          {/* Center Hologram Shield */}
          <div className="relative z-10 my-8 text-center space-y-4">
            
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-2xl shadow-cyan-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#07192F] rounded-full flex items-center justify-center">
                <ShieldCheck className="w-12 h-12 text-cyan-400" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                AI Public Procurement Auditor
              </h2>
              <p className="text-2xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
                Secure Access to a Smarter, More Transparent Procurement Ecosystem
              </p>
            </div>
          </div>

          {/* Bottom Security Badges */}
          <div className="relative z-10 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400 pt-4 border-t border-white/10">
            <div className="space-y-1">
              <Shield className="w-4 h-4 text-emerald-400 mx-auto" />
              <div>Secure Login</div>
            </div>
            <div className="space-y-1">
              <Lock className="w-4 h-4 text-sky-400 mx-auto" />
              <div>Role-Based Access</div>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto" />
              <div>Government Trusted</div>
            </div>
          </div>
        </div>

        {/* RIGHT LOGIN FORM PANEL (Clean White Card) */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between bg-white">
          
          {/* Top Bar: Back to home & Language Switch */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/')}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Portal</span>
            </button>
            <button className="text-2xs font-semibold px-2 py-0.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50">
              हिन्दी
            </button>
          </div>

          {/* Header Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to your auditor workspace
            </p>
          </div>

          {/* Role Persona Selectors */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Select Simulated Role / Persona
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'Senior Auditor' as UserRole, label: 'Sr. Auditor' },
                { role: 'Auditor' as UserRole, label: 'Investigator' },
                { role: 'Administrator' as UserRole, label: 'Admin' }
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleRoleSelect(item.role)}
                  className={`py-1.5 px-2 text-2xs font-bold rounded-lg border text-center transition-all ${
                    selectedRole === item.role
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {error}
              </div>
            )}

            {/* User ID / Email */}
            <div className="space-y-1">
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-700">
                User ID / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your email or user ID"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-2xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-mono"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-2xs">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="text-blue-600 hover:underline font-semibold">
                Forgot Password?
              </a>
            </div>

            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-lg shadow-md shadow-blue-500/20 text-xs flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer disabled:opacity-75"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Verifying Session...' : 'Login'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
              <span className="bg-white px-2">OR</span>
            </div>
          </div>

          {/* Government SSO CTA */}
          <button
            onClick={() => handleSSOLogin('Senior Auditor', 'SAUD-1092')}
            className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>🏛️</span>
            <span>Login with Government SSO</span>
          </button>

          {/* Bottom Security Note */}
          <div className="text-center text-[10px] text-slate-400 mt-4">
            Only authorized users are allowed to access this system.
          </div>
        </div>
      </div>
    </div>
  );
}
