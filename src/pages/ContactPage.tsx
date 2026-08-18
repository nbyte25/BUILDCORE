import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquareShare, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { db } from '../lib/database';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await db.createContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject || 'General Engineering Enquiry',
        message: formData.message
      });

      setSubmitted(true);
      showToast('Enquiry received! Our senior engineering liaison will reply shortly.', 'success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      console.error('Error sending message:', err);
      showToast(err.message || 'Failed to submit enquiry. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* 1. HERO BANNER */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Engineering Bureau & Headquarters
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Connect With Our Senior Estimators & Site Directors
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Visit our Upper Hill headquarters in Nairobi or submit your RFP/enquiry directly to our technical desk.
            </p>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTACT SECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Headquarters Details & Direct Links (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-950 mb-2">Corporate Headquarters</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our central engineering bureau coordinates project tenders, structural design reviews, and heavy plant logistics across East Africa.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-950 uppercase tracking-wider">Physical Address</h4>
                    <p className="text-xs text-slate-700 font-medium mt-1">{settings.address}</p>
                    <p className="text-xs text-slate-500">{settings.city_country}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-950 uppercase tracking-wider">Telephone & Hotlines</h4>
                    <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="text-xs font-semibold text-slate-800 hover:text-amber-600 block mt-1">
                      {settings.phone}
                    </a>
                    {settings.emergency_phone && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-0.5">
                        24/7 Site Emergency: {settings.emergency_phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-950 uppercase tracking-wider">Electronic Mail</h4>
                    <a href={`mailto:${settings.email}`} className="text-xs font-semibold text-slate-800 hover:text-amber-600 block mt-1">
                      {settings.email}
                    </a>
                    <p className="text-[11px] text-slate-500">Tenders: tenders@buildcore.co.ke</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-950 uppercase tracking-wider">Operating Hours</h4>
                    <p className="text-xs text-slate-700 mt-1">{settings.business_hours}</p>
                    <p className="text-[11px] text-slate-500">Emergency site response: 24/7/365</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Channel */}
              <div className="bg-emerald-950 text-white rounded-2xl p-6 border border-emerald-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <MessageSquareShare className="w-4 h-4" />
                  <span>Instant Engineering Chat</span>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Have an urgent tender question or architectural drawing to review on mobile? Connect with our desk directly.
                </p>
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20ApexBuild%20Engineering%20Desk`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider w-full py-3 rounded-xl transition-colors shadow-md"
                >
                  <MessageSquareShare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Right Column: Contact & Tender Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
                
                <div>
                  <h3 className="text-2xl font-black text-slate-950">Send an Enquiry or Tender Note</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Please provide your contact information and scope summary. We log all communications in our central database.
                  </p>
                </div>

                {submitted && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Message logged successfully.</p>
                      <p className="mt-0.5 text-emerald-800">Our liaison engineer will reach out to you within 24 business hours.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Eng. Daniel Kiprop"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. daniel@domain.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone / Mobile</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +254 700 000 000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Subject / Project Title</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Tender Inquiry - Westlands Commercial"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Detailed Message / Scope *</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your project location, approximate built area, structural requirements, or any specific questions..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <span>Transmitting Message to Database...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Engineering Enquiry</span>
                      </>
                    )}
                  </button>
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
