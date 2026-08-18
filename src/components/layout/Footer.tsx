import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Shield, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquareShare
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      
      {/* 1. TOP PRE-FOOTER CTA BANNER */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-900 bg-amber-400/80 px-2.5 py-1 rounded">
              Ready To Construct?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 mt-2">
              Transform Your Architectural Blueprint Into An Enduring Landmark
            </h3>
            <p className="text-slate-900 text-sm font-medium mt-1">
              Engage our senior civil and structural engineering estimators for a comprehensive Bill of Quantities (BOQ) evaluation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              id="footer-cta-quote-btn"
              to="/request-quote"
              className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <span>Request Project Quotation</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
            <a
              id="footer-cta-whatsapp-btn"
              href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20BuildCore%20Team,%20I%20would%20like%20to%20inquire%20about%20a%20construction%20project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/90 hover:bg-white text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-lg shadow transition-all flex items-center gap-2"
            >
              <MessageSquareShare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Statutory Credibility (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white">
                BUILD<span className="text-amber-500">CORE</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.about_summary}
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.nca_category} ({settings.nca_registration_number})</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/50 border border-slate-800 p-2 rounded-lg">
                <Award className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{settings.iso_certifications}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Engineering Services */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Core Disciplines
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/services/commercial-high-rise-construction" className="hover:text-amber-400 transition-colors">
                  Commercial High-Rise
                </Link>
              </li>
              <li>
                <Link to="/services/civil-infrastructure-heavy-engineering" className="hover:text-amber-400 transition-colors">
                  Heavy Civil Infrastructure
                </Link>
              </li>
              <li>
                <Link to="/services/road-highway-construction" className="hover:text-amber-400 transition-colors">
                  Road & Highway Networks
                </Link>
              </li>
              <li>
                <Link to="/services/industrial-facilities-warehousing" className="hover:text-amber-400 transition-colors">
                  Industrial & Warehouses
                </Link>
              </li>
              <li>
                <Link to="/services/residential-estates-luxury-developments" className="hover:text-amber-400 transition-colors">
                  Luxury Masterplanned Estates
                </Link>
              </li>
              <li>
                <Link to="/services/project-management-turnkey-epc" className="hover:text-amber-400 transition-colors">
                  Turnkey EPC & Project Mgt
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">About Our Group</Link></li>
              <li><Link to="/projects" className="hover:text-amber-400 transition-colors">Completed Projects</Link></li>
              <li><Link to="/request-quote" className="hover:text-amber-400 transition-colors">Request a Quote</Link></li>
              <li><Link to="/blog" className="hover:text-amber-400 transition-colors">Engineering Insights</Link></li>
              <li><Link to="/faq" className="hover:text-amber-400 transition-colors">NCA Compliance & FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact Our Engineers</Link></li>
              <li><Link to="/account" className="hover:text-amber-400 transition-colors">Client Tracking Portal</Link></li>
              <li><Link to="/admin" className="hover:text-amber-400 transition-colors text-amber-500 font-medium">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 4: Headquarters & Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Headquarters
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}, {settings.city_country}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">{settings.business_hours}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM COPYRIGHT & STATUTORY STATEMENT */}
      <div className="border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.company_name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>NCA-1 Registered & Certified</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>Zero Harm Safety Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
