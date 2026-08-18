import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Phone, 
  Mail, 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  Shield, 
  ArrowRight,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const { user, profile, role, isAdmin, isManager, signOut } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog & Insights', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* 1. TOP STATUTORY & CONTACT BAR */}
      <div className="hidden lg:block bg-slate-950 text-slate-300 text-xs py-2 px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-amber-400 font-semibold tracking-wide">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.nca_category}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300 font-mono font-normal text-[11px]">{settings.nca_registration_number}</span>
            </div>
            <div className="text-slate-400 hidden xl:inline">
              <span>{settings.iso_certifications}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.phone}</span>
            </a>
            <a 
              href={`mailto:${settings.email}`} 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            id="brand-logo-link"
            className="flex items-center gap-3.5 group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform duration-200 border border-slate-800">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-950">
                  BUILD<span className="text-amber-500">CORE</span>
                </span>
                <span className="bg-slate-900 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider">
                  NCA 1
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
                Engineering & Construction
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive(link.path)
                    ? 'text-amber-600 bg-amber-50/80 font-bold'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* User Account / Admin Button */}
            {user ? (
              <div className="relative">
                <button
                  id="user-account-menu-trigger"
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{profile?.full_name || 'My Account'}</span>
                  <span className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded font-bold ${
                    isAdmin ? 'bg-amber-100 text-amber-800' : isManager ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {accountDropdownOpen && (
                  <div 
                    id="account-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{profile?.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    {isManager && (
                      <Link
                        id="dropdown-link-admin-panel"
                        to="/admin"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-amber-700 hover:bg-amber-50 font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600" />
                        <span>Admin Control Center</span>
                      </Link>
                    )}

                    <Link
                      id="dropdown-link-customer-portal"
                      to="/account"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>My Customer Portal</span>
                    </Link>

                    <button
                      id="dropdown-btn-signout"
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 font-medium border-t border-slate-100 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                id="navbar-login-btn"
                to="/login"
                className="text-xs font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Primary CTA: Request a Quote */}
            <Link
              id="navbar-request-quote-cta"
              to="/request-quote"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg shadow-sm hover:shadow transition-all group"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/request-quote"
              className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-2 rounded-lg"
            >
              Quote
            </Link>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-drawer"
          className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-4"
        >
          {/* Statutory info */}
          <div className="bg-slate-900 text-slate-300 p-3 rounded-lg text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Shield className="w-4 h-4" />
              <span>NCA 1 Registered Contractor</span>
            </div>
            <p className="text-[11px] text-slate-400">{settings.nca_registration_number} | {settings.phone}</p>
          </div>

          <nav className="flex flex-col space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive(link.path)
                    ? 'bg-amber-50 text-amber-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {user ? (
              <>
                <div className="p-3 bg-slate-50 rounded-lg text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{profile?.full_name}</p>
                    <p className="text-slate-500">{user.email}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {role}
                  </span>
                </div>

                {isManager && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-amber-400 py-2.5 rounded-lg font-bold text-xs"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Control Center
                  </Link>
                )}

                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-800 py-2.5 rounded-lg font-semibold text-xs"
                >
                  <User className="w-4 h-4" />
                  My Customer Portal
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center justify-center gap-2 text-rose-600 text-xs font-semibold py-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center text-xs font-bold text-slate-800 bg-slate-100 py-2.5 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 py-2.5 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
