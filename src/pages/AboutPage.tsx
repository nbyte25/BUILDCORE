import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Shield, 
  Award, 
  CheckCircle2, 
  HardHat, 
  Users2, 
  Clock, 
  Target, 
  Eye, 
  HeartHandshake,
  ArrowRight,
  Mail,
  Phone
} from 'lucide-react';
import { TeamMember } from '../types';
import { db } from '../lib/database';
import { useSettings } from '../context/SettingsContext';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const members = await db.getTeamMembers();
        setTeam(members.filter(m => m.active));
      } catch (err) {
        console.error('Error fetching team:', err);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-slate-950 text-white py-20 lg:py-28 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=2000&q=85')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>NCA-1 Registered & ISO Certified Contractor</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Shaping East Africa’s Architectural & Civil Horizon
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              For over two decades, ApexBuild Engineering & Construction Ltd has stood at the forefront of tier-one engineering, transforming complex technical blueprints into iconic, enduring landmarks.
            </p>
          </div>
        </div>
      </section>

      {/* 2. STATUTORY ACCREDITATION & CERTIFICATIONS BAR */}
      <section className="bg-slate-900 border-y border-slate-800 py-8 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <Shield className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">NCA 1 Accreditation</span>
                <p className="text-xs text-slate-300 font-semibold mt-0.5">{settings.nca_category}</p>
                <p className="text-[11px] text-slate-400 font-mono">Reg: {settings.nca_registration_number}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <Award className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">Quality & Safety Standards</span>
                <p className="text-xs text-slate-300 font-semibold mt-0.5">{settings.iso_certifications}</p>
                <p className="text-[11px] text-slate-400">Audited by International Registrars</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <HardHat className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">Zero Harm Culture</span>
                <p className="text-xs text-slate-300 font-semibold mt-0.5">6.2M+ Safe Man-Hours</p>
                <p className="text-[11px] text-slate-400">Zero Lost Time Injuries (LTI) in 2023-2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORPORATE STORY & HERITAGE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                Our Heritage & Growth
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                24 Years of Engineering Ingenuity & Unwavering Integrity
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Founded in Nairobi, ApexBuild started with a mission to bridge the infrastructure deficit across East Africa by delivering European-standard civil engineering paired with deep local terrain knowledge.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Today, our multidisciplinary team of over 1,450 structural engineers, geotechnical specialists, project managers, and certified tradesmen operates across Kenya, Uganda, Tanzania, and Rwanda. We maintain our own computerized concrete batching hubs, heavy asphalt pavers, and tower cranes, guaranteeing uninterrupted project momentum.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl font-black text-slate-950">184+</div>
                  <div className="text-xs text-slate-600 font-semibold">Delivered Landmarks</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl font-black text-amber-600">KES 45B+</div>
                  <div className="text-xs text-slate-600 font-semibold">Cumulative EPC Value</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
                  alt="ApexBuild Engineers on site"
                  className="w-full h-[450px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-slate-950 text-white p-6 rounded-2xl shadow-xl border border-slate-800 hidden sm:block max-w-xs">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Zero Compromise</p>
                <p className="text-xs text-slate-300 mt-1">Every cubic meter of concrete and tonne of rebar is tested in KEBS-accredited laboratories.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MISSION, VISION & CORE VALUES */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {settings.mission}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {settings.vision}
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="max-w-3xl mb-8 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Foundational Pillars</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Our Non-Negotiable Core Values</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {settings.core_values.map((val, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-200">{val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. EXECUTIVE & ENGINEERING LEADERSHIP */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              Executive Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Led by Renowned Civil & Structural Engineers
            </h2>
            <p className="text-sm text-slate-600">
              Our executive board pairs deep academic rigor with decades of on-site execution across mega-tenders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map(member => (
              <div
                key={member.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-64 overflow-hidden bg-slate-900">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-950">{member.name}</h4>
                    <p className="text-xs text-amber-600 font-semibold mt-0.5">{member.position}</p>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {member.biography}
                    </p>
                  </div>

                  {member.qualifications && member.qualifications.length > 0 && (
                    <div className="pt-3 border-t border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Credentials</span>
                      <div className="space-y-1">
                        {member.qualifications.slice(0, 2).map((q, i) => (
                          <span key={i} className="text-[10px] text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded block truncate">
                            {q}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CTA BANNER */}
      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-black text-white">Partner with an Accredited Tier-One Contractor</h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Schedule a technical consultation with our engineering directors or submit your drawings for preliminary Bill of Quantities (BOQ) estimation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/request-quote"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg transition-colors"
            >
              Request Project Quotation
            </Link>
            <Link
              to="/contact"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border border-slate-700 transition-colors"
            >
              Contact Our Engineers
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
