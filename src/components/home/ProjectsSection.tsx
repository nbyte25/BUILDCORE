import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  DollarSign, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { Project } from '../../types';
import { db } from '../../lib/database';

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await db.getProjects();
        setProjects(list);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['All', 'Commercial', 'Civil Works', 'Infrastructure', 'Residential'];

  const filteredProjects = activeFilter === 'All'
    ? projects.slice(0, 4)
    : projects.filter(p => p.project_type.toLowerCase() === activeFilter.toLowerCase()).slice(0, 4);

  return (
    <section className="py-20 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Proven Track Record
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Featured Mega-Projects & Landmarks
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-2">
              Explore our landmark commercial towers, heavy maritime logistics pavements, and dual-carriageway corridors delivered with zero-harm safety standards.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 self-start lg:self-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              id={`featured-project-${project.slug}`}
              className="group bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              {/* Project Image Box */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={project.cover_image_url}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Status and Type Pills */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-slate-950/90 backdrop-blur-md text-amber-400 text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider border border-slate-800">
                    {project.project_type}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase ${
                    project.status === 'Completed'
                      ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950/90 text-amber-300 border border-amber-800'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{project.location}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white leading-tight group-hover:text-amber-400 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Project Details Bottom Area */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {project.short_description}
                </p>

                {/* Key Spec Stats */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Client</span>
                    <span className="font-semibold text-slate-200 truncate block">{project.client}</span>
                  </div>
                  {project.budget && (
                    <div>
                      <span className="text-slate-500 text-[11px] block">Contract Value</span>
                      <span className="font-semibold text-amber-400 font-mono text-[11px] truncate block">{project.budget}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    {project.square_meters || 'Full EPC Scope'}
                  </span>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors group-hover:translate-x-0.5"
                  >
                    <span>View Project Case Study</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <div className="mt-14 text-center">
          <Link
            id="projects-view-all-cta"
            to="/projects"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border border-slate-700 transition-colors"
          >
            <span>Explore Complete Projects Portfolio</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

      </div>
    </section>
  );
};
