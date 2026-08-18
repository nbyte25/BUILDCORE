import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Clock, 
  X,
  Send,
  Building2
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { db } from '../../lib/database';
import { ContactMessage } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminMessagesPage: React.FC = () => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    try {
      const list = await db.getContactMessages();
      setMessages(list);
    } catch (err) {
      console.error('Error loading messages:', err);
      showToast('Failed to load inquiries.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleUpdateStatus = async (msgId: string, status: ContactMessage['status']) => {
    try {
      await db.updateContactMessage(msgId, { status });
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status } : m));
      if (selectedMessage && selectedMessage.id === msgId) {
        setSelectedMessage(prev => prev ? { ...prev, status } : null);
      }
      showToast(`Inquiry marked as ${status}.`, 'success');
    } catch (err: any) {
      showToast('Update failed: ' + err.message, 'error');
    }
  };

  const handleDelete = async (msgId: string) => {
    if (window.confirm('Permanently delete this message?')) {
      try {
        await db.deleteContactMessage(msgId);
        showToast('Message deleted.', 'success');
        if (selectedMessage?.id === msgId) setSelectedMessage(null);
        loadMessages();
      } catch (err: any) {
        showToast('Delete failed: ' + err.message, 'error');
      }
    }
  };

  const filtered = messages.filter(m => {
    const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
    const matchesQuery = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">General Enquiries & Messages</h1>
            <p className="text-xs text-slate-400 mt-1">Inbound messages from website contact forms and direct email channels.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Inquiries</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by sender name, subject, or keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">Count: {filtered.length}</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Message Snippet</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map(msg => (
                  <tr 
                    key={msg.id} 
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'unread') handleUpdateStatus(msg.id, 'read');
                    }}
                    className={`cursor-pointer transition-colors ${
                      msg.status === 'unread' ? 'bg-slate-900/80 font-bold hover:bg-slate-900' : 'hover:bg-slate-900/30'
                    }`}
                  >
                    <td className="p-4">
                      <span className="text-white block">{msg.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono font-normal">{msg.email}</span>
                    </td>
                    <td className="p-4 text-amber-400">{msg.subject || 'General Enquiry'}</td>
                    <td className="p-4 text-slate-400 max-w-xs truncate">{msg.message}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        msg.status === 'unread' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        msg.status === 'replied' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{msg.created_at.split('T')[0]}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg.id);
                        }}
                        className="p-2 bg-slate-900 hover:bg-rose-950/60 text-rose-400 rounded-lg transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{selectedMessage.subject || 'Inquiry'}</h3>
                  <span className="text-xs text-slate-400 font-mono">From: {selectedMessage.name} ({selectedMessage.email})</span>
                </div>
                <button onClick={() => setSelectedMessage(null)} className="p-2 text-slate-400 hover:text-white bg-slate-950 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {selectedMessage.message}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">Mark as:</span>
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                    className="px-3 py-1 bg-slate-800 text-xs font-semibold text-slate-300 rounded hover:bg-slate-700"
                  >
                    Read
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                    className="px-3 py-1 bg-blue-950 text-xs font-semibold text-blue-300 border border-blue-800 rounded hover:bg-blue-900"
                  >
                    Replied
                  </button>
                </div>

                <a
                  href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject || 'ApexBuild Inquiry')}`}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Launch Direct Email Reply</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
