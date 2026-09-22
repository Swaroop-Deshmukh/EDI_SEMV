'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  Search,
  FileText,
  Building,
  MapPin,
  Tag,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  HelpCircle,
  FileCheck,
  Globe,
  RefreshCw,
  UserCheck,
  KeyRound,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole, MOCK_USERS } from '@/mock/auth';
import { MOCK_CONTRACTS } from '@/mock/contracts';

export default function HomePage() {
  const router = useRouter();
  const { login } = useAuth();

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: 'AI Public Procurement Auditor & Continuous Vigilance System',
      subtitle: 'Automated Anomaly Detection, XAI Risk Scoring & Collusion Detection for Central Public Sector Enterprises.',
      badge: 'GOVERNMENT OF INDIA • VIGILANCE DIRECTIVE 2026',
      bgGradient: 'from-[#0B1E36] via-[#103158] to-[#0A1A2F]',
      accentColor: 'text-amber-400',
      tag: 'Machine Learning & XAI Engine v2.4'
    },
    {
      title: 'Graph-Powered Collusion & Cartel Analytics',
      subtitle: 'Neo4j entity intelligence uncovering cross-directorships, shared vendor PAN/GSTIN addresses, and bid-rigging rings.',
      badge: 'ADVANCED FORENSIC NETWORK INTELLIGENCE',
      bgGradient: 'from-[#092240] via-[#0E3D59] to-[#091D33]',
      accentColor: 'text-cyan-400',
      tag: 'Graph Clustering & Network Forensics'
    },
    {
      title: 'Automated Multi-Page OCR Invoice Verification',
      subtitle: 'Line-item rate reconciliation against approved contract rate cards to eliminate inflated billings and ghost vendors.',
      badge: 'GFR 2017 & CVC COMPLIANCE SUITE',
      bgGradient: 'from-[#0D2818] via-[#04471C] to-[#072111]',
      accentColor: 'text-emerald-400',
      tag: 'OCR Line-Item Reconciliation'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Login form state
  const [selectedRole, setSelectedRole] = useState<UserRole>('Senior Auditor');
  const [officerId, setOfficerId] = useState('SAUD-1092');
  const [password, setPassword] = useState('••••••••');
  const [captchaInput, setCaptchaInput] = useState('7842');
  const [captchaCode, setCaptchaCode] = useState('7842');
  const [loginError, setLoginError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Filter state
  const [activeTab, setActiveTab] = useState<'tenders' | 'corrigendum' | 'results'>('tenders');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'Senior Auditor') setOfficerId('SAUD-1092');
    else if (role === 'Auditor') setOfficerId('AUD-8842');
    else if (role === 'Administrator') setOfficerId('ADM-0041');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!officerId.trim()) {
      setLoginError('Please enter a valid Officer / Auditor ID');
      return;
    }
    if (captchaInput !== captchaCode) {
      setLoginError('Invalid security captcha code. Please re-enter.');
      return;
    }

    login(officerId, selectedRole);
    router.push('/overview');
  };

  const handleQuickLogin = (role: UserRole, id: string) => {
    setSelectedRole(role);
    setOfficerId(id);
    login(id, role);
    router.push('/overview');
  };

  const refreshCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(code);
    setCaptchaInput(code);
  };

  const filteredContracts = MOCK_CONTRACTS.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vendorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || c.procurementCategory === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Top Utility Ribbon (Govt Standard) */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-12 py-1 text-2xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-900 flex items-center gap-1">
            <Globe className="w-3 h-3 text-blue-700" /> भारत सरकार | Government of India
          </span>
          <span className="text-slate-300">|</span>
          <span className="hidden sm:inline text-slate-600">Central Vigilance Commission & Ministry of Finance</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#main-content" className="hover:text-blue-900">Skip To Main Content</a>
          <span>|</span>
          <span className="hover:text-blue-900 cursor-pointer">Screen Reader Access</span>
          <span>|</span>
          <div className="flex items-center gap-1 font-mono text-slate-600">
            <span className="hover:text-black cursor-pointer">A-</span>
            <span className="hover:text-black cursor-pointer font-bold text-slate-900">A</span>
            <span className="hover:text-black cursor-pointer">A+</span>
          </div>
          <span>|</span>
          <span className="font-bold text-blue-900 cursor-pointer">हिन्दी</span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-slate-900">Eng</span>
        </div>
      </div>

      {/* Main Official Header (MOIL / National Enterprise Style) */}
      <header className="bg-white px-4 md:px-12 py-3 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Organization Seal & Brand */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-indigo-950 text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-amber-400">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-xl font-bold text-slate-950 tracking-tight font-serif">
                  AI PUBLIC PROCUREMENT AUDITOR
                </h1>
                <span className="hidden md:inline text-[10px] bg-blue-100 text-blue-900 border border-blue-200 font-bold px-1.5 py-0.2 rounded uppercase">
                  A Govt. of India Portal
                </span>
              </div>
              <p className="text-2xs text-slate-600 font-medium">
                National Continuous Audit & Anti-Corruption Intelligence Portal • <span className="font-semibold text-blue-900">Adding Integrity to Public Funds</span>
              </p>
            </div>
          </div>

          {/* Center: Emblem */}
          <div className="hidden lg:flex flex-col items-center justify-center text-center px-4">
            <div className="text-2xl font-serif text-slate-800 leading-none">🏛️</div>
            <span className="text-[8px] uppercase tracking-widest font-serif font-bold text-slate-700 mt-1">सत्यमेव जयते</span>
          </div>

          {/* Right: Quick Login Button & Emergency Whistleblower */}
          <div className="flex items-center gap-3">
            <a
              href="#login-portal"
              className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Officer / Auditor Login</span>
            </a>
          </div>
        </div>
      </header>

      {/* Navigation Menu Bar (MOIL Clean Style) */}
      <nav className="bg-[#0D3B66] text-white px-4 md:px-12 py-2 text-xs font-medium shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="text-amber-300 font-bold border-b-2 border-amber-400 pb-0.5">
              Home (मुख्य पृष्ठ)
            </a>
            <a href="#about" className="text-slate-200 hover:text-white transition-colors">
              About Auditor (हमारे बारे में)
            </a>
            <a href="#tenders" className="text-slate-200 hover:text-white transition-colors">
              Tenders & RFPs (निविदाएं)
            </a>
            <a href="#vigilance" className="text-slate-200 hover:text-white transition-colors">
              Vigilance & XAI (सतर्कता)
            </a>
            <a href="#analytics" className="text-slate-200 hover:text-white transition-colors">
              Network Analytics (डिजिटल बदलाव)
            </a>
            <a href="#login-portal" className="text-amber-400 font-bold hover:text-amber-300 transition-colors">
              Officer Portal (अधिकारी लॉगिन)
            </a>
          </div>

          <div className="hidden md:flex items-center gap-2 text-2xs text-blue-200">
            <span>ISO 27001:2022 Certified</span>
          </div>
        </div>
      </nav>

      {/* Grand Hero Banner Carousel (MOIL style slide banner) */}
      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-12 pt-4 pb-2">
        <div className={`relative w-full rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r ${slides[currentSlide].bgGradient} text-white min-h-[340px] md:min-h-[400px] flex flex-col justify-between p-6 md:p-12 transition-all duration-700`}>
          
          {/* Top Badge */}
          <div className="flex items-center justify-between">
            <span className="text-2xs font-mono font-bold tracking-widest uppercase bg-white/10 text-slate-200 border border-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
              {slides[currentSlide].badge}
            </span>
            <span className="text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full">
              {slides[currentSlide].tag}
            </span>
          </div>

          {/* Center Banner Content */}
          <div className="max-w-3xl space-y-4 my-auto py-4">
            <h2 className="text-2xl md:text-4xl font-bold font-serif tracking-tight leading-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#login-portal"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs md:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Shield className="w-4 h-4" />
                <span>Enter Auditor Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#tenders"
                className="bg-white/15 hover:bg-white/25 text-white font-semibold px-5 py-2.5 rounded-lg text-xs md:text-sm border border-white/30 backdrop-blur-xs transition-colors"
              >
                Browse Public Tenders
              </a>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Notice Ribbon (MOIL style `>>` ribbon) */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-12 py-2">
        <div className="bg-[#0B1E36] text-white px-4 py-2 rounded-lg flex items-center gap-3 text-xs shadow-md border-l-4 border-amber-400 overflow-hidden">
          <span className="font-bold text-amber-400 flex items-center gap-1 shrink-0 font-mono text-2xs uppercase tracking-wider">
            &gt;&gt; Live Circulars &gt;&gt;
          </span>
          <div className="overflow-hidden whitespace-nowrap text-2xs md:text-xs text-slate-200">
            <span className="inline-block">
              📢 <strong>CVC Vigilance Advisory:</strong> Continuous Machine Learning Risk Screening is active for 34,232 Central Tenders. &gt;&gt; Mandatory PAN-GSTIN linkage verification under GFR Rule 144(xi). &gt;&gt; Automated OCR Line-Item Discrepancy Auditing Enabled.
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-12 py-6 space-y-8 flex-1" id="main-content">
        
        {/* SECTION 1: OFFICER LOGIN PORTAL & LIVE METRICS (Side-by-Side & Spacious) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="login-portal">
          
          {/* LEFT: OFFICER & AUDITOR LOGIN CARD (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-blue-900 shadow-xl overflow-hidden">
            
            {/* Login Card Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 text-white p-5 text-center">
              <div className="w-11 h-11 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold uppercase tracking-wider">Officer & Auditor Portal</h3>
              <p className="text-2xs text-blue-200 mt-0.5">Government Employee Single Sign-On (SSO)</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs">
              {loginError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-2xs rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* 1. Role Selection */}
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  1. Select Official Role / Persona
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="Senior Auditor">Senior Auditor (Central Vigilance Cell)</option>
                  <option value="Auditor">Fraud Investigator / Field Auditor</option>
                  <option value="Administrator">System Security Administrator</option>
                </select>
              </div>

              {/* 2. Official ID Input */}
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  2. Official ID / Employee Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    placeholder="e.g. SAUD-1092 or AUD-8842"
                    required
                    className="w-full text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 3. Password */}
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  3. Security Passcode / Token
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter token"
                  required
                  className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              {/* 4. Captcha Code */}
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  4. Security Captcha
                </label>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-200 border border-slate-400 px-4 py-2 font-mono font-extrabold text-sm tracking-widest text-slate-800 rounded-lg select-none shadow-inner">
                    {captchaCode}
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg"
                    title="Refresh Captcha"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    maxLength={4}
                    className="flex-1 text-center font-mono font-bold text-xs bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-3 px-4 rounded-lg shadow-md text-xs flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Sign In to Audit Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            {/* 1-Click Fast Persona Switcher (For Demo & Testing) */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">
                ⚡ 1-Click Fast Demo Login
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleQuickLogin('Senior Auditor', 'SAUD-1092')}
                  className="w-full px-3 py-2 text-left bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 flex items-center justify-between shadow-2xs hover:border-blue-300"
                >
                  <span className="font-semibold text-blue-950">🛡️ Dr. Sunita Deshmukh (Sr. Auditor)</span>
                  <span className="font-mono text-slate-500 text-2xs bg-slate-100 px-1.5 py-0.5 rounded">SAUD-1092</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('Auditor', 'AUD-8842')}
                  className="w-full px-3 py-2 text-left bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 flex items-center justify-between shadow-2xs hover:border-blue-300"
                >
                  <span className="font-semibold text-blue-950">🔍 Rajesh Sharma (Auditor / Field)</span>
                  <span className="font-mono text-slate-500 text-2xs bg-slate-100 px-1.5 py-0.5 rounded">AUD-8842</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('Administrator', 'ADM-0041')}
                  className="w-full px-3 py-2 text-left bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 flex items-center justify-between shadow-2xs hover:border-blue-300"
                >
                  <span className="font-semibold text-blue-950">⚡ Vikramaditya Rao (Admin)</span>
                  <span className="font-mono text-slate-500 text-2xs bg-slate-100 px-1.5 py-0.5 rounded">ADM-0041</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE SYSTEM AUDIT METRICS & SUMMARY (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Overview Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Continuous Integrity Intelligence</span>
              </div>
              <h3 className="text-xl font-bold text-slate-950 font-serif">
                National Public Procurement Oversight Architecture
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The AI Public Procurement Auditor operates automated continuous auditing across all procurement stages—from RFP release and bidder evaluation to contract award and multi-page invoice clearance.
              </p>

              {/* 4 Clean Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-slate-900 font-mono">34,232</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Tenders Screened</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-emerald-700 font-mono">₹2.4L Cr</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Monitored Funds</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-blue-900 font-mono">99.4%</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Fair Competition</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-red-600 font-mono">128</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Active Dossiers</div>
                </div>
              </div>
            </div>

            {/* 3 Core System Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold mb-2">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">ML Risk Scoring</h4>
                <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
                  Trained anomaly models evaluating bid variance, timing clusters, and single-bidder rate spikes.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold mb-2">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Neo4j Network Graph</h4>
                <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
                  Entity relationship graph exposing shared directors, shadow addresses, and rotational cover bidding.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold mb-2">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">OCR Bill Forensics</h4>
                <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
                  Automated verification comparing invoice line-items against contract BOQ rate schedules.
                </p>
              </div>
            </div>

            {/* Public Grievance Box */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Central Vigilance Whistleblower Portal</span>
                </h4>
                <p className="text-2xs text-amber-800 mt-0.5">
                  Securely submit anonymous intelligence on public tender cartels or vendor collusion.
                </p>
              </div>
              <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded text-2xs shrink-0 shadow-xs">
                Submit Report
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: PUBLIC TENDERS & BIDDING SCHEDULE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden" id="tenders">
          
          {/* Table Header Bar */}
          <div className="bg-[#0D3B66] text-white px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Central Public Tenders & Published Contracts Schedule</span>
              </h3>
              <p className="text-2xs text-blue-200 mt-0.5">
                Real-time transparency registry with continuous AI integrity tags
              </p>
            </div>

            <div className="flex items-center gap-1 bg-black/25 p-1 rounded-lg text-2xs">
              <button
                onClick={() => setActiveTab('tenders')}
                className={`px-3 py-1 rounded font-medium transition-colors ${activeTab === 'tenders' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-200 hover:text-white'}`}
              >
                Active Tenders
              </button>
              <button
                onClick={() => setActiveTab('corrigendum')}
                className={`px-3 py-1 rounded font-medium transition-colors ${activeTab === 'corrigendum' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-200 hover:text-white'}`}
              >
                Corrigenda
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-3 py-1 rounded font-medium transition-colors ${activeTab === 'results' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-200 hover:text-white'}`}
              >
                Awarded Contracts
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by Reference No, Title, Buyer Department or Vendor..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-hidden text-slate-800"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              <option value="Works">Civil Works</option>
              <option value="Goods">Goods & Supplies</option>
              <option value="Services">IT & Services</option>
            </select>
          </div>

          {/* Tender Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-2xs uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Tender Title & Reference</th>
                  <th className="py-3 px-4">Department / Buyer</th>
                  <th className="py-3 px-4">Closing Date</th>
                  <th className="py-3 px-4 text-right">Value (₹)</th>
                  <th className="py-3 px-4 text-center">AI Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {filteredContracts.slice(0, 6).map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-blue-950 hover:underline cursor-pointer line-clamp-1">
                        {c.title}
                      </div>
                      <div className="text-2xs font-mono text-slate-500 mt-0.5">
                        Ref: {c.contractNumber} • ID: {c.id}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900 font-semibold text-2xs">{c.buyerName}</div>
                      <div className="text-[11px] text-slate-500">{c.department}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-2xs font-mono text-slate-600">
                      {c.awardDate} 15:00 IST
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold text-slate-900 text-2xs">
                      ₹{(c.contractValue / 10000000).toFixed(2)} Cr
                    </td>
                    <td className="py-3 px-4 text-center">
                      {c.riskLevel === 'LOW' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Certified Clear
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-700" /> AI Screened
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-2xs text-slate-600">
            Showing 6 of {filteredContracts.length} published procurement notices. Complete historical archives available via authenticated Officer Portal.
          </div>
        </div>
      </main>

      {/* Official MOIL / Government Footer */}
      <footer className="bg-[#0B1E36] text-slate-300 text-2xs border-t-4 border-amber-500 mt-12 py-8 px-4 md:px-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 font-serif">
                AI Public Procurement Auditor
              </h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                A flagship national e-governance initiative dedicated to algorithmic fairness, tender transparency, and continuous risk monitoring.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 font-serif">
                Compliance Standards
              </h4>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li>• General Financial Rules (GFR) 2017</li>
                <li>• Central Vigilance Commission Directives</li>
                <li>• Explainable AI (XAI) Model Auditing</li>
                <li>• Cryptographic Immutable Trail</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 font-serif">
                National Portals
              </h4>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li>• Central Public Procurement Portal (CPPP)</li>
                <li>• Government eMarketplace (GeM)</li>
                <li>• National Informatics Centre (NIC)</li>
                <li>• Controller General of Accounts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 font-serif">
                Vigilance Helpdesk
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Toll Free: 1800 111 555<br />
                Email: vigilance-audit@gov.in<br />
                New Delhi - 110001
              </p>
            </div>
          </div>

          <div className="border-t border-slate-700/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-400 gap-2">
            <div>
              © 2026 Government of India • National AI Public Procurement Auditor Portal
            </div>
            <div className="flex items-center gap-3">
              <span>Security Classification: OFFICIAL USE ONLY</span>
              <span>•</span>
              <span>Audit Engine: Active</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
