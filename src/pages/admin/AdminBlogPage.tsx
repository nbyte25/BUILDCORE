import React, { useEffect, useState } from 'react';
import { PlusCircle, Search, Edit3, Trash2, BookOpen, X, Save, CheckCircle2, FileText } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { db } from '../../lib/database';
import { BlogPost } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminBlogPage: React.FC = () => {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Engineering Standards',
    author: 'Chief Resident Engineer',
    published_date: new Date().toISOString().split('T')[0],
    cover_image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    summary: '',
    content: '',
    tags: '',
    published: true
  });

  const loadData = async () => {
    try {
      const list = await db.getBlogPosts();
      setPosts(list);
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
      title: '',
      slug: '',
      category: 'Engineering Standards',
      author: 'Senior Quantity Surveyor',
      published_date: new Date().toISOString().split('T')[0],
      cover_image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
      summary: '',
      content: '',
      tags: 'NCA, Structural Engineering, BOQ',
      published: true
    });
    setModalOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      category: p.category,
      author: p.author || p.author_name || 'Senior Engineer',
      published_date: p.published_date || p.published_at || new Date().toISOString().split('T')[0],
      cover_image_url: p.cover_image_url,
      summary: p.summary || p.excerpt || '',
      content: p.content,
      tags: (p.tags || []).join(', '),
      published: p.published
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      slug: formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      category: formData.category,
      author: formData.author,
      author_name: formData.author,
      published_date: formData.published_date,
      published_at: formData.published_date,
      cover_image_url: formData.cover_image_url,
      summary: formData.summary,
      excerpt: formData.summary,
      content: formData.content,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
      published: formData.published
    };

    try {
      if (editing) {
        await db.updateBlogPost(editing.id, payload);
        showToast('Article updated.', 'success');
      } else {
        await db.createBlogPost(payload);
        showToast('New engineering article published.', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this article?')) {
      try {
        await db.deleteBlogPost(id);
        showToast('Article deleted.', 'success');
        loadData();
      } catch (err: any) {
        showToast('Error: ' + err.message, 'error');
      }
    }
  };

  const filtered = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Engineering Knowledgebase & Blog</h1>
            <p className="text-xs text-slate-400 mt-1">Publish technical whitepapers, building code insights, and company milestones.</p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow transition-colors shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write Article</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Article</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <img src={p.cover_image_url} alt={p.title} className="w-12 h-12 rounded-xl object-cover border border-slate-800" referrerPolicy="no-referrer" />
                      <div>
                        <span>{p.title}</span>
                        <span className="block text-[11px] text-slate-400 font-mono">/{p.slug}</span>
                      </div>
                    </td>
                    <td className="p-4 text-amber-400">{p.category}</td>
                    <td className="p-4 text-slate-300">{p.author}</td>
                    <td className="p-4 text-slate-400">{p.published_date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.published ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 bg-slate-900 text-amber-400 rounded-lg hover:bg-slate-800">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 bg-slate-900 text-rose-400 rounded-lg hover:bg-rose-950/60">
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
                  {editing ? 'Edit Knowledge Article' : 'Write New Knowledge Article'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-white bg-slate-950 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => {
                        const t = e.target.value;
                        setFormData({
                          ...formData,
                          title: t,
                          slug: editing ? formData.slug : t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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
                    <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={e => setFormData({ ...formData, author: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Published Date</label>
                    <input
                      type="date"
                      value={formData.published_date}
                      onChange={e => setFormData({ ...formData, published_date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.cover_image_url}
                    onChange={e => setFormData({ ...formData, cover_image_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Summary Excerpt *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.summary}
                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Full Article Body (Markdown / Text) *</label>
                  <textarea
                    rows={6}
                    required
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="art-pub"
                    checked={formData.published}
                    onChange={e => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800 focus:ring-0"
                  />
                  <label htmlFor="art-pub" className="text-xs text-slate-300 font-bold">
                    Publish Immediately
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>Save Article</span>
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
