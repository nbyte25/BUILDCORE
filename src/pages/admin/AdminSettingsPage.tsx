import React, { useState } from 'react';
import { Save, Building2, Phone, Mail, MapPin, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ ...settings });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formData);
      showToast('Global company settings saved successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save settings: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Corporate Identity & Global Settings</h1>
            <p className="text-xs text-slate-400 mt-1">Configure company name, NCA contractor licensing, contact channels, and metrics.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Company Details */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span>Company Information & Statutory Registration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Company Legal Name</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Corporate Tagline / Slogan</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">NCA Contractor Registration No.</label>
                <input
                  type="text"
                  value={formData.nca_number}
                  onChange={e => setFormData({ ...formData, nca_number: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">ISO & Statutory Accreditations</label>
                <input
                  type="text"
                  value={formData.iso_certifications}
                  onChange={e => setFormData({ ...formData, iso_certifications: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Corporate Mission</label>
                <textarea
                  rows={2}
                  value={formData.mission}
                  onChange={e => setFormData({ ...formData, mission: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Corporate Vision</label>
                <textarea
                  rows={2}
                  value={formData.vision}
                  onChange={e => setFormData({ ...formData, vision: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Channels */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>Contact Coordinates & Office Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Official Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">WhatsApp Hotline</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Physical Head Office Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Metrics Counters */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Public Experience Counters</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Years of Operation</label>
                <input
                  type="number"
                  value={formData.years_experience}
                  onChange={e => setFormData({ ...formData, years_experience: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Projects Completed</label>
                <input
                  type="number"
                  value={formData.completed_projects_count}
                  onChange={e => setFormData({ ...formData, completed_projects_count: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Heavy Plant Equipment</label>
                <input
                  type="number"
                  value={formData.equipment_count}
                  onChange={e => setFormData({ ...formData, equipment_count: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Workforce / Engineers</label>
                <input
                  type="number"
                  value={formData.expert_workforce_count}
                  onChange={e => setFormData({ ...formData, expert_workforce_count: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving System Changes...' : 'Save All Settings'}</span>
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
};
