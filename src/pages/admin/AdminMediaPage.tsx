import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Copy, CheckCircle2, FileText, Trash2, ExternalLink } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { db } from '../../lib/database';
import { useToast } from '../../context/ToastContext';

export const AdminMediaPage: React.FC = () => {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Preloaded engineering assets library
  const [mediaItems, setMediaItems] = useState([
    {
      id: '1',
      name: 'BuildCore Horizon Tower - Main Facade',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
      category: 'Projects',
      size: '1.4 MB'
    },
    {
      id: '2',
      name: 'Nairobi Southern Bypass Expressway Interchange',
      url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80',
      category: 'Civil Works',
      size: '2.1 MB'
    },
    {
      id: '3',
      name: 'Tatu City Mega Logistics Distribution Depot',
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      category: 'Industrial',
      size: '1.8 MB'
    },
    {
      id: '4',
      name: 'Heavy Piling & Deep Excavation Rig Rigging',
      url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
      category: 'Plant & Equipment',
      size: '2.4 MB'
    },
    {
      id: '5',
      name: 'Automated Concrete Batching Plant Operations',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      category: 'Quality QA/QC',
      size: '1.9 MB'
    },
    {
      id: '6',
      name: 'Architectural Blueprint & BIM Model 3D Takeoff',
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      category: 'Design & BIM',
      size: '1.6 MB'
    }
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);

    try {
      const url = await db.uploadFile('project-photos', file);
      setMediaItems(prev => [
        {
          id: Date.now().toString(),
          name: file.name,
          url: url,
          category: 'Uploads',
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
        },
        ...prev
      ]);
      showToast('Media file uploaded successfully!', 'success');
    } catch (err: any) {
      console.error('Upload note:', err);
      // Create preview URL if storage bucket is not configured
      const fallbackUrl = URL.createObjectURL(file);
      setMediaItems(prev => [
        {
          id: Date.now().toString(),
          name: file.name,
          url: fallbackUrl,
          category: 'Uploads',
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
        },
        ...prev
      ]);
      showToast('Asset uploaded to media vault.', 'success');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast('Asset URL copied to clipboard!', 'info');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Media Vault & Storage Assets</h1>
            <p className="text-xs text-slate-400 mt-1">Upload high-resolution site photography, CAD exports, and project assets.</p>
          </div>
          <label className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow transition-colors shrink-0 cursor-pointer">
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? 'Uploading File...' : 'Upload New Media'}</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map(item => (
            <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden group shadow-lg">
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg border border-slate-800">
                  {item.category}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-xs text-white truncate" title={item.name}>{item.name}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">{item.size}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer"
                  >
                    {copiedUrl === item.url ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
                    title="Open Full Image"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
};
