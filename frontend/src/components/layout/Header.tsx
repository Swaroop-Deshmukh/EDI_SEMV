'use client';

import React, { useState } from 'react';
import { Search, Bell, Shield, User, ChevronDown, LogOut, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole, MOCK_USERS } from '@/mock/auth';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';

export const Header: React.FC = () => {
  const { currentUser, activeRole, switchRole, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  return (
    <>
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-4 shrink-0 shadow-2xs z-20">
        {/* Left: Global Search Trigger */}
        <div className="flex-1 max-w-lg">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-md transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search contracts, vendors, cases, PAN, GSTIN...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-2xs font-mono bg-white text-slate-500 rounded border border-slate-300">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {/* Mock Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-2xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-navy-900" />
              <span className="hidden sm:inline text-slate-500">Role:</span>
              <span className="font-semibold text-slate-900">{activeRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isRoleMenuOpen && (
              <div
                className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-xs"
                onMouseLeave={() => setIsRoleMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-2xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Switch Frontend Persona
                </div>
                {(['Auditor', 'Senior Auditor', 'Administrator'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role);
                      setIsRoleMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    <span>{role}</span>
                    {activeRole === role && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
          </button>

          <div className="h-5 w-px bg-slate-200" />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 rounded-md transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser.name[0]}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.name}</p>
                <p className="text-2xs text-slate-500">{currentUser.employeeId}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-md shadow-xl py-1 z-50 text-xs"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="font-semibold text-slate-900">{currentUser.name}</p>
                  <p className="text-2xs text-slate-500">{currentUser.email}</p>
                  <div className="mt-1 inline-block text-2xs font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                    {currentUser.department}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals & Drawers */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationsDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
