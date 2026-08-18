import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  HardHat, 
  Building2, 
  Award,
  ChevronRight
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Hero: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section className="relative min-h-[85vh] bg-slate-950 text-white flex items-center overflow-hidden">
      
      {/* High-Resolution Architectural Background Image with Multi-Layer Gradients */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=2000&q=85')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
      <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/50 to-slate-950" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Value Proposition (7 cols) */}
          <div className="lg:col-span-8 space-y-6 text-left">
            
            {/* NCA Tier 1 Pill */}
            <div className="inline-flex items-center gap-2.5 bg-slate-900/90 border border-amber-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-400 backdrop-blur-md shadow-lg">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>NCA-1 REGISTERED CONTRACTOR</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300 font-normal">UNLIMITED CONTRACT VALUE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
              Engineering <span className="text-amber-500">Excellence.</span><br />
              Building Africa’s <span className="text-slate-200 underline decoration-amber-500/60 decoration-4 underline-offset-8">Enduring</span> Future.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              East Africa’s premier tier-one civil engineering, commercial high-rise, and heavy infrastructure contractor. We unite advanced BIM precision, post-tensioned structural mastery, and an unyielding zero-harm safety standard.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-3 py-2 rounded-lg text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ISO 9001 / 45001 Certified</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-3 py-2 rounded-lg text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>6.2M+ Safe Man-Hours</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-3 py-2 rounded-lg text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>BIM Level 2 Coordination</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                id="hero-request-quote-cta"
                to="/request-quote"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-3 group"
              >
                <span>Request Project Quotation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                id="hero-view-projects-cta"
                to="/projects"
                className="bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm px-7 py-4 rounded-xl border border-slate-700 backdrop-blur-md transition-colors flex items-center gap-2"
              >
                <span>View Delivered Projects</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

          </div>

          {/* Right Column: Key Metric Highlight Card (4 cols) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Track Record</h3>
                    <p className="text-[11px] text-slate-400">Audited EPC Metrics</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  ACTIVE SITES
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-amber-400">180+</span>
                    <span className="text-xs text-slate-400">Major Developments</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">Commercial towers, highways, ports & hospitals</p>
                </div>

                <div className="border-t border-slate-800/80 pt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-white">24 Yrs</span>
                    <span className="text-xs text-slate-400">Regional Footprint</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">Kenya, Uganda, Tanzania & Rwanda</p>
                </div>

                <div className="border-t border-slate-800/80 pt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-emerald-400">0.00</span>
                    <span className="text-xs text-slate-400">Lost Time Injury Rate</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">Strict ISO 45001 Zero-Harm compliance</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <Link
                  to="/about"
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center justify-between group"
                >
                  <span>Learn about our engineering philosophy</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
