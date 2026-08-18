import React from 'react';
import { 
  Compass, 
  Layers, 
  FileCheck2, 
  Hammer, 
  CheckCheck 
} from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Geotechnical & Feasibility',
      description: 'Comprehensive topographical survey, core-drilling soil analysis, environmental baseline assessments, and cost estimation.',
      icon: Compass
    },
    {
      number: '02',
      title: 'Engineering & BIM Modeling',
      description: '3D structural design, post-tensioning calculations, MEP clash detection, and value engineering to optimize material usage.',
      icon: Layers
    },
    {
      number: '03',
      title: 'NCA & Statutory Permitting',
      description: 'Streamlined procurement of NCA project registration, NEMA EIA licenses, County building approvals, and water board clearances.',
      icon: FileCheck2
    },
    {
      number: '04',
      title: 'Execution & Quality Assurance',
      description: 'Site mobilization, heavy equipment deployment, daily QA/QC cube testing, and ISO 45001 zero-harm site safety enforcement.',
      icon: Hammer
    },
    {
      number: '05',
      title: 'Testing & Turnkey Handover',
      description: 'Full MEP commissioning, air tightness balancing, occupation certification, and 12-month Defect Liability Period (DLP) support.',
      icon: CheckCheck
    }
  ];

  return (
    <section className="py-20 bg-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
            Methodology & Governance
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Our 5-Phase EPC Delivery Framework
          </h2>
          <p className="text-sm text-slate-600">
            A disciplined, transparent, and auditable construction management lifecycle that eliminates delays and guarantees structural longevity.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-amber-500 font-mono">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-slate-950 mb-2 group-hover:text-amber-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
