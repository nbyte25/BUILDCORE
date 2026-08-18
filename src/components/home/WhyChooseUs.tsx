import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Clock4, 
  BadgePercent, 
  Truck, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const WhyChooseUs: React.FC = () => {
  const { settings } = useSettings();

  const reasons = [
    {
      title: 'NCA 1 Tier-One Accreditation',
      description: 'Licensed for unlimited construction contract values. Highest financial, plant machinery, and personnel threshold in East Africa.',
      icon: Award
    },
    {
      title: 'BIM Level 2 & 3D Clash Avoidance',
      description: 'We eliminate costly on-site change orders by modeling complete architectural, structural, and MEP systems digitally before breaking ground.',
      icon: Cpu
    },
    {
      title: 'Zero-Harm Safety Governance',
      description: '6.2M+ consecutive safe man-hours. Strict adherence to ISO 45001 (OH&S) and mandatory daily hazard mitigation audits.',
      icon: ShieldCheck
    },
    {
      title: 'Self-Owned Heavy Plant & Fleet',
      description: '120+ specialized machinery assets: computerized concrete batching plants, tower cranes, laser pavers, and heavy earthmoving excavators.',
      icon: Truck
    },
    {
      title: 'Fixed-Price & Guaranteed Delivery',
      description: 'Transparent Bill of Quantities (BOQ) with guaranteed maximum price (GMP) contracts that protect clients against cost escalation.',
      icon: BadgePercent
    },
    {
      title: 'Strict Quality Control & Lab Testing',
      description: 'On-site KEBS-certified testing of concrete cube compressive strength, rebar tensile yield, and soil compaction densities.',
      icon: Clock4
    }
  ];

  return (
    <section className="py-20 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Context */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              Engineering Superiority
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              Why Institutional Developers & Governments Trust ApexBuild
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When executing complex structural works, high-rise buildings, or arterial highway corridors, choosing an accredited tier-one contractor is the difference between perpetual delays and an iconic landmark.
            </p>

            <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Statutory Compliance Assured</span>
              </div>
              <p className="text-xs text-slate-300">
                {settings.nca_category} Registration #{settings.nca_registration_number}. Fully compliant with KEBS, NEMA, and County Building Codes.
              </p>
            </div>
          </div>

          {/* Right Column: Grid of Reasons */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reasons.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
