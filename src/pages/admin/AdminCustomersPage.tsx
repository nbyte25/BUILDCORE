import React, { useEffect, useState } from 'react';
import { Users, Search, ShieldCheck, UserCheck, ShieldAlert, User } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { db } from '../../lib/database';
import { Profile } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const AdminCustomersPage: React.FC = () => {
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadProfiles = async () => {
    try {
      const list = await db.getProfiles();
      setProfiles(list);
    } catch (err) {
      console.error(err);
      showToast('Failed to load user accounts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleRoleChange = async (userId: string, newRole: Profile['role']) => {
    try {
      await db.updateProfile(userId, { role: newRole });
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p));
      showToast(`User role updated to ${newRole.toUpperCase()}.`, 'success');
    } catch (err: any) {
      showToast('Error updating role: ' + err.message, 'error');
    }
  };

  const filtered = profiles.filter(p =>
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.company_name && p.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Users & Role-Based Access Control (RBAC)</h1>
            <p className="text-xs text-slate-400 mt-1">Manage staff authorization levels, client portals, and site managers.</p>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
            {profiles.length} Total Users Registered
          </span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by user name, email, or company..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">User Account</th>
                  <th className="p-4">Company / Developer Entity</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 font-bold">
                          {p.full_name ? p.full_name[0] : 'U'}
                        </div>
                        <div>
                          <span>{p.full_name}</span>
                          <span className="block text-[11px] text-slate-400 font-mono font-normal">{p.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{p.company_name || 'Individual Developer'}</td>
                    <td className="p-4 text-slate-400 font-mono">{p.phone || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                        p.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        p.role === 'manager' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {p.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={p.role}
                        disabled={p.id === currentUser?.id}
                        onChange={e => handleRoleChange(p.id, e.target.value as any)}
                        className="bg-slate-900 border border-slate-700 text-[11px] text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 disabled:opacity-40"
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="customer">Customer / Client</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
