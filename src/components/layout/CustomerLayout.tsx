import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, 
  FileText, 
  PlusCircle, 
  ShieldCheck, 
  PhoneCall, 
  LogOut,
  Building2,
  HardHat
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  const links = [
    { name: 'My Dashboard & Overview', path: '/account', icon: Building2, exact: true },
    { name: 'Submitted Quote Requests', path: '/account/quotes', icon: FileText },
    { name: 'Profile & Security', path: '/account/profile', icon: User }
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
              {profile?.full_name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{profile?.full_name || 'Client Portal'}</h1>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Verified Client
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{profile?.email} • {profile?.company_name || 'Individual Developer'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              to="/request-quote"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit New Quote</span>
            </Link>
            <button
              onClick={signOut}
              className="p-3 rounded-xl bg-slate-900 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition-colors border border-slate-800"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
                Client Navigation
              </span>
              {links.map(link => {
                const active = isActive(link.path, link.exact);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Direct Project Liaison Help Card */}
            <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <HardHat className="w-4 h-4" />
                <span>Senior Estimator Liaison</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need priority assistance on your tender submission or structural drawings? Contact our engineering team.
              </p>
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 w-full justify-center py-2.5 rounded-lg transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Hotline: {settings.phone}</span>
              </a>
            </div>
          </div>

          {/* Main Client Content */}
          <div className="lg:col-span-3">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};
