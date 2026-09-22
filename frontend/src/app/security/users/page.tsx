'use client';

import React from 'react';
import { Users, Shield, Plus } from 'lucide-react';
import { MOCK_USERS } from '@/mock/auth';

export default function UsersManagementPage() {
  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              ADMINISTRATION
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">User Accounts & Role Permissions</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage auditor accounts, clearance levels, and role privileges.
          </p>
        </div>

        <button
          onClick={() => alert('Mock: Add new user dialog')}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add User Account</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left gov-table">
            <thead>
              <tr>
                <th>Officer Name</th>
                <th>Employee ID & Email</th>
                <th>Assigned Role</th>
                <th>Department</th>
                <th>Active Cases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_USERS.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80">
                  <td className="font-bold text-xs text-slate-900">{u.name}</td>
                  <td>
                    <span className="font-mono text-xs text-slate-800 block">{u.employeeId}</span>
                    <span className="text-2xs text-slate-400">{u.email}</span>
                  </td>
                  <td>
                    <span className="text-2xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="text-xs text-slate-700">{u.department}</td>
                  <td className="font-mono text-xs font-semibold text-slate-900">{u.assignedCasesCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
