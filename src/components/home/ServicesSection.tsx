import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  CheckCircle
} from 'lucide-react';
import { Service } from '../../types';
import { db } from '../../lib/database';

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

export const ServicesSection: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await db.getServices();
        setServices(list.filter(s => s.active).slice(0, 6));
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="py-20 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Comprehensive Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Tier-One Engineering & Construction Services
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-2">
              From heavy civil infrastructure and multi-storey commercial towers to pre-engineered industrial logistics parks, we manage full-lifecycle construction.
            </p>
          </div>
          <Link
            id="services-view-all-link"
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-950 hover:text-amber-600 transition-colors border-b-2 border-amber-500 pb-1 self-start md:self-auto"
          >
            <span>View All Disciplines</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => {
            const Icon = iconMap[service.icon] || Building2;
            return (
              <div
                key={service.id}
                id={`service-card-${service.slug}`}
                className="group bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Service Card Image */}
                <div className="relative h-52 overflow-hidden bg-slate-900">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-400 p-2.5 rounded-xl border border-slate-800 shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="absolute bottom-3 left-4 bg-slate-950/90 text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">
                    {service.category}
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 group-hover:text-amber-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {service.short_description}
                    </p>

                    {/* Features list */}
                    <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-200/80">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors"
                    >
                      <span>Explore Technical Scope</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
