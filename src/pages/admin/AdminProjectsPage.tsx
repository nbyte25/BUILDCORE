import React, { useEffect, useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Building2, 
  MapPin, 
  Calendar, 
  X, 
  Save, 
  CheckCircle2, 
  UploadCloud,
  Layers,
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { db } from '../../lib/database';
import { Project } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminProjectsPage: React.FC = () => {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    project_type: string;
    location: string;
    client: string;
    budget: string;
    completion_date: string;
    status: 'Completed' | 'In Progress' | 'Planning';
    square_meters: string;
    architect: string;
    engineer: string;
    cover_image_url: string;
    short_description: string;
    description: string;
    challenges: string;
    solutions: string;
    features: string;
    gallery_urls: string;
    featured: boolean;
  }>({
    title: '',
    slug: '',
    project_type: 'Commercial',
    location: '',
    client: '',
    budget: '',
    completion_date: '',
    status: 'Completed',
    square_meters: '',
    architect: '',
    engineer: '',
    cover_image_url: '',
    short_description: '',
    description: '',
    challenges: '',
    solutions: '',
    features: '',
    gallery_urls: '',
    featured: false
  });

  const loadProjects = async () => {
    try {
      const list = await db.getProjects();
      setProjects(list);
    } catch (err) {
      console.error('Error fetching projects:', err);
      showToast('Failed to load projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openNewModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      project_type: 'Commercial',
      location: '',
      client: '',
      budget: '',
      completion_date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      square_meters: '',
      architect: '',
      engineer: '',
      cover_image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
      short_description: '',
      description: '',
      challenges: '',
      solutions: '',
      features: '',
      gallery_urls: '',
      featured: false
    });
    setModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      slug: proj.slug,
      project_type: proj.project_type,
      location: proj.location,
      client: proj.client,
      budget: proj.budget || '',
      completion_date: proj.completion_date || '',
      status: proj.status,
      square_meters: proj.square_meters || '',
      architect: proj.architect || '',
      engineer: proj.engineer || '',
      cover_image_url: proj.cover_image_url,
      short_description: proj.short_description,
      description: proj.description,
      challenges: proj.challenges || '',
      solutions: proj.solutions || '',
      features: proj.features ? proj.features.join('\n') : '',
      gallery_urls: proj.gallery_urls ? proj.gallery_urls.join('\n') : '',
      featured: proj.featured
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      showToast('Project title and URL slug are required.', 'error');
      return;
    }

    const payload = {
      title: formData.title,
      slug: formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      project_type: formData.project_type,
      location: formData.location,
      client: formData.client,
      budget: formData.budget || undefined,
      start_date: new Date().toISOString().split('T')[0],
      completion_date: formData.completion_date || undefined,
      status: formData.status,
      square_meters: formData.square_meters || undefined,
      architect: formData.architect || undefined,
      engineer: formData.engineer || undefined,
      cover_image_url: formData.cover_image_url,
      short_description: formData.short_description,
      description: formData.description,
      challenges: formData.challenges || undefined,
      solutions: formData.solutions || undefined,
      features: formData.features.split('\n').map(s => s.trim()).filter(Boolean),
      gallery_urls: formData.gallery_urls.split('\n').map(s => s.trim()).filter(Boolean),
      featured: formData.featured
    };

    try {
      if (editingProject) {
        await db.updateProject(editingProject.id, payload);
        showToast('Project record updated successfully!', 'success');
      } else {
        await db.createProject(payload);
        showToast('New landmark project published!', 'success');
      }
      setModalOpen(false);
      loadProjects();
    } catch (err: any) {
      console.error('Error saving project:', err);
      showToast(err.message || 'Failed to save project.', 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        await db.deleteProject(id);
        showToast('Project deleted successfully.', 'success');
        loadProjects();
      } catch (err: any) {
        showToast('Failed to delete: ' + err.message, 'error');
      }
    }
  };

  const filtered = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Construction Projects Management</h1>
            <p className="text-xs text-slate-400 mt-1">Manage project case studies, photos, specifications, and client details.</p>
          </div>
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow transition-colors shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Landmark Project</span>
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects by title, client, or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">Total: {filtered.length} Projects</span>
        </div>

        {/* Projects Table */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Project</th>
                  <th className="p-4">Discipline</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Client & Value</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map(proj => (
                  <tr key={proj.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={proj.cover_image_url}
                          alt={proj.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-bold text-white block text-sm">{proj.title}</span>
                          <span className="text-[11px] text-slate-400 font-mono">/{proj.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-amber-400 font-medium">
                        {proj.project_type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{proj.location}</td>
                    <td className="p-4">
                      <span className="text-white font-medium block">{proj.client}</span>
                      <span className="text-amber-400 font-mono text-[11px]">{proj.budget || 'N/A'}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        proj.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        proj.status === 'In Progress' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id, proj.title)}
                          className="p-2 bg-slate-900 hover:bg-rose-950/60 text-rose-400 rounded-lg transition-colors"
                          title="Delete Project"
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

        {/* CREATE / EDIT MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl my-8">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white">
                  {editingProject ? 'Edit Project Details' : 'Publish New Project Case Study'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-950"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => {
                        const t = e.target.value;
                        setFormData({ 
                          ...formData, 
                          title: t,
                          slug: editingProject ? formData.slug : t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Discipline</label>
                    <select
                      value={formData.project_type}
                      onChange={e => setFormData({ ...formData, project_type: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Commercial">Commercial</option>
                      <option value="Civil Works">Civil Works</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Residential">Residential</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Planning">Planning</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Client Name</label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={e => setFormData({ ...formData, client: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Contract Budget</label>
                    <input
                      type="text"
                      placeholder="e.g. KES 4.2 Billion"
                      value={formData.budget}
                      onChange={e => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Gross Area</label>
                    <input
                      type="text"
                      placeholder="e.g. 28,000 m²"
                      value={formData.square_meters}
                      onChange={e => setFormData({ ...formData, square_meters: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Cover Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.cover_image_url}
                    onChange={e => setFormData({ ...formData, cover_image_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Short Summary *</label>
                  <input
                    type="text"
                    required
                    value={formData.short_description}
                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Full Case Narrative *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Technical Challenges</label>
                    <textarea
                      rows={3}
                      value={formData.challenges}
                      onChange={e => setFormData({ ...formData, challenges: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Engineering Solutions</label>
                    <textarea
                      rows={3}
                      value={formData.solutions}
                      onChange={e => setFormData({ ...formData, solutions: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Technical Specs & Features (1 per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Post-tensioned unbonded tendons&#10;BIM 3D clash detection&#10;Solar façade integrated"
                    value={formData.features}
                    onChange={e => setFormData({ ...formData, features: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Gallery Image URLs (1 per line)</label>
                  <textarea
                    rows={2}
                    placeholder="https://...&#10;https://..."
                    value={formData.gallery_urls}
                    onChange={e => setFormData({ ...formData, gallery_urls: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured-proj"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800 focus:ring-0"
                  />
                  <label htmlFor="featured-proj" className="text-xs text-slate-300 font-bold">
                    Feature on Homepage Carousel
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
                    <span>Save Project</span>
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
