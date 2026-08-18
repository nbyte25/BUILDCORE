import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  FolderGit2, 
  Wrench, 
  FileSpreadsheet, 
  MessageSquare, 
  Star, 
  Users2, 
  BookOpen, 
  Users, 
  HardDrive, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Database,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/database';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, profile, role, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadQuotes, setUnreadQuotes] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    async function loadCounters() {
      try {
        const quotes = await db.getQuoteRequests();
        const unreadQ = quotes.filter(q => q.status === 'New').length;
        setUnreadQuotes(unreadQ);

        const msgs = await db.getContactMessages();
        const unreadM = msgs.filter(m => m.status === 'unread').length;
        setUnreadMessages(unreadM);
      } catch (err) {
        console.error('Error loading sidebar counters:', err);
      }
    }
    loadCounters();
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { 
      name: 'Quote Requests', 
      path: '/admin/quotes', 
      icon: FileSpreadsheet, 
      badge: unreadQuotes > 0 ? unreadQuotes : undefined 
    },
    { 
      name: 'Enquiries & Messages', 
      path: '/admin/messages', 
      icon: MessageSquare, 
      badge: unreadMessages > 0 ? unreadMessages : undefined 
    },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { name: 'Team Members', path: '/admin/team', icon: Users2 },
    { name: 'Blog & Articles', path: '/admin/blog', icon: BookOpen },
    { name: 'Customers & RBAC', path: '/admin/customers', icon: Users },
    { name: 'Media Storage', path: '/admin/media', icon: HardDrive },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
    { name: 'Supabase SQL Setup', path: '/admin/setup-guide', icon: Terminal }
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 shrink-0 sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">BUILD<span className="text-amber-400">CORE</span></span>
              <span className="block text-[10px] text-slate-400 font-mono">ADMIN CONTROL</span>
            </div>
          </Link>
        </div>

        {/* Database Status Indicator */}
        <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300 font-medium">Storage Engine</span>
          </div>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            isSupabaseConfigured ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
          }`}>
            {isSupabaseConfigured ? 'Supabase Live' : 'Database'}
          </span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(item => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                id={`admin-nav-${item.name.toLowerCase().replace(/[\s&]+/g, '-')}`}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  active 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    active ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="truncate">
              <p className="font-bold text-white truncate">{profile?.full_name || 'Staff User'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'user@buildcore.co.ke'}</p>
            </div>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {role}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-900">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <button
              onClick={() => {
                signOut();
                navigate('/login');
              }}
              className="p-2 bg-slate-900 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 rounded transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE TOPBAR */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-white">BuildCore Admin</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-md p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="font-bold text-lg text-white">Admin Navigation</span>
            <button onClick={() => setMobileSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="space-y-1">
            {navItems.map(item => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-lg text-sm font-semibold ${
                    active ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-slate-950 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileSidebarOpen(false)}
              className="w-full py-2.5 bg-slate-900 text-center text-sm font-semibold rounded-lg text-slate-200"
            >
              Back to Public Website
            </Link>
          </div>
        </div>
      )}

      {/* 3. MAIN ADMIN CONTENT WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        
        {/* Top workspace action bar */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>RBAC Session: <strong className="text-white uppercase">{role}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Signed in as: <strong className="text-slate-200">{profile?.full_name || user?.email}</strong></span>
          </div>
        </div>

        {/* Workspace child views */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
