import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Building2, 
  FileSpreadsheet, 
  ArrowRight,
  HardHat
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const faqs: FAQItem[] = [
    {
      category: 'NCA & Statutory Compliance',
      question: 'What does ApexBuild’s NCA 1 contractor classification mean for our project?',
      answer: 'The National Construction Authority (NCA) Class 1 certification represents the highest tier of contractor accreditation in Kenya. It authorizes ApexBuild to undertake civil engineering, building works, road infrastructure, and mechanical installations with unlimited financial value. It signifies verified technical plant assets, audited balance sheet health, and registered resident engineers.'
    },
    {
      category: 'NCA & Statutory Compliance',
      question: 'Does ApexBuild assist clients with County and NEMA building approvals?',
      answer: 'Yes. Our dedicated statutory liaison desk manages complete end-to-end statutory permitting, including National Environment Management Authority (NEMA) Environmental Impact Assessments (EIA), County Government Architectural & Structural approvals, Water Resources Authority (WRA) clearances, and mandatory NCA project registration.'
    },
    {
      category: 'Tendering & Costing',
      question: 'How do you calculate Bills of Quantities (BOQ) and price guarantees?',
      answer: 'We utilize computerized quantity takeoff software calibrated with the latest Joint Building Council (JBC) Kenya and KeNHA price indices. For turnkey projects, we offer Guaranteed Maximum Price (GMP) EPC contracts that protect developers against unexpected material price fluctuations and scope creep.'
    },
    {
      category: 'Tendering & Costing',
      question: 'What is the typical payment milestone structure for a commercial development?',
      answer: 'We operate strictly on audited interim valuation certificates (IVCs) issued by the project quantity surveyor. Standard structures include a 10% - 20% mobilization advance against an Advance Payment Bank Guarantee, followed by monthly progress milestone disbursements and a 5% retention held during the Defect Liability Period (DLP).'
    },
    {
      category: 'Engineering & Construction Quality',
      question: 'How do you ensure concrete strength and structural integrity on high-rise builds?',
      answer: 'We operate our own automated, computerized concrete batching plants. Every concrete pour is monitored with slump tests and 7-day, 14-day, and 28-day compressive cube crush tests conducted in KEBS-certified laboratories. We maintain full traceability on every tonne of high-yield deformed steel rebar.'
    },
    {
      category: 'Engineering & Construction Quality',
      question: 'What is BIM Level 2 and how does it prevent on-site delays?',
      answer: 'Building Information Modeling (BIM) Level 2 integrates architectural, structural, and MEP 3D models into a shared digital environment. Before pouring a single foundation, our engineers run automated clash-detection algorithms to resolve pipe, rebar, duct, and conduit conflicts that would otherwise cause costly site halts.'
    },
    {
      category: 'Project Management & Handover',
      question: 'What happens after physical completion during the Defect Liability Period (DLP)?',
      answer: 'Upon Substantial Completion and issuance of the Certificate of Practical Completion, a 6 to 12-month Defect Liability Period commences. ApexBuild retains a dedicated engineering maintenance crew on standby to rectify any latent mechanical, electrical, or structural defects at zero additional charge before final retention release.'
    }
  ];

  const categories = ['All', 'NCA & Statutory Compliance', 'Tendering & Costing', 'Engineering & Construction Quality', 'Project Management & Handover'];

  const filteredFaqs = selectedCat === 'All' 
    ? faqs 
    : faqs.filter(f => f.category === selectedCat);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* 1. HERO HEADER */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Statutory Knowledgebase
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              NCA Regulations, Tendering & Construction FAQ
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Clear answers regarding statutory building codes, contract structures, quality assurance procedures, and project delivery frameworks.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES & FAQS */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCat === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all ${
                    isOpen 
                      ? 'border-amber-400 bg-amber-50/20 shadow-md' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                        {faq.category}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-slate-950">
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isOpen ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Technical Assistance Card */}
          <div className="bg-slate-950 text-white rounded-3xl p-8 border border-slate-800 text-center space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-white">Have a Unique Engineering or Tendering Question?</h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Our Senior Quantity Surveyors and Compliance Officers are available to review your specific project requirements.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/contact"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-colors"
              >
                Contact Engineering Desk
              </Link>
              <Link
                to="/request-quote"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl border border-slate-700 transition-colors"
              >
                Submit Project RFP
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
