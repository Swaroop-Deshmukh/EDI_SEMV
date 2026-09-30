'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Search,
  FileText,
  Building,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Globe,
  Brain,
  ShieldCheck,
  Share2,
  Lock,
  ArrowRight,
  FileSpreadsheet,
  Users,
  Clock,
  Megaphone,
  Sparkles,
  User,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MOCK_CONTRACTS } from '@/mock/contracts';

export default function HomePage() {
  const router = useRouter();

  // Search & Filter for Tenders Section
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. TOP NAVBAR (Matching Mockup) */}
      <nav className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-2xs">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-xs md:text-sm text-slate-900 tracking-tight leading-tight uppercase font-sans">
              AI PUBLIC PROCUREMENT AUDITOR
            </div>
            <div className="text-[10px] text-slate-500 font-medium leading-tight">
              Government of India <span className="text-slate-300">|</span> CVC
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-0.5 font-bold">
            Home
          </a>
          <a href="#about" className="hover:text-blue-600 transition-colors">
            About
          </a>
          <a href="#features" className="hover:text-blue-600 transition-colors">
            Features
          </a>
          <a href="#tenders" className="hover:text-blue-600 transition-colors">
            Tenders & RFPs
          </a>
          <a href="#vigilance" className="hover:text-blue-600 transition-colors">
            Vigilance & XAI
          </a>
          <a href="#analytics" className="hover:text-blue-600 transition-colors">
            Analytics
          </a>
          <a href="#help" className="hover:text-blue-600 transition-colors">
            Help
          </a>
        </div>

        {/* Right Actions: Language & Login */}
        <div className="flex items-center gap-3">
          <button className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors">
            हिन्दी
          </button>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all hover:shadow cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
        </div>
      </nav>

      {/* 2. FULL-WIDTH PANORAMIC HERO SECTION (Covering First-Look Area) */}
      <section className="relative overflow-hidden bg-[#0A1E38] text-white min-h-[460px] md:min-h-[520px] flex items-center px-4 md:px-12 border-b border-blue-900/50">
        
        {/* Panoramic Background Architecture Layer (Rashtrapati Bhavan / Parliament Neoclassical Dome Motif) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 600' width='1440' height='600'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231E3A8A' stop-opacity='0.4'/%3E%3Cstop offset='100%25' stop-color='%230F172A' stop-opacity='0.8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1440' height='600' fill='url(%23grad)'/%3E%3C!-- Central Parliament Dome Silhouette --%3E%3Cpath d='M720 120 C 650 120, 600 180, 600 240 L 840 240 C 840 180, 790 120, 720 120 Z' fill='%2394A3B8' opacity='0.35'/%3E%3Crect x='705' y='60' width='30' height='60' fill='%2394A3B8' opacity='0.4'/%3E%3Cpolygon points='720,20 705,60 735,60' fill='%23F59E0B' opacity='0.7'/%3E%3C!-- Grand Colonnade Base --%3E%3Crect x='480' y='240' width='480' height='120' fill='%2364748B' opacity='0.25'/%3E%3C!-- Pillars --%3E%3Cg fill='%23CBD5E1' opacity='0.3'%3E%3Crect x='510' y='260' width='14' height='100'/%3E%3Crect x='550' y='260' width='14' height='100'/%3E%3Crect x='590' y='260' width='14' height='100'/%3E%3Crect x='630' y='260' width='14' height='100'/%3E%3Crect x='670' y='260' width='14' height='100'/%3E%3Crect x='710' y='260' width='14' height='100'/%3E%3Crect x='750' y='260' width='14' height='100'/%3E%3Crect x='790' y='260' width='14' height='100'/%3E%3Crect x='830' y='260' width='14' height='100'/%3E%3Crect x='870' y='260' width='14' height='100'/%3E%3Crect x='910' y='260' width='14' height='100'/%3E%3C/g%3E%3C!-- Extended Secretariat Wings --%3E%3Crect x='100' y='280' width='380' height='160' fill='%23475569' opacity='0.2'/%3E%3Crect x='960' y='280' width='380' height='160' fill='%23475569' opacity='0.2'/%3E%3C/svg%3E")`
          }}
        />

        {/* Cyber Neon Gradient Overlay & Digital Circuit Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#061830] via-[#0A2242]/90 to-[#041021]/95 pointer-events-none" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10 py-10">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.12] text-white">
                AI-Powered Oversight for <br />
                <span className="text-blue-400">
                  Transparent Public Procurement
                </span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-xl font-normal pt-2">
                Automated anomaly detection, XAI risk scoring and real-time vigilance to ensure integrity, fairness and efficiency in government tenders and public sector spending.
              </p>
            </div>

            {/* CTAs matching design */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-lg shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Enter Auditor Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#tenders"
                className="bg-slate-800/60 hover:bg-slate-800 text-white font-semibold text-xs md:text-sm px-6 py-3 rounded-lg border border-slate-600/60 backdrop-blur-xs transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-slate-300" />
                <span>Browse Public Tenders</span>
              </a>
            </div>
          </div>

          {/* Right Holographic AI Cyber Illustration (Matching image layout) */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[320px]">
            
            {/* Center Blueprint Document Hologram */}
            <div className="relative w-72 h-80 bg-gradient-to-b from-blue-900/40 to-slate-900/80 rounded-2xl border border-cyan-400/40 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden">
              
              {/* Document Header lines */}
              <div className="space-y-2 border-b border-cyan-400/20 pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 bg-cyan-400/40 rounded" />
                  <div className="h-2.5 w-10 bg-cyan-400/20 rounded" />
                </div>
                <div className="h-2 w-32 bg-cyan-400/20 rounded" />
              </div>

              {/* Center Magnifying Glass examining Shield */}
              <div className="my-auto flex items-center justify-center relative py-4">
                <div className="w-24 h-24 rounded-full bg-cyan-500/10 border-2 border-cyan-400/50 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <ShieldCheck className="w-12 h-12 text-cyan-400" />
                </div>
                {/* Magnifying glass handle representation */}
                <div className="absolute right-12 bottom-4 w-6 h-2 bg-cyan-400/60 rounded rotate-45" />
              </div>

              {/* Document Footer lines */}
              <div className="space-y-1.5 pt-2 border-t border-cyan-400/20">
                <div className="h-2 w-full bg-cyan-400/20 rounded" />
                <div className="h-2 w-3/4 bg-cyan-400/20 rounded" />
              </div>

              {/* Circuit Grid Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />
            </div>

            {/* Floating Holographic Badges (Positioned around document like mockup) */}
            
            {/* 1. Top Left: Fraud Detection */}
            <div className="absolute -top-3 -left-4 sm:left-2 bg-[#0C274A] border border-cyan-400/60 text-white px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="text-2xs font-bold tracking-wide">Fraud Detection</span>
            </div>

            {/* 2. Top Right: Risk Scoring */}
            <div className="absolute -top-3 -right-4 sm:right-2 bg-[#0C274A] border border-cyan-400/60 text-white px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2 backdrop-blur-md">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span className="text-2xs font-bold tracking-wide">Risk Scoring</span>
            </div>

            {/* 3. Bottom Left: XAI Explanations */}
            <div className="absolute -bottom-3 -left-4 sm:left-2 bg-[#0C274A] border border-cyan-400/60 text-white px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2 backdrop-blur-md">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-2xs font-bold tracking-wide">XAI Explanations</span>
            </div>

            {/* 4. Bottom Right: Real-time Monitoring */}
            <div className="absolute -bottom-3 -right-4 sm:right-2 bg-[#0C274A] border border-cyan-400/60 text-white px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2 backdrop-blur-md">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-2xs font-bold tracking-wide">Real-time Monitoring</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. METRICS RIBBON (Exact Match to Mockup) */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 md:px-12 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 border border-blue-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-slate-900 font-sans tracking-tight">27,001+</div>
              <div className="text-2xs text-slate-500 font-medium">Tenders Analyzed</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold shrink-0 border border-sky-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-slate-900 font-sans tracking-tight">12,842+</div>
              <div className="text-2xs text-slate-500 font-medium">Anomalies Detected</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0 border border-indigo-100">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-slate-900 font-sans tracking-tight">2,340+</div>
              <div className="text-2xs text-slate-500 font-medium">Departments Onboarded</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 border border-emerald-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-slate-900 font-sans tracking-tight">99.6%</div>
              <div className="text-2xs text-slate-500 font-medium">System Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY FEATURES SECTION (Exact Match to Mockup) */}
      <section className="py-16 px-4 md:px-12 bg-[#F8FAFC]" id="features">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center space-y-1.5 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Key Features
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Advanced AI and analytics to strengthen procurement governance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Anomaly Detection */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Anomaly Detection</h3>
              <p className="text-2xs text-slate-500 leading-relaxed">
                Identifies suspicious patterns in tenders, bids and payments using machine learning.
              </p>
            </div>

            {/* Card 2: XAI Risk Scoring */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">XAI Risk Scoring</h3>
              <p className="text-2xs text-slate-500 leading-relaxed">
                Explains risk factors with SHAP-based insights for transparent decisions.
              </p>
            </div>

            {/* Card 3: Continuous Vigilance */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Continuous Vigilance</h3>
              <p className="text-2xs text-slate-500 leading-relaxed">
                Monitors tenders and contracts in real-time for irregularities and red flags.
              </p>
            </div>

            {/* Card 4: Network Analytics */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Network Analytics</h3>
              <p className="text-2xs text-slate-500 leading-relaxed">
                Detects collusion and link relationships between entities and bidders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LATEST UPDATES RIBBON (Matching Mockup) */}
      <section className="bg-[#091D34] text-white px-4 md:px-12 py-3 border-t border-blue-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold shrink-0">
              <Megaphone className="w-4 h-4 text-blue-400" />
              <span>Latest Updates</span>
            </div>
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase shrink-0">
              NEW
            </span>
            <span className="text-slate-300 text-2xs truncate">
              CVC Vigilance Advisory: Continuous Machine Learning Risk Screening is active for 34,232 Central Tenders.
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 cursor-pointer" />
        </div>
      </section>

      {/* 6. PUBLIC TENDERS SECTION (Fully Scrollable Table) */}
      <section className="py-12 px-4 md:px-12 bg-white border-t border-slate-200" id="tenders">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-2xs font-bold uppercase tracking-wider text-blue-600">Public Registry</div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                Published Tenders & Procurement Schedule
              </h2>
            </div>
            
            {/* Search & Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search ref no, title, buyer..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 text-slate-800 w-56 sm:w-64"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-hidden"
              >
                <option value="All">All Categories</option>
                <option value="Works">Civil Works</option>
                <option value="Goods">Goods & Supplies</option>
                <option value="Services">Services</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-2xs uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="py-3 px-4">Tender Title & Reference</th>
                    <th className="py-3 px-4">Department / Buyer</th>
                    <th className="py-3 px-4">Closing Date</th>
                    <th className="py-3 px-4 text-right">Value (₹)</th>
                    <th className="py-3 px-4 text-center">AI Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContracts.slice(0, 5).map((c) => (
                    <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1">
                          {c.title}
                        </div>
                        <div className="text-2xs font-mono text-slate-400 mt-0.5">
                          Ref: {c.contractNumber} • {c.id}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-semibold text-2xs">{c.buyerName}</div>
                        <div className="text-[10px] text-slate-500">{c.department}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-2xs font-mono text-slate-600">
                        {c.awardDate} 15:00 IST
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-slate-900 text-2xs">
                        ₹{(c.contractValue / 10000000).toFixed(2)} Cr
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {c.riskLevel === 'LOW' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Certified Clear
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> AI Screened
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-2xs text-slate-500">
              Showing 5 of {filteredContracts.length} available public procurement entries.
            </div>
          </div>
        </div>
      </section>

      {/* 7. OFFICIAL FOOTER (Exact Match to Mockup) */}
      <footer className="bg-[#051324] text-slate-400 text-2xs py-10 px-4 md:px-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Govt Info (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-lg">
                🏛️
              </div>
              <div>
                <div className="text-white font-bold text-xs">Government of India</div>
                <div className="text-slate-400 text-[11px]">Central Vigilance Commission & Ministry of Finance</div>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px] max-w-sm">
              An AI-assisted national initiative to ensure transparency, anti-corruption safeguards, and fairness across public procurement.
            </p>
          </div>

          {/* Col 2: Quick Links (2.5 cols) */}
          <div className="md:col-span-2 space-y-2">
            <div className="font-bold text-white text-xs">Quick Links</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Help & Support</a></li>
            </ul>
          </div>

          {/* Col 3: Resources (2.5 cols) */}
          <div className="md:col-span-2 space-y-2">
            <div className="font-bold text-white text-xs">Resources</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#" className="hover:text-white">User Manual</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Terms & Privacy</a></li>
            </ul>
          </div>

          {/* Col 4: Tricolor Commitment (2 cols) */}
          <div className="md:col-span-3 space-y-2 text-right md:text-right">
            <div className="text-white font-bold text-[11px]">Integrity | Transparency | Accountability</div>
            <div className="flex items-center justify-end gap-1.5 pt-1">
              <span className="w-4 h-1 bg-amber-500 rounded-sm" />
              <span className="w-4 h-1 bg-white rounded-sm" />
              <span className="w-4 h-1 bg-emerald-600 rounded-sm" />
            </div>
            <div className="text-slate-500 text-[10px] mt-1">Building a Corruption Free India</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
