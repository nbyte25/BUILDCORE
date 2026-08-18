import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  CheckCircle2, 
  DollarSign, 
  Layers, 
  User, 
  Briefcase, 
  Eye, 
  X, 
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Project } from '../types';
import { db } from '../lib/database';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const found = await db.getProjectBySlug(slug);
        setProject(found);
      } catch (err) {
        console.error('Error fetching project:', err);
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

  if (!project) {
    return (
      <div className="min-h-screen bg-white py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Project Not Found</h2>
        <p className="text-xs text-slate-600">The project case study you requested could not be located.</p>
        <Link to="/projects" className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Portfolio</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* 1. HERO HEADER */}
      <section className="relative bg-slate-950 text-white py-20 lg:py-28 overflow-hidden border-b border-slate-800">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{ backgroundImage: `url('${project.cover_image_url}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Projects Portfolio</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded uppercase tracking-wider">
              {project.project_type}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded uppercase ${
              project.status === 'Completed' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
            }`}>
              {project.status}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{project.location}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Client: {project.client}</span>
            </span>
            {project.completion_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Handover: {project.completion_date}</span>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 2. PROJECT METRICS SUMMARY BAR */}
      <section className="bg-slate-900 border-y border-slate-800 py-6 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Contract Value</span>
              <span className="text-base font-bold text-amber-400 font-mono mt-0.5 block">{project.budget || 'Confidential'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Gross Built Area</span>
              <span className="text-base font-bold text-white mt-0.5 block">{project.square_meters || 'Full EPC Turnkey'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Architectural Lead</span>
              <span className="text-base font-bold text-white mt-0.5 block">{project.architect || 'ApexBuild Technical Bureau'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Structural Lead</span>
              <span className="text-base font-bold text-emerald-400 mt-0.5 block">{project.engineer || 'ApexBuild Civil Engineers'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CASE STUDY BODY & GALLERY */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              
              <div>
                <h2 className="text-2xl font-bold text-slate-950 mb-3">Project Narrative & Overview</h2>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {/* Engineering Challenges & Solutions */}
              {(project.challenges || project.solutions) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.challenges && (
                    <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 space-y-2">
                      <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                        <span>Complex Technical Challenges</span>
                      </h3>
                      <p className="text-xs text-rose-900/80 leading-relaxed whitespace-pre-line">
                        {project.challenges}
                      </p>
                    </div>
                  )}

                  {project.solutions && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 space-y-2">
                      <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                        <span>ApexBuild Engineering Solutions</span>
                      </h3>
                      <p className="text-xs text-emerald-900/80 leading-relaxed whitespace-pre-line">
                        {project.solutions}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Technical Features Checklist */}
              {project.features && project.features.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-slate-950">Technical Specifications & Structural Innovations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-slate-800">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multi-Image Gallery */}
              {project.gallery_urls && project.gallery_urls.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-950">Site Execution & Progress Gallery</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.gallery_urls.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImage(imgUrl)}
                        className="h-52 rounded-2xl overflow-hidden cursor-pointer relative group border border-slate-200 shadow-xs"
                      >
                        <img
                          src={imgUrl}
                          alt={`${project.title} progress photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-8 h-8 text-amber-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Sidebar: Tender Engagement */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl border border-slate-800 sticky top-28">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 block">
                  Replicate This Success
                </span>
                <h3 className="text-xl font-black text-white">
                  Executing a Similar Project in East Africa?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our civil and structural engineering directors will review your site topography, architectural plans, and statutory requirements.
                </p>

                <Link
                  to="/request-quote"
                  state={{ prefilledType: project.project_type, prefilledLocation: project.location }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg transition-colors"
                >
                  <span>Request Similar Project Quote</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>NCA-1 Unlimited Value Category</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>ISO 9001:2015 & 45001:2018 Certified</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Image Modal Lightbox */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 bg-slate-900 text-white p-2 rounded-full hover:bg-slate-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeImage}
              alt="Expanded view"
              className="w-full h-auto max-h-[85vh] object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

    </div>
  );
};
