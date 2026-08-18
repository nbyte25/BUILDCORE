import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  FolderGit2, 
  FileSpreadsheet, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  PlusCircle, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Award,
  DollarSign
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { db } from '../../lib/database';
import { Project, QuoteRequest, ContactMessage, Profile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminDashboardOverview: React.FC = () => {
  const { role, profile } = useAuth();
  const { showToast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [p, q, m, pr] = await Promise.all([
          db.getProjects(),
          db.getQuoteRequests(),
          db.getContactMessages(),
          db.getProfiles()
        ]);
        setProjects(p);
        setQuotes(q);
        setMessages(m);
        setProfiles(pr);
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const pendingQuotes = quotes.filter(q => q.status === 'New' || q.status === 'Under Review');
  const unreadMessages = messages.filter(m => m.status === 'unread');
  const completedProjects = projects.filter(p => p.status === 'Completed');
  const ongoingProjects = projects.filter(p => p.status === 'In Progress');

  const handleUpdateQuoteStatus = async (quoteId: string, status: QuoteRequest['status']) => {
    try {
      await db.updateQuoteRequest(quoteId, { status });
      setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status } : q));
      showToast(`Tender status updated to ${status}`, 'success');
    } catch (err: any) {
      showToast('Error updating status: ' + err.message, 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Welcome & Quick Actions Header */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded">
                Executive Control Hub
              </span>
              <span className="text-xs text-slate-400 font-mono">Role: {role.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Operations & Tender Command
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live oversight of East African construction contracts, incoming BOQ inquiries, and site assets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl shadow transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Project</span>
            </Link>
            <Link
              to="/admin/quotes"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Review Quotes ({pendingQuotes.length})</span>
            </Link>
          </div>
        </div>

        {/* 4-Stat Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Tenders</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white font-mono">{quotes.length}</span>
              <span className="text-xs text-amber-400 font-bold">{pendingQuotes.length} Pending Review</span>
            </div>
            <p className="text-[11px] text-slate-500">Incoming architectural BOQ requests</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Sites</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <FolderGit2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white font-mono">{projects.length}</span>
              <span className="text-xs text-blue-400 font-bold">{ongoingProjects.length} Under Construction</span>
            </div>
            <p className="text-[11px] text-slate-500">{completedProjects.length} Handed over successfully</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client Inquiries</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white font-mono">{messages.length}</span>
              <span className="text-xs text-emerald-400 font-bold">{unreadMessages.length} Unread</span>
            </div>
            <p className="text-[11px] text-slate-500">From web contact channels</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Accounts</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white font-mono">{profiles.length}</span>
              <span className="text-xs text-purple-400 font-bold">RBAC Governed</span>
            </div>
            <p className="text-[11px] text-slate-500">Clients, engineers & site managers</p>
          </div>
        </div>

        {/* 2-Column Split: Pending Quotes & Urgent Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Pending Quotes Table (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Incoming Tender Submissions</h3>
                <p className="text-xs text-slate-400">Manage status and quantity takeoff reviews</p>
              </div>
              <Link to="/admin/quotes" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <span>All Tenders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {quotes.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">No quotation requests found.</div>
            ) : (
              <div className="space-y-3">
                {quotes.slice(0, 5).map(q => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{q.project_type}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          q.status === 'New' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          q.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {q.name} ({q.company_name || 'Individual'}) • {q.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <select
                        value={q.status}
                        onChange={e => handleUpdateQuoteStatus(q.id, e.target.value as any)}
                        className="bg-slate-950 border border-slate-700 text-[11px] text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-amber-500"
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <Link
                        to="/admin/quotes"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                        title="View Full Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Urgent Messages & Quick Links (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Enquiries Box */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white">Recent Website Enquiries</h3>
                <Link to="/admin/messages" className="text-xs font-bold text-amber-400 hover:text-amber-300">
                  View All ({unreadMessages.length})
                </Link>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">No messages received yet.</div>
              ) : (
                <div className="space-y-2.5">
                  {messages.slice(0, 4).map(m => (
                    <div key={m.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white truncate">{m.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          m.status === 'unread' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'text-slate-500'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] truncate">{m.subject || m.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Statutory Status Pill */}
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Award className="w-4 h-4" />
                <span>Statutory Compliance Status</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All statutory registrations (NCA-1, NEMA EIA, ISO 9001/45001) are active for 2025/2026 tender submissions.
              </p>
              <Link
                to="/admin/settings"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
              >
                <span>Edit Site Metadata & Reg Numbers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
};
