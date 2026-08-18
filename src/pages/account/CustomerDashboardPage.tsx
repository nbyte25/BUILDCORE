import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  ArrowRight, 
  HardHat, 
  AlertCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { QuoteRequest } from '../../types';
import { db } from '../../lib/database';
import { useAuth } from '../../context/AuthContext';
import { CustomerLayout } from '../../components/layout/CustomerLayout';

export const CustomerDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const list = await db.getUserQuoteRequests(user.id);
        setQuotes(list);
      } catch (err) {
        console.error('Error fetching customer quotes:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const activeCount = quotes.filter(q => q.status !== 'Completed' && q.status !== 'Rejected').length;
  const approvedCount = quotes.filter(q => q.status === 'Approved').length;

  return (
    <CustomerLayout>
      <div className="space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              Welcome back, {profile?.full_name || 'Client'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Track active tender evaluations, structural drawings, and project milestone valuations.
            </p>
          </div>
          <Link
            to="/request-quote"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Tender / BOQ</span>
          </Link>
        </div>

        {/* Metric Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-950">{quotes.length}</span>
              <span className="text-xs text-slate-500 block">Total Submissions</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-blue-900">{activeCount}</span>
              <span className="text-xs text-slate-500 block">Under Review</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-950">{approvedCount}</span>
              <span className="text-xs text-slate-500 block">Awarded / Approved</span>
            </div>
          </div>
        </div>

        {/* Recent Quote Submissions Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Recent Tender Quotes</h3>
              <p className="text-xs text-slate-500">Submissions forwarded to Senior Quantity Surveyors</p>
            </div>
            <Link to="/account/quotes" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {quotes.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">No quotation requests on file</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Submit an architectural blueprint or request a quantity takeoff to initiate review.
              </p>
              <Link
                to="/request-quote"
                className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Quotation</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Project Discipline</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Target Budget</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotes.slice(0, 5).map(q => (
                    <tr key={q.id} className="hover:bg-slate-50">
                      <td className="py-3 font-semibold text-slate-900">{q.project_type}</td>
                      <td className="py-3 text-slate-600">{q.location}</td>
                      <td className="py-3 text-amber-600 font-mono font-medium">{q.estimated_budget || 'N/A'}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          q.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          q.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                          q.status === 'Quoted' ? 'bg-amber-100 text-amber-800' :
                          q.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500">{q.created_at.split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </CustomerLayout>
  );
};
