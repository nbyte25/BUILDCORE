import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Filter, 
  Layers, 
  SlidersHorizontal 
} from 'lucide-react';
import { Project } from '../types';
import { db } from '../lib/database';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await db.getProjects();
        setProjects(list);
        setFilteredProjects(list);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let result = projects;

    if (selectedType !== 'All') {
      result = result.filter(p => p.project_type.toLowerCase() === selectedType.toLowerCase());
    }

    if (selectedStatus !== 'All') {
      result = result.filter(p => p.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.location.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q)
      );
    }

    setFilteredProjects(result);
  }, [selectedType, selectedStatus, searchQuery, projects]);

  const types = ['All', 'Commercial', 'Civil Works', 'Infrastructure', 'Residential', 'Industrial'];
  const statuses = ['All', 'Completed', 'In Progress', 'Planning'];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* 1. HERO HEADER */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Engineering Track Record
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Mega-Projects, Infrastructure & Landmark Developments
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Browse our portfolio of completed and ongoing engineering contracts across commercial real estate, heavy civil logistics, and arterial transportation corridors.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FILTER & SEARCH CONTROL BAR */}
      <section className="bg-slate-50 border-b border-slate-200 py-6 sticky top-20 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedType === t
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Status & Search Controls */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-400"
              >
                {statuses.map(st => (
                  <option key={st} value={st}>{st === 'All' ? 'All Statuses' : st}</option>
                ))}
              </select>

              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects, client, city..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-400 shadow-xs"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PROJECT CARDS GRID */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No matching projects found</h3>
              <p className="text-xs text-slate-500">Try changing your filters or searching with different keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  id={`project-card-${project.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <div className="relative h-60 overflow-hidden bg-slate-900">
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-slate-950/90 text-amber-400 text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider backdrop-blur-md">
                        {project.project_type}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        project.status === 'Completed'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] bg-slate-950/80 backdrop-blur-md p-2 rounded-lg">
                      <span className="flex items-center gap-1 font-semibold truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </span>
                      {project.completion_date && (
                        <span className="text-[10px] text-slate-300 shrink-0">
                          {project.completion_date.split('-')[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-950 group-hover:text-amber-600 transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                        {project.short_description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Client</span>
                          <span className="font-semibold text-slate-800 truncate block">{project.client}</span>
                        </div>
                        {project.budget && (
                          <div>
                            <span className="text-slate-400 block text-[10px]">Contract</span>
                            <span className="font-semibold text-amber-600 font-mono text-[10px] truncate block">{project.budget}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{project.square_meters || 'Full EPC Turnkey'}</span>
                      <Link
                        to={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-950 group-hover:text-amber-600 transition-colors"
                      >
                        <span>Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. CTA BANNER */}
      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-black text-white">Have a Project Tender or Blueprint?</h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Our estimating team provides preliminary structural costing, project scheduling, and value engineering recommendations.
          </p>
          <div className="flex justify-center">
            <Link
              to="/request-quote"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg transition-colors"
            >
              Request Project Quotation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
