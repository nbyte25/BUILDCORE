import React, { useEffect, useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Edit3, 
  Trash2, 
  Building2, 
  Wrench, 
  X, 
  Save, 
  CheckCircle2, 
  HardHat 
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { db } from '../../lib/database';
import { Service } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminServicesPage: React.FC = () => {
  const { showToast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Commercial',
    icon: 'Building2',
    image_url: '',
    short_description: '',
    description: '',
    features: '',
    order_index: 0,
    active: true
  });

  const loadServices = async () => {
    try {
      const list = await db.getServices();
      setServices(list);
    } catch (err) {
      console.error('Error fetching services:', err);
      showToast('Failed to load services.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openNewModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Commercial',
      icon: 'Building2',
      image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
      short_description: '',
      description: '',
      features: '',
      order_index: services.length + 1,
      active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      category: service.category,
      icon: service.icon,
      image_url: service.image_url,
      short_description: service.short_description,
      description: service.description,
      features: service.features.join('\n'),
      order_index: service.order_index || service.display_order || 0,
      active: service.active
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      showToast('Title and slug are required.', 'error');
      return;
    }

    const payload = {
      title: formData.title,
      slug: formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      category: formData.category,
      icon: formData.icon,
      image_url: formData.image_url,
      short_description: formData.short_description,
      description: formData.description,
      features: formData.features.split('\n').map(s => s.trim()).filter(Boolean),
      display_order: Number(formData.order_index),
      order_index: Number(formData.order_index),
      active: formData.active
    };

    try {
      if (editingService) {
        await db.updateService(editingService.id, payload);
        showToast('Service discipline updated successfully.', 'success');
      } else {
        await db.createService(payload);
        showToast('New service capability registered.', 'success');
      }
      setModalOpen(false);
      loadServices();
    } catch (err: any) {
      showToast('Failed to save service: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete discipline "${title}"?`)) {
      try {
        await db.deleteService(id);
        showToast('Discipline removed.', 'success');
        loadServices();
      } catch (err: any) {
        showToast('Delete failed: ' + err.message, 'error');
      }
    }
  };

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Engineering Disciplines & Services</h1>
            <p className="text-xs text-slate-400 mt-1">Manage public capabilities, technical specifications, and icons.</p>
          </div>
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow transition-colors shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Discipline</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Discipline Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Features Count</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <img src={s.image_url} alt={s.title} className="w-10 h-10 rounded-lg object-cover border border-slate-800" referrerPolicy="no-referrer" />
                      <div>
                        <span>{s.title}</span>
                        <span className="block text-[11px] text-slate-400 font-mono">/{s.slug}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-amber-400 font-medium">
                        {s.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{s.features.length} specifications</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.title)}
                          className="p-2 bg-slate-900 hover:bg-rose-950/60 text-rose-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white">
                  {editingService ? 'Edit Discipline' : 'Register New Discipline'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-white bg-slate-950 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Discipline Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => {
                        const t = e.target.value;
                        setFormData({
                          ...formData,
                          title: t,
                          slug: editingService ? formData.slug : t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Image URL</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Short Description *</label>
                  <input
                    type="text"
                    required
                    value={formData.short_description}
                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Full Technical Methodology *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Core Features (1 per line)</label>
                  <textarea
                    rows={3}
                    value={formData.features}
                    onChange={e => setFormData({ ...formData, features: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="serv-active"
                    checked={formData.active}
                    onChange={e => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800 focus:ring-0"
                  />
                  <label htmlFor="serv-active" className="text-xs text-slate-300 font-bold">
                    Active & Displayed Publicly
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Discipline</span>
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
