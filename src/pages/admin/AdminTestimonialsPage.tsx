import React, { useEffect, useState } from 'react';
import { PlusCircle, Search, Edit3, Trash2, Star, X, Save, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { db } from '../../lib/database';
import { Testimonial } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminTestimonialsPage: React.FC = () => {
  const { showToast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    project_title: '',
    avatar_url: '',
    content: '',
    rating: 5,
    order_index: 0,
    active: true
  });

  const loadData = async () => {
    try {
      const list = await db.getTestimonials();
      setTestimonials(list);
    } catch (err) {
      console.error('Error:', err);
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
      role: 'Managing Director',
      company: '',
      project_title: '',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      content: '',
      rating: 5,
      order_index: testimonials.length + 1,
      active: true
    });
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setFormData({
      name: t.name || t.customer_name || '',
      role: t.role || '',
      company: t.company,
      project_title: t.project_title || t.project_reference || '',
      avatar_url: t.avatar_url || t.image_url || '',
      content: t.content,
      rating: t.rating,
      order_index: t.order_index || 0,
      active: t.active
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      customer_name: formData.name,
      role: formData.role,
      company: formData.company,
      project_title: formData.project_title,
      project_reference: formData.project_title,
      avatar_url: formData.avatar_url,
      image_url: formData.avatar_url,
      content: formData.content,
      rating: formData.rating,
      order_index: formData.order_index,
      active: formData.active
    };
    try {
      if (editing) {
        await db.updateTestimonial(editing.id, payload);
        showToast('Testimonial updated.', 'success');
      } else {
        await db.createTestimonial(payload);
        showToast('New endorsement registered.', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await db.deleteTestimonial(id);
        showToast('Testimonial deleted.', 'success');
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
            <h1 className="text-xl sm:text-2xl font-black text-white">Client Endorsements & Reviews</h1>
            <p className="text-xs text-slate-400 mt-1">Manage executive testimonials displayed on the homepage and about page.</p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow transition-colors shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Endorsement</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-amber-500/40" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-white text-sm block">{t.name}</span>
                    <span className="text-xs text-slate-400">{t.role}, {t.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(t)} className="p-2 bg-slate-900 text-amber-400 rounded-lg hover:bg-slate-800">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 bg-slate-900 text-rose-400 rounded-lg hover:bg-rose-950/60">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{t.content}"
              </p>

              {t.project_title && (
                <div className="text-[11px] font-bold text-amber-400 border-t border-slate-800/80 pt-3">
                  Delivered: {t.project_title}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white">
                  {editing ? 'Edit Endorsement' : 'Add Client Endorsement'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-white bg-slate-950 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Title / Role</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Associated Project</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Horizon Tower"
                      value={formData.project_title}
                      onChange={e => setFormData({ ...formData, project_title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={formData.avatar_url}
                    onChange={e => setFormData({ ...formData, avatar_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Endorsement Text *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>Save Endorsement</span>
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
