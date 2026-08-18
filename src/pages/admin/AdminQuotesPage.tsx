import React, { useEffect, useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  X, 
  Download, 
  ExternalLink,
  MapPin,
  Calendar,
  Building2,
  DollarSign
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { db } from '../../lib/database';
import { QuoteRequest } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminQuotesPage: React.FC = () => {
  const { showToast } = useToast();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const loadQuotes = async () => {
    try {
      const list = await db.getQuoteRequests();
      setQuotes(list);
    } catch (err) {
      console.error('Error loading quotes:', err);
      showToast('Failed to load quotes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const handleUpdateStatus = async (quoteId: string, status: QuoteRequest['status'], notes?: string) => {
    try {
      await db.updateQuoteRequest(quoteId, { 
        status, 
        admin_notes: notes !== undefined ? notes : (selectedQuote?.admin_notes || '') 
      });
      setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status, admin_notes: notes !== undefined ? notes : q.admin_notes } : q));
      if (selectedQuote && selectedQuote.id === quoteId) {
        setSelectedQuote(prev => prev ? { ...prev, status, admin_notes: notes !== undefined ? notes : prev.admin_notes } : null);
      }
      showToast(`Tender status updated to ${status}.`, 'success');
    } catch (err: any) {
      showToast('Update failed: ' + err.message, 'error');
    }
  };

  const handleDelete = async (quoteId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this quotation request?')) {
      try {
        await db.deleteQuoteRequest(quoteId);
        showToast('Quote record deleted.', 'success');
        if (selectedQuote?.id === quoteId) setSelectedQuote(null);
        loadQuotes();
      } catch (err: any) {
        showToast('Delete failed: ' + err.message, 'error');
      }
    }
  };

  const filtered = quotes.filter(q => {
    const matchesStatus = filterStatus === 'All' || q.status === filterStatus;
    const matchesQuery = 
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.company_name && q.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.project_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Tender & Quotation Requests</h1>
            <p className="text-xs text-slate-400 mt-1">Review architectural parameters, client budgets, and attached tender documents.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Quoted">Quoted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client, project type, or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">Found: {filtered.length} Tenders</span>
        </div>

        {/* Quotes Table */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Client / Company</th>
                  <th className="p-4">Project Discipline</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Target Budget</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map(q => (
                  <tr key={q.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-white">
                      <span>{q.name}</span>
                      <span className="block text-[11px] text-slate-400 font-normal">{q.company_name || 'Individual'}</span>
                    </td>
                    <td className="p-4 font-medium text-amber-400">{q.project_type}</td>
                    <td className="p-4 text-slate-300">{q.location}</td>
                    <td className="p-4 font-mono text-emerald-400">{q.estimated_budget || 'Not specified'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        q.status === 'New' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        q.status === 'Under Review' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                        q.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        q.status === 'Quoted' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{q.created_at.split('T')[0]}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedQuote(q);
                            setAdminNotes(q.admin_notes || '');
                          }}
                          className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg transition-colors"
                          title="Review Tender"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-2 bg-slate-900 hover:bg-rose-950/60 text-rose-400 rounded-lg transition-colors"
                          title="Delete"
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

        {/* TENDER REVIEW MODAL */}
        {selectedQuote && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl my-8">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-bold text-white">Tender Package Review</h3>
                  <span className="text-xs text-slate-400 font-mono">Ref ID: {selectedQuote.id}</span>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-950 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Selector */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Tender Processing Status</span>
                  <span className="text-xs text-amber-400">Controls customer dashboard view</span>
                </div>
                <select
                  value={selectedQuote.status}
                  onChange={e => handleUpdateStatus(selectedQuote.id, e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
                >
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">Client Details</span>
                  <p className="text-white font-bold text-sm">{selectedQuote.name}</p>
                  <p className="text-slate-400">{selectedQuote.company_name || 'Individual Developer'}</p>
                  <p className="text-slate-300 font-mono">{selectedQuote.email}</p>
                  <p className="text-slate-300 font-mono">{selectedQuote.phone}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">Project Metrics</span>
                  <p className="text-white font-bold">{selectedQuote.project_type}</p>
                  <p className="text-slate-400">Location: <span className="text-white">{selectedQuote.location}</span></p>
                  <p className="text-slate-400">Gross Area: <span className="text-white">{selectedQuote.square_meters || 'N/A'}</span></p>
                  <p className="text-slate-400">Budget: <span className="text-emerald-400 font-mono">{selectedQuote.estimated_budget || 'N/A'}</span></p>
                </div>
              </div>

              {/* Description */}
              {selectedQuote.description && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Scope & Client Notes:</span>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {selectedQuote.description}
                  </div>
                </div>
              )}

              {/* Documents */}
              {selectedQuote.document_urls && selectedQuote.document_urls.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Attached Blueprints & BOQ Files ({selectedQuote.document_urls.length}):</span>
                  <div className="space-y-1.5">
                    {selectedQuote.document_urls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-xs text-amber-400 font-semibold transition-colors"
                      >
                        <span className="truncate">Tender Document Package #{i + 1}</span>
                        <ExternalLink className="w-4 h-4 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 block">Internal Estimating & QS Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record internal cost estimates, sub-contractor allocations, or tender meeting notes..."
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedQuote.id, selectedQuote.status, adminNotes)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Save Internal Notes
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
