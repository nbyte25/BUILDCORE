import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  HardHat, 
  Navigation, 
  Factory, 
  Home, 
  Paintbrush, 
  ClipboardCheck, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  FileSpreadsheet,
  PhoneCall
} from 'lucide-react';
import { Project, Service } from '../types';
import { db } from '../lib/database';
import { useSettings } from '../context/SettingsContext';

const iconMap: Record<string, React.ElementType> = {
  Building2,
  HardHat,
  Navigation,
  Factory,
  Home,
  Paintbrush,
  ClipboardCheck,
  ShieldCheck
};

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [service, setService] = useState<Service | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const found = await db.getServiceBySlug(slug);
        setService(found);

        if (found) {
          const allProjects = await db.getProjects();
          const related = allProjects.filter(p => 
            p.project_type.toLowerCase() === found.category.toLowerCase() ||
            p.description.toLowerCase().includes(found.title.toLowerCase().split(' ')[0])
          );
          setRelatedProjects(related.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching service details:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Service Not Found</h2>
        <p className="text-xs text-slate-600">The requested construction discipline does not exist or has been retired.</p>
        <Link to="/services" className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </Link>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || Building2;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-slate-950 text-white py-20 lg:py-24 overflow-hidden border-b border-slate-800">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url('${service.image_url}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Construction Disciplines</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Icon className="w-6 h-6" />
            </div>
            <span className="bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold px-3 py-1 rounded uppercase">
              {service.category} Discipline
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
            {service.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            {service.short_description}
          </p>
        </div>
      </section>

      {/* 2. MAIN TECHNICAL SCOPE CONTENT */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Content Area (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              
              <div>
                <h2 className="text-2xl font-bold text-slate-950 mb-4">Engineering Scope & Methodology</h2>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Service Feature Highlights */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-950">Key Engineering Capabilities & Standards</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-800 leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Projects Showcase */}
              {relatedProjects.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-950">Delivered Projects in this Discipline</h3>
                    <Link to="/projects" className="text-xs font-bold text-amber-600 hover:text-amber-700">
                      View All
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedProjects.map(proj => (
                      <Link
                        key={proj.id}
                        to={`/projects/${proj.slug}`}
                        className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all"
                      >
                        <div className="h-44 overflow-hidden bg-slate-900">
                          <img
                            src={proj.cover_image_url}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-4 space-y-1.5">
                          <span className="text-[10px] font-bold text-amber-600 uppercase block">{proj.location}</span>
                          <h4 className="font-bold text-sm text-slate-950 group-hover:text-amber-600 transition-colors line-clamp-1">
                            {proj.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{proj.short_description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Sidebar: Direct Quotation & Contact Card (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Quote CTA Box */}
              <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl border border-slate-800 sticky top-28">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 block">
                  Project Engagement
                </span>
                <h3 className="text-xl font-black text-white">
                  Request a Quotation for {service.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Engage our certified civil estimators for a comprehensive quantity takeoff and cost breakdown.
                </p>

                <Link
                  to="/request-quote"
                  state={{ prefilledType: service.title }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Request Specific BOQ</span>
                </Link>

                <div className="pt-4 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                    <span>Direct Tender Desk: {settings.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>NCA-1 Licensed Category</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
