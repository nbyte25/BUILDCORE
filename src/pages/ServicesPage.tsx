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
  CheckCircle,
  Search
} from 'lucide-react';
import { Service } from '../types';
import { db } from '../lib/database';

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

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await db.getServices();
        setServices(list);
        setFilteredServices(list);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let result = services.filter(s => s.active);

    if (selectedCategory !== 'All') {
      result = result.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.short_description.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }

    setFilteredServices(result);
  }, [selectedCategory, searchQuery, services]);

  const categories = ['All', 'Commercial', 'Civil Works', 'Industrial', 'Residential', 'Fit-Out', 'Management', 'Renovation'];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* 1. HERO HEADER */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Full-Spectrum Engineering EPC
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Disciplines & Specialized Construction Capabilities
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Explore our comprehensive range of structural, heavy civil, industrial, and turnkey project management capabilities managed under NCA-1 statutory standards.
            </p>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & CATEGORY FILTERS */}
      <section className="bg-slate-50 border-b border-slate-200 py-6 sticky top-20 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search capabilities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-400 shadow-xs"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 3. SERVICES LISTING */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No matching construction disciplines found</h3>
              <p className="text-xs text-slate-500">Try adjusting your category filter or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map(service => {
                const Icon = iconMap[service.icon] || Building2;
                return (
                  <div
                    key={service.id}
                    id={`service-item-${service.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    <div className="relative h-56 overflow-hidden bg-slate-900">
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md text-amber-400 p-2.5 rounded-xl border border-slate-800 shadow-md">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="absolute bottom-3 left-4 bg-slate-950/90 text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">
                        {service.category}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950 group-hover:text-amber-600 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                          {service.short_description}
                        </p>

                        <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-100">
                          {service.features.slice(0, 3).map((feat, i) => (
                            <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700">
                              <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to={`/services/${service.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors"
                        >
                          <span>Full Scope</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          to="/request-quote"
                          state={{ prefilledType: service.title }}
                          className="text-[11px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-2.5 py-1 rounded"
                        >
                          Quote This
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. CTA BANNER */}
      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-black text-white">Require a Tailored EPC Solution?</h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Our engineering estimation bureau reviews tender packages, preliminary architectural models, and bills of quantities with guaranteed response within 48 hours.
          </p>
          <div className="flex justify-center">
            <Link
              to="/request-quote"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg transition-colors"
            >
              Submit Tender / RFP Package
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
