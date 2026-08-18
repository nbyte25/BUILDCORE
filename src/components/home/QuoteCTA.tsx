import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowRight, 
  Sparkles, 
  Calculator, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert
} from 'lucide-react';

export const QuoteCTA: React.FC = () => {
  const navigate = useNavigate();
  const [projectType, setProjectType] = useState('Commercial High-Rise');
  const [squareMeters, setSquareMeters] = useState('5000');
  const [floors, setFloors] = useState('8');
  const [location, setLocation] = useState('Nairobi (Upper Hill / Westlands / CBD)');

  // Quick estimator formula in KES & USD
  const sqM = parseInt(squareMeters) || 1000;
  const numFloors = parseInt(floors) || 1;
  const ratePerSqm = projectType.includes('High-Rise') ? 85000 : projectType.includes('Industrial') ? 48000 : projectType.includes('Residential') ? 65000 : 70000;
  const estimatedCostKes = sqM * ratePerSqm * (1 + (numFloors > 5 ? (numFloors - 5) * 0.03 : 0));
  const estimatedCostUsd = estimatedCostKes / 129;

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/request-quote', {
      state: {
        prefilledType: projectType,
        prefilledLocation: location,
        prefilledEstimate: `KES ${(estimatedCostKes / 1000000).toFixed(1)}M (~$${(estimatedCostUsd / 1000000).toFixed(2)}M USD)`
      }
    });
  };

  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
      
      <div className="absolute inset-0 bg-radial-at-t from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" />
                <span>Interactive Preliminary Estimator</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Benchmark Your Construction Budget in Seconds
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Utilize our calibrated East African construction cost index to forecast preliminary structural, civil, and turnkey MEP expenditures for institutional-grade projects.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Calibrated with 2025 KeNHA, NCA & Joint Building Council (JBC) indices</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant transfer to our Senior Quantity Surveyors for detailed BOQ</span>
                </div>
              </div>
            </div>

            {/* Right Estimator Form */}
            <div className="lg:col-span-6">
              <form onSubmit={handleProceed} className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-inner">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Project Scope / Discipline</label>
                    <select
                      value={projectType}
                      onChange={e => setProjectType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Commercial High-Rise">Commercial High-Rise</option>
                      <option value="Civil Works & Infrastructure">Civil Infrastructure & Heavy Engineering</option>
                      <option value="Industrial & Warehousing">Industrial Facility / PEB Warehouse</option>
                      <option value="Residential Luxury Estate">Masterplanned Residential Estate</option>
                      <option value="Road & Highway Works">Road & Highway Works</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Built Area (Approx m²)</label>
                    <input
                      type="number"
                      min="100"
                      max="1000000"
                      step="100"
                      value={squareMeters}
                      onChange={e => setSquareMeters(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Number of Levels / Floors</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={floors}
                      onChange={e => setFloors(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Site Location</label>
                    <select
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Nairobi (Upper Hill / Westlands / CBD)">Nairobi Metropolitan</option>
                      <option value="Mombasa & Coastal Region">Mombasa & Coastal Ports</option>
                      <option value="Nakuru / Rift Valley Region">Nakuru & Great Rift Corridor</option>
                      <option value="Kisumu & Western Kenya">Kisumu & Lake Region</option>
                      <option value="Regional East Africa (Uganda/Rwanda/Tanzania)">Regional East Africa</option>
                    </select>
                  </div>
                </div>

                {/* Estimate Result Box */}
                <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Preliminary Budget Envelope
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                      KES {(estimatedCostKes / 1000000).toFixed(1)} Million
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      ~ ${(estimatedCostUsd / 1000000).toFixed(2)}M USD (Excl. VAT & Land)
                    </span>
                  </div>
                  <div className="hidden sm:block text-right">
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 border border-emerald-800 px-2 py-1 rounded">
                      NCA-1 Compliant
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Formalize Full Tender & Bill of Quantities (BOQ)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
