import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MessageSquare, Phone, ArrowUp } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { settings } = useSettings();

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const whatsappLink = `https://wa.me/${(settings.whatsapp || '+254700000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello ApexBuild Construction, I would like to inquire about tendering and construction services.')}`;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header Navigation */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Direct WhatsApp Support Action */}
      <aside aria-label="Direct Support Hotlines" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group"
          title="Chat with Senior Estimating Team on WhatsApp"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
          <span className="hidden sm:inline">Engineering WhatsApp</span>
          <MessageSquare className="w-4 h-4" />
        </a>
      </aside>

    </div>
  );
};
