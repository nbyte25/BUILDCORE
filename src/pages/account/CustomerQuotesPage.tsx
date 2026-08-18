import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  PlusCircle, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { QuoteRequest } from '../../types';
import { db } from '../../lib/database';
import { useAuth } from '../../context/AuthContext';
import { CustomerLayout } from '../../components/layout/CustomerLayout';

export const CustomerQuotesPage: React.FC = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const list = await db.getUserQuoteRequests(user.id);
        setQuotes(list);
      } catch (err) {
        console.error('Error loading quotes:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Submitted Quotation & Tender Requests</h2>
            <p className="text-xs text-slate-500 mt-1">Detailed history and status of all projects submitted for engineering review.</p>
          </div>
          <Link
            to="/request-quote"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Submission</span>
          </Link>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xs text-center space-y-4">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No tender submissions recorded</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You haven't requested any project quotations yet. Submit your first architectural blueprint or site scope to begin.
            </p>
            <Link
              to="/request-quote"
              className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Request Quotation</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map(q => {
              const isExpanded = expandedQuoteId === q.id;
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-amber-400 transition-all"
                >
                  <div 
                    onClick={() => setExpandedQuoteId(isExpanded ? null : q.id)}
                    className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-950">{q.project_type}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          q.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          q.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                          q.status === 'Quoted' ? 'bg-amber-100 text-amber-800' :
                          q.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>{q.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Submitted: {q.created_at.split('T')[0]}</span>
                        </span>
                        {q.estimated_budget && (
                          <span className="text-amber-600 font-mono font-medium">{q.estimated_budget}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-xs text-slate-400 font-mono">Ref: {q.id.slice(0, 8)}</span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Gross Area</span>
                          <span className="font-semibold text-slate-800">{q.square_meters || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Floor Levels</span>
                          <span className="font-semibold text-slate-800">{q.floors || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Target Timeline</span>
                          <span className="font-semibold text-slate-800">{q.timeline || 'Standard schedule'}</span>
                        </div>
                      </div>

                      {q.description && (
                        <div>
                          <span className="font-bold text-slate-700 block mb-1">Scope & Specifications:</span>
                          <p className="text-slate-600 whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-200">
                            {q.description}
                          </p>
                        </div>
                      )}

                      {q.document_urls && q.document_urls.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-700 block mb-1">Attached Tender Documents:</span>
                          <div className="space-y-1">
                            {q.document_urls.map((url, i) => (
                              <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-semibold"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Tender Document Attachment #{i + 1}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </CustomerLayout>
  );
};
