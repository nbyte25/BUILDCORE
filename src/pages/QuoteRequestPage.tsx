import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  HardHat, 
  ShieldCheck, 
  Sparkles,
  X,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../lib/database';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const QuoteRequestPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const stateData = (location.state as any) || {};

  // Form Steps
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Scope & Location
    projectType: stateData.prefilledType || 'Commercial High-Rise',
    location: stateData.prefilledLocation || '',
    squareMeters: '',
    floors: '',
    siteStatus: 'Greenfield (Vacant Land)',

    // Step 2: Timeline & Budget
    timeline: '12 - 18 Months',
    startDate: '',
    estimatedBudget: stateData.prefilledEstimate || 'KES 50M - 200M (~$400k - $1.5M USD)',
    specialRequirements: '',

    // Step 3: Contact Info
    fullName: profile?.full_name || '',
    companyName: profile?.company_name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',

    // Step 4: Notes
    notes: ''
  });

  // Attached files
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);

  // Sync profile data if loaded later
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || profile.full_name,
        companyName: prev.companyName || profile.company_name || '',
        email: prev.email || profile.email,
        phone: prev.phone || profile.phone || ''
      }));
    }
  }, [profile]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
      showToast(`${newFiles.length} document(s) queued for upload.`, 'info');
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.location) {
        showToast('Please specify the project location / city.', 'error');
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        showToast('Please enter your complete contact information.', 'error');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. Upload files if any
      const uploadedUrls: string[] = [];
      for (const file of attachedFiles) {
        try {
          const url = await db.uploadFile('tender-documents', file);
          if (url) {
            uploadedUrls.push(url);
          }
        } catch (uploadErr) {
          console.warn('File upload note:', uploadErr);
        }
      }

      // 2. Submit quote to Supabase
      const newQuote = await db.createQuoteRequest({
        user_id: user?.id,
        name: formData.fullName,
        company_name: formData.companyName || undefined,
        email: formData.email,
        phone: formData.phone,
        service_id: undefined,
        project_type: formData.projectType,
        location: formData.location,
        square_meters: formData.squareMeters ? `${formData.squareMeters} m²` : undefined,
        floors: formData.floors ? `${formData.floors} floors` : undefined,
        timeline: formData.timeline,
        target_start_date: formData.startDate || undefined,
        preferred_start_date: formData.startDate || undefined,
        estimated_budget: formData.estimatedBudget,
        budget: formData.estimatedBudget,
        description: `Site Status: ${formData.siteStatus}. \nRequirements: ${formData.specialRequirements || 'Standard turnkey scope'}. \nAdditional notes: ${formData.notes || 'None'}`,
        document_urls: uploadedUrls.length > 0 ? uploadedUrls : undefined,
        attachment_urls: uploadedUrls.length > 0 ? uploadedUrls : undefined
      });

      setSubmittedQuoteId(newQuote.id);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('Quote proposal successfully submitted to our Senior Quantity Surveyors!', 'success');
    } catch (err: any) {
      console.error('Error submitting quote:', err);
      showToast(err.message || 'Failed to submit quote request. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
            Engineering Quantity Takeoff & Tender Bureau
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Request Formal Construction Quotation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Provide your preliminary architectural parameters or upload a tender package for rapid analysis and structured Bill of Quantities (BOQ) review.
          </p>
        </div>

        {/* Step Progress Bar */}
        {!submittedQuoteId && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs mb-8">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { num: 1, label: 'Scope & Site' },
                { num: 2, label: 'Specs & Budget' },
                { num: 3, label: 'Client Contact' },
                { num: 4, label: 'Drawings & Submit' }
              ].map(step => (
                <div
                  key={step.num}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${
                    currentStep === step.num
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : currentStep > step.num
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    currentStep === step.num
                      ? 'bg-slate-950 text-white'
                      : currentStep > step.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {currentStep > step.num ? '✓' : step.num}
                  </span>
                  <span className="text-[11px] truncate">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Confirmation Card */}
        {submittedQuoteId ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                Quotation Request Successfully Registered
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Your tender submission has been logged into our central database and allocated to our Senior Estimating Team.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tender Reference ID:</span>
                <span className="font-mono font-bold text-slate-950">{submittedQuoteId.slice(0, 13)}...</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Project Type:</span>
                <span className="font-semibold text-slate-950">{formData.projectType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-950">{formData.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Response:</span>
                <span className="font-semibold text-amber-600">Within 24 - 48 Hours</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/account/quotes"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow transition-colors"
              >
                Track in Client Portal
              </Link>
              <Link
                to="/"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-Step Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
            
            {/* STEP 1: SCOPE & SITE */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-950">Step 1: Project Scope & Site Location</h3>
                  <p className="text-xs text-slate-500 mt-1">Specify the primary construction discipline and physical site location.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Project Discipline / Category *</label>
                    <select
                      value={formData.projectType}
                      onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Commercial High-Rise">Commercial High-Rise / Office Tower</option>
                      <option value="Civil Works & Heavy Engineering">Civil Infrastructure & Heavy Engineering</option>
                      <option value="Road & Highway Works">Road, Highway & Bridge Construction</option>
                      <option value="Industrial & Warehousing">Industrial Facility / Logistics Hub / PEB</option>
                      <option value="Residential Luxury Estate">Masterplanned Residential Development</option>
                      <option value="Turnkey Fit-Out & Renovation">Turnkey Interior Fit-Out & Retrofit</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Site Location / City / Region *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Upper Hill Nairobi / Kilifi Coast"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Approx Built Area (m²)</label>
                    <input
                      type="number"
                      placeholder="e.g. 8500"
                      value={formData.squareMeters}
                      onChange={e => setFormData({ ...formData, squareMeters: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Estimated Levels / Floors</label>
                    <input
                      type="number"
                      placeholder="e.g. 12"
                      value={formData.floors}
                      onChange={e => setFormData({ ...formData, floors: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Current Site Status</label>
                    <select
                      value={formData.siteStatus}
                      onChange={e => setFormData({ ...formData, siteStatus: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Greenfield (Vacant Land)">Greenfield (Vacant Land)</option>
                      <option value="Brownfield (Requires Demolition)">Brownfield (Requires Demolition)</option>
                      <option value="Excavated / Piled">Excavated / Piled</option>
                      <option value="Existing Structure (Retrofit)">Existing Structure (Retrofit)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: TIMELINE & BUDGET */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-950">Step 2: Timeline & Financial Expectations</h3>
                  <p className="text-xs text-slate-500 mt-1">Guide our engineering team on delivery milestones and preliminary target budget.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Construction Duration</label>
                    <select
                      value={formData.timeline}
                      onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Under 6 Months (Fast-Track)">Under 6 Months (Fast-Track)</option>
                      <option value="6 - 12 Months">6 - 12 Months</option>
                      <option value="12 - 18 Months">12 - 18 Months</option>
                      <option value="18 - 24 Months">18 - 24 Months</option>
                      <option value="24+ Months (Phased Multi-Tower)">24+ Months (Phased Multi-Tower)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Groundbreaking Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Estimated Target Budget Envelope</label>
                  <select
                    value={formData.estimatedBudget}
                    onChange={e => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="KES 20M - 50M (~$150k - $400k USD)">KES 20M - 50M (~$150k - $400k USD)</option>
                    <option value="KES 50M - 200M (~$400k - $1.5M USD)">KES 50M - 200M (~$400k - $1.5M USD)</option>
                    <option value="KES 200M - 500M (~$1.5M - $3.8M USD)">KES 200M - 500M (~$1.5M - $3.8M USD)</option>
                    <option value="KES 500M - 1.5 Billion (~$3.8M - $11.5M USD)">KES 500M - 1.5 Billion (~$3.8M - $11.5M USD)</option>
                    <option value="KES 1.5 Billion+ (Tier-1 Mega-Infrastructure)">KES 1.5 Billion+ (Tier-1 Mega-Infrastructure)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Special Structural or Statutory Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Post-tensioned slabs required, LEED/EDGE Green Building Certification, Deep foundation bore piling, NEMA EIA required..."
                    value={formData.specialRequirements}
                    onChange={e => setFormData({ ...formData, specialRequirements: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: CONTACT INFO */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-950">Step 3: Client & Company Information</h3>
                  <p className="text-xs text-slate-500 mt-1">Who should our Senior Commercial Estimator address the BOQ proposal to?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Name / Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Catherine Mwangi"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Organization / Developer Entity</label>
                    <input
                      type="text"
                      placeholder="e.g. Mwangi Capital Properties Ltd"
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. catherine@domain.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +254 712 345 678"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: DRAWINGS & SUBMIT */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-950">Step 4: Attach Drawings & Supplementary Documents</h3>
                  <p className="text-xs text-slate-500 mt-1">Upload PDF blueprints, DWG CAD exports, Bills of Quantities, or geotechnical soil reports.</p>
                </div>

                {/* Upload Box */}
                <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-8 text-center bg-slate-50/50 transition-colors">
                  <UploadCloud className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-800">
                    Drag and drop your engineering files or click to browse
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Accepts PDF, DWG, DXF, XLSX, ZIP up to 50MB per file
                  </p>
                  <label className="mt-4 inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
                    <span>Select Documents</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Attached Files List */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Attached Tender Files ({attachedFiles.length}):</span>
                    <div className="space-y-1.5">
                      {attachedFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">{f.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">General Notes / Specific Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Any additional context regarding tender deadlines, site access restrictions, or joint-venture financing structure..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase px-5 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow transition-colors cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg transition-colors cursor-pointer"
                >
                  {uploading ? (
                    <span>Registering Tender in Database...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Formal Quote Package</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
