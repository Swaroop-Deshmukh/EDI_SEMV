'use client';

import React, { useState } from 'react';
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
  BarChart3,
  HelpCircle,
  FileCheck,
  Globe,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/mock/auth';
import { MOCK_CONTRACTS } from '@/mock/contracts';

export default function HomePage() {
  const router = useRouter();
  const { login } = useAuth();

  // Login form state
  const [selectedRole, setSelectedRole] = useState<UserRole>('Senior Auditor');
  const [officerId, setOfficerId] = useState('SAUD-1092');
  const [password, setPassword] = useState('••••••••');
  const [captchaInput, setCaptchaInput] = useState('7842');
  const [captchaCode, setCaptchaCode] = useState('7842');
  const [loginError, setLoginError] = useState('');

  // Tender search/filter state
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
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col selection:bg-blue-900 selection:text-white">
      {/* Top Accessibility & Language Bar */}
      <div className="bg-slate-900 text-slate-300 text-2xs px-4 py-1 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-200 flex items-center gap-1">
            <Globe className="w-3 h-3 text-blue-400" /> भारत सरकार | Government of India
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">Central Vigilance & eProcurement Audit Directorate</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="hover:text-white transition-colors">Screen Reader Access</button>
          <span>|</span>
          <div className="flex items-center gap-1 font-mono text-slate-400">
            <span className="hover:text-white cursor-pointer">A-</span>
            <span className="hover:text-white cursor-pointer font-bold text-white">A</span>
            <span className="hover:text-white cursor-pointer">A+</span>
          </div>
          <span>|</span>
          <span className="text-amber-400 font-medium">English</span>
          <span>|</span>
          <span className="text-slate-400">22-Sep-2026 13:15 IST</span>
        </div>
      </div>

      {/* Main Government Banner Header */}
      <header className="bg-gradient-to-r from-[#072448] via-[#0D3B66] to-[#072448] text-white px-4 md:px-8 py-4 shadow-md border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Emblem & Portal Title */}
          <div className="flex items-center gap-4">
            {/* National Emblem Representation */}
            <div className="w-12 h-14 bg-amber-500/10 border border-amber-400/40 rounded flex flex-col items-center justify-center p-1 text-center shrink-0 shadow-inner">
              <Shield className="w-7 h-7 text-amber-400" />
              <span className="text-[7px] uppercase tracking-widest font-serif font-bold text-amber-300 mt-0.5">सत्यमेव जयते</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-bold tracking-wider text-amber-400 uppercase bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                  GeM - CPPP & AI Vigilance
                </span>
                <span className="text-2xs bg-blue-500/20 text-blue-200 border border-blue-400/30 px-1.5 py-0.5 rounded font-mono">
                  v2.4 Audit Engine
                </span>
              </div>
              <h1 className="text-lg md:text-2xl font-serif font-bold tracking-wide text-white mt-0.5">
                Government eMarketplace - Central Public Procurement Portal
              </h1>
              <p className="text-2xs md:text-xs text-slate-300 font-medium">
                Continuous AI-Assisted Audit, Risk Scoring & Collusion Detection for Central Public Sector Enterprises
              </p>
            </div>
          </div>

          {/* Quick Header Badges */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right border-r border-slate-700 pr-3">
              <div className="text-2xs text-slate-300">Tenders Under Audit</div>
              <div className="text-base font-bold text-amber-400 font-mono">34,232 Active</div>
            </div>
            <div className="text-right">
              <div className="text-2xs text-slate-300">Monitored Procurement</div>
              <div className="text-base font-bold text-emerald-400 font-mono">₹2,42,850 Cr</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Ribbon */}
      <nav className="bg-[#0b1b2b] text-slate-200 px-4 md:px-8 py-2 text-xs border-b border-slate-700 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 font-medium">
            <a href="#tenders" className="hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold text-white">
              <span>Search Tenders</span>
            </a>
            <span className="text-slate-600">|</span>
            <a href="#tenders" className="hover:text-amber-400 transition-colors">Active Tenders</a>
            <span className="text-slate-600">|</span>
            <a href="#tenders" className="hover:text-amber-400 transition-colors">Tenders by Closing Date</a>
            <span className="text-slate-600">|</span>
            <a href="#tenders" className="hover:text-amber-400 transition-colors">Corrigendum</a>
            <span className="text-slate-600">|</span>
            <a href="#tenders" className="hover:text-amber-400 transition-colors">Results of Tenders</a>
            <span className="text-slate-600">|</span>
            <a href="#mis" className="hover:text-amber-400 transition-colors text-amber-300">Vigilance Directives</a>
          </div>
          <div className="flex items-center gap-3 text-2xs text-slate-400">
            <a href="#" className="hover:text-white">Home</a>
            <span>•</span>
            <a href="#" className="hover:text-white">Contact Us</a>
            <span>•</span>
            <a href="#" className="hover:text-white">SiteMap</a>
          </div>
        </div>
      </nav>

      {/* Live Notice Marquee Ticker */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center gap-3 text-xs text-amber-900">
        <span className="bg-red-600 text-white font-bold text-2xs px-2 py-0.5 rounded uppercase tracking-wider shrink-0 animate-pulse">
          Latest Circular
        </span>
        <div className="overflow-hidden whitespace-nowrap text-2xs font-medium">
          <span className="inline-block">
            📢 <strong>CVC Advisory 09/2026:</strong> Automated Machine Learning Red Flag Scoring enabled for all High-Value Central Tenders exceeding ₹10 Crore. • OCR Invoice Line-Item Discrepancy Verification is mandatory under GFR Rule 144(xi). • Next scheduled Forensic Audit Cycle commences 01-Oct-2026.
          </span>
        </div>
      </div>

      {/* Main 3-Column Content Body */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Government Service Modules */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded border border-slate-300 shadow-xs overflow-hidden">
              <div className="bg-[#0D3B66] text-white px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                <span>eProcurement Modules</span>
              </div>
              <div className="p-2 space-y-1.5">
                {[
                  { label: 'MIS & Audit Reports', icon: BarChart3, badge: 'Live' },
                  { label: 'Tenders by Location', icon: MapPin },
                  { label: 'Tenders by Organisation', icon: Building },
                  { label: 'Tenders by Classification', icon: Tag },
                  { label: 'Debarred / Suspended Entities', icon: AlertTriangle, badge: 'Updated' },
                  { label: 'CVC Vigilance Guidelines', icon: FileCheck },
                  { label: 'Public Grievance Redressal', icon: HelpCircle },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      className="w-full text-left px-3 py-2 rounded bg-slate-50 hover:bg-blue-50/80 hover:text-blue-900 border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-700" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CPPP Dashboard & Mobile App Badges */}
            <div className="bg-white rounded border border-slate-300 p-3 shadow-xs space-y-3">
              <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
                Official Access Portals
              </div>
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-2.5 rounded text-center flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">CPPP Public Dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-2xs">
                <div className="bg-slate-100 border border-slate-200 p-2 rounded text-center font-medium text-slate-700 hover:bg-slate-200 cursor-pointer">
                  Google Play
                </div>
                <div className="bg-slate-100 border border-slate-200 p-2 rounded text-center font-medium text-slate-700 hover:bg-slate-200 cursor-pointer">
                  App Store
                </div>
              </div>
            </div>

            {/* Direct Helpline & Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-2xs text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-700" />
                <span>Auditor Security Notice</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                All investigative audit transactions and dossier views are cryptographically logged under CVC Guideline 14/2026.
              </p>
            </div>
          </div>

          {/* CENTER COLUMN: Welcome & Public Tender Listings */}
          <div className="lg:col-span-6 space-y-4" id="tenders">
            
            {/* Welcome & System Summary Card */}
            <div className="bg-white rounded border border-slate-300 p-4 shadow-xs">
              <div className="border-b border-slate-200 pb-2 mb-3">
                <h2 className="text-base font-bold text-[#0D3B66]">
                  Welcome to AI-Powered eProcurement & Public Audit System
                </h2>
                <p className="text-2xs text-slate-600 mt-1 leading-relaxed">
                  The Central Public Procurement Auditor integrates automated machine learning risk scoring, OCR invoice verification, and Neo4j network collusion analytics to ensure complete transparency across all government contracts.
                </p>
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="border-r border-slate-200 pr-2">
                  <div className="text-xs font-bold text-slate-900 font-mono">34,232</div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Tenders Screened</div>
                </div>
                <div className="border-r border-slate-200 pr-2">
                  <div className="text-xs font-bold text-emerald-700 font-mono">99.4%</div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Integrity Index</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-red-600 font-mono">128 Cases</div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Vigilance Dossiers</div>
                </div>
              </div>
            </div>

            {/* Latest Tenders Table Container */}
            <div className="bg-white rounded border border-slate-300 shadow-xs overflow-hidden">
              
              {/* Table Header / Tab Switcher */}
              <div className="bg-[#0D3B66] text-white px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Latest Tenders & Bidding Schedule</span>
                </div>
                <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded text-2xs">
                  <button
                    onClick={() => setActiveTab('tenders')}
                    className={`px-2 py-0.5 rounded font-medium transition-colors ${activeTab === 'tenders' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
                  >
                    Active RFPs
                  </button>
                  <button
                    onClick={() => setActiveTab('corrigendum')}
                    className={`px-2 py-0.5 rounded font-medium transition-colors ${activeTab === 'corrigendum' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
                  >
                    Corrigenda
                  </button>
                  <button
                    onClick={() => setActiveTab('results')}
                    className={`px-2 py-0.5 rounded font-medium transition-colors ${activeTab === 'results' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
                  >
                    Awarded
                  </button>
                </div>
              </div>

              {/* Search and Category Filter Bar */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by Reference No, Title, Buyer or Vendor..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-600 text-slate-800"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-700 focus:outline-hidden"
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
                    <tr className="bg-slate-100 text-slate-700 text-2xs uppercase tracking-wider font-semibold border-b border-slate-200">
                      <th className="py-2 px-3">Tender Title & Ref No</th>
                      <th className="py-2 px-3">Department / Buyer</th>
                      <th className="py-2 px-3">Closing Date</th>
                      <th className="py-2 px-3 text-right">Value (₹)</th>
                      <th className="py-2 px-3 text-center">AI Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans">
                    {filteredContracts.slice(0, 6).map((c) => (
                      <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-blue-900 line-clamp-1 hover:underline cursor-pointer">
                            {c.title}
                          </div>
                          <div className="text-2xs font-mono text-slate-500 mt-0.5">
                            Ref: {c.contractNumber} • {c.id}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="text-slate-800 font-medium text-2xs">{c.buyerName}</div>
                          <div className="text-[10px] text-slate-500">{c.department}</div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-2xs font-mono text-slate-600">
                          {c.awardDate} 15:00 IST
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-semibold text-slate-900 text-2xs">
                          ₹{(c.contractValue / 10000000).toFixed(2)} Cr
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {c.riskLevel === 'LOW' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Certified Clear
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                              <AlertTriangle className="w-2.5 h-2.5" /> AI Audited
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Link */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                <span className="text-2xs text-slate-600">
                  Showing 6 of {filteredContracts.length} available notices. Complete archive accessible via Officer Portal.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Officer & Auditor Secure Login */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* OFFICIAL LOGIN CARD */}
            <div className="bg-white rounded border-2 border-[#0D3B66] shadow-md overflow-hidden">
              
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#072448] to-[#0D3B66] text-white p-3.5 text-center">
                <div className="w-9 h-9 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Officer & Auditor Login</h3>
                <p className="text-[11px] text-slate-300 mt-0.5">Authorized Government Personnel Only</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="p-4 space-y-3.5 text-xs">
                
                {loginError && (
                  <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-2xs rounded flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* 1. Role Selection */}
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Select Official Role / Persona
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
                  >
                    <option value="Senior Auditor">Senior Auditor (Vigilance Cell)</option>
                    <option value="Auditor">Fraud Investigator / Auditor</option>
                    <option value="Administrator">System Security Administrator</option>
                  </select>
                </div>

                {/* 2. Official ID Input */}
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Official ID / Employee Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      placeholder="e.g. SAUD-1092 or AUD-8842"
                      required
                      className="w-full text-xs font-mono font-bold bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* 3. Password / PIN */}
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Security Passcode / Token
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security token"
                    required
                    className="w-full text-xs font-mono bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-900 focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                {/* 4. Captcha Code */}
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Security Captcha Verification
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-200 border border-slate-400 px-3 py-1 font-mono font-extrabold text-sm tracking-widest text-slate-800 rounded select-none shadow-inner">
                      {captchaCode}
                    </div>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded"
                      title="Refresh Captcha"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="text"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      maxLength={4}
                      className="w-20 text-center font-mono font-bold text-xs bg-white border border-slate-300 rounded py-1 text-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold py-2 px-4 rounded shadow-sm text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign In to Audit Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* 1-Click Fast Persona Switcher (For Demo & Testing) */}
              <div className="bg-slate-50 border-t border-slate-200 p-3 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">
                  ⚡ 1-Click Fast Demo Login
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    onClick={() => handleQuickLogin('Senior Auditor', 'SAUD-1092')}
                    className="w-full px-2 py-1 text-left bg-white hover:bg-blue-50 border border-slate-200 rounded text-2xs font-medium text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>🛡️ Dr. Sunita (Senior Auditor)</span>
                    <span className="font-mono text-slate-400 text-[10px]">SAUD-1092</span>
                  </button>
                  <button
                    onClick={() => handleQuickLogin('Auditor', 'AUD-8842')}
                    className="w-full px-2 py-1 text-left bg-white hover:bg-blue-50 border border-slate-200 rounded text-2xs font-medium text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>🔍 Rajesh Sharma (Auditor)</span>
                    <span className="font-mono text-slate-400 text-[10px]">AUD-8842</span>
                  </button>
                  <button
                    onClick={() => handleQuickLogin('Administrator', 'ADM-0041')}
                    className="w-full px-2 py-1 text-left bg-white hover:bg-blue-50 border border-slate-200 rounded text-2xs font-medium text-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>⚡ Vikramaditya Rao (Admin)</span>
                    <span className="font-mono text-slate-400 text-[10px]">ADM-0041</span>
                  </button>
                </div>
              </div>

              {/* Portal Utility Links */}
              <div className="bg-slate-100 p-3 text-2xs text-slate-600 space-y-1.5 border-t border-slate-200">
                <div className="flex items-center justify-between hover:text-blue-900 cursor-pointer">
                  <span>• Online Bidder Enrollment</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </div>
                <div className="flex items-center justify-between hover:text-blue-900 cursor-pointer">
                  <span>• Generate / Forgot Digital Token?</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </div>
                <div className="flex items-center justify-between hover:text-blue-900 cursor-pointer">
                  <span>• Find My Nodal Vigilance Officer</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Whistleblower Quick Box */}
            <div className="bg-amber-50 border border-amber-300 rounded p-3 text-xs text-amber-900 shadow-2xs">
              <div className="font-bold flex items-center gap-1 text-2xs uppercase tracking-wider text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Confidential Whistleblower Portal</span>
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                Report suspicious bidding behavior, shell vendor cartels, or procurement irregularities securely.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights Row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
            <div className="w-7 h-7 bg-blue-100 text-blue-800 rounded flex items-center justify-center font-bold text-xs mb-2">
              01
            </div>
            <h4 className="text-xs font-bold text-slate-900">Continuous AI Risk Scoring</h4>
            <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
              Real-time anomaly detection screening tenders for pricing spikes, bid distribution, and suspicious timing.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
            <div className="w-7 h-7 bg-indigo-100 text-indigo-800 rounded flex items-center justify-center font-bold text-xs mb-2">
              02
            </div>
            <h4 className="text-xs font-bold text-slate-900">Network & Collusion Graph</h4>
            <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
              Neo4j graph clustering exposes common directorships, shared PAN/GSTIN addresses, and rotational cover bidding.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
            <div className="w-7 h-7 bg-emerald-100 text-emerald-800 rounded flex items-center justify-center font-bold text-xs mb-2">
              03
            </div>
            <h4 className="text-xs font-bold text-slate-900">Automated OCR Invoice Audit</h4>
            <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
              Multi-page bill processing reconciles itemized prices against original tender rate sheets to prevent overbilling.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded border border-slate-200 shadow-2xs">
            <div className="w-7 h-7 bg-amber-100 text-amber-800 rounded flex items-center justify-center font-bold text-xs mb-2">
              04
            </div>
            <h4 className="text-xs font-bold text-slate-900">Explainable AI (XAI) SHAP</h4>
            <p className="text-2xs text-slate-500 mt-1 leading-relaxed">
              Every flagged risk score provides transparent factor contribution breakdowns for judicial audit dossiers.
            </p>
          </div>
        </div>
      </main>

      {/* Official Government Portal Footer */}
      <footer className="bg-[#071E3D] text-slate-300 text-2xs border-t-4 border-amber-500 mt-12 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">About eProcurement Auditor</div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                An automated continuous auditing and anti-corruption intelligence framework for Central Public Sector Enterprises, Ministry of Finance, and National e-Governance Division.
              </p>
            </div>
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">Compliance & Policies</div>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li>• General Financial Rules (GFR) 2017</li>
                <li>• Central Vigilance Commission (CVC) Directives</li>
                <li>• Public Procurement (Preference to Make in India)</li>
                <li>• Digital Security & Cryptographic Audit Logs</li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">Quick Navigation</div>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li>• Central Public Procurement Portal (CPPP)</li>
                <li>• Government eMarketplace (GeM)</li>
                <li>• National Informatics Centre (NIC)</li>
                <li>• Controller General of Accounts (CGA)</li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">Portal Helpdesk</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Toll Free: 1800 111 555<br />
                Vigilance Desk: vigilance-procure@gov.in<br />
                Audit Directorate, New Delhi - 110001
              </p>
            </div>
          </div>

          <div className="border-t border-slate-700/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-400 gap-2">
            <div>
              © 2026 Government of India. Designed & Developed for AI-Assisted Public Procurement Auditing.
            </div>
            <div className="flex items-center gap-3">
              <span>Security Level: RESTRICTED</span>
              <span>•</span>
              <span>Last Audit Engine Sync: 22-Sep-2026 13:15 IST</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
