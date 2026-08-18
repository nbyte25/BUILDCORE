import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, Home, HardHat } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
          <HardHat className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">404 - Blueprint Not Found</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Site Sector Unavailable</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            The page or project documentation you requested has been relocated, archived, or is currently restricted.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border border-slate-700 transition-colors"
          >
            <span>Explore Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
