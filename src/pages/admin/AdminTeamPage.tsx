import React, { useEffect, useState } from 'react';
import { PlusCircle, Search, Edit3, Trash2, X, Save, CheckCircle2, Award, User } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { db } from '../../lib/database';
import { TeamMember } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminTeamPage: React.FC = () => {
  const { showToast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    qualifications: '',
    image_url: '',
    bio: '',
    order_index: 0,
    active: true
  });

  const loadData = async () => {
    try {
      const list = await db.getTeamMembers();
      setTeam(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNew = () => {
    setEditing(null);
    setFormData({
      name: '',
      role: 'Senior Project Engineer',
      qualifications: 'BSc Civil Eng, MIEK, Registered Consulting Engineer',
      image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: '',
      order_index: team.length + 1,
      active: true
    });
    setModalOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditing(member);
    setFormData({
      name: member.name,
      role: member.role || member.position || '',
      qualifications: typeof member.qualifications === 'string' ? member.qualifications : Array.isArray(member.qualifications) ? member.qualifications.join(', ') : '',
      image_url: member.image_url,
      bio: member.bio || member.biography || '',
      order_index: member.order_index || member.display_order || 0,
      active: member.active
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      role: formData.role,
      position: formData.role,
      qualifications: formData.qualifications,
      image_url: formData.image_url,
      bio: formData.bio,
      biography: formData.bio,
      order_index: formData.order_index,
      display_order: formData.order_index,
      active: formData.active
    };
    try {
      if (editing) {
        await db.updateTeamMember(editing.id, payload);
        showToast('Team member updated.', 'success');
      } else {
        await db.createTeamMember(payload);
        showToast('New executive engineer added.', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this team member record?')) {
      try {
        await db.deleteTeamMember(id);
        showToast('Member deleted.', 'success');
        loadData();
      } catch (err: any) {
        showToast('Error: ' + err.message, 'error');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Engineering Leadership & Key Personnel</h1>
            <p className="text-xs text-slate-400 mt-1">Manage executive leadership and resident site directors.</p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow transition-colors shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Engineer / Director</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map(m => (
            <div key={m.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <img src={m.image_url} alt={m.name} className="w-16 h-16 rounded-2xl object-cover border border-amber-500/40" referrerPolicy="no-referrer" />
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(m)} className="p-2 bg-slate-900 text-amber-400 rounded-lg hover:bg-slate-800">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="p-2 bg-slate-900 text-rose-400 rounded-lg hover:bg-rose-950/60">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{m.name}</h3>
                <span className="text-xs font-semibold text-amber-400 block">{m.role}</span>
                <span className="text-[11px] text-slate-400 block mt-1">{m.qualifications}</span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed border-t border-slate-800/80 pt-3">
                {m.bio}
              </p>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white">
                  {editing ? 'Edit Team Member' : 'Add Team Member'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-white bg-slate-950 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Position / Role *</label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Degrees & Professional Accreditations</label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={e => setFormData({ ...formData, qualifications: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Portrait Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Professional Bio *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>Save Personnel</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
