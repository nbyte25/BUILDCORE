import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  Terminal, 
  Layers, 
  HardHat, 
  FolderPlus,
  KeyRound
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

export const AdminSetupGuidePage: React.FC = () => {
  const { showToast } = useToast();
  const [copiedSql, setCopiedSql] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'Not configured';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ? '••••••••' + import.meta.env.VITE_SUPABASE_ANON_KEY.slice(-6) : 'Not configured';

  const fullSqlSchema = `-- ==============================================================================
-- BUILDCORE PRODUCTION POSTGRESQL SCHEMA FOR SUPABASE
-- Run this script in the Supabase SQL Editor to provision all tables,
-- foreign keys, RLS security policies, and initial administrative triggers.
-- ==============================================================================

-- 1. PROFILES (Users & RBAC)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'manager', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PROJECTS (Civil & Landmark Builds)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  project_type TEXT NOT NULL,
  location TEXT NOT NULL,
  client TEXT NOT NULL,
  budget TEXT,
  start_date TEXT,
  completion_date TEXT,
  status TEXT NOT NULL CHECK (status IN ('Completed', 'In Progress', 'Planning')),
  square_meters TEXT,
  architect TEXT,
  engineer TEXT,
  cover_image_url TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  challenges TEXT,
  solutions TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROJECT IMAGES
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SERVICES (Engineering Disciplines)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Building2',
  image_url TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  order_index INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. QUOTE REQUESTS (Tender Submissions & BOQ Inquiries)
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  project_type TEXT NOT NULL,
  location TEXT NOT NULL,
  square_meters TEXT,
  floors TEXT,
  timeline TEXT,
  target_start_date TEXT,
  estimated_budget TEXT,
  description TEXT NOT NULL,
  document_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Under Review', 'Quoted', 'Approved', 'Rejected', 'Completed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CONTACT MESSAGES (General Inbound Inquiries)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TESTIMONIALS (Client Endorsements)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  company TEXT NOT NULL,
  project_reference TEXT,
  image_url TEXT,
  content TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TEAM MEMBERS (Key Engineering Staff)
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  qualifications TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  biography TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. BLOG POSTS (Engineering Knowledgebase)
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL,
  read_time_minutes INT NOT NULL DEFAULT 5,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  cover_image_url TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. SITE SETTINGS (Global Corporate Identity & Statutory Data)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  company_name TEXT NOT NULL DEFAULT 'BuildCore Construction & Engineering Ltd',
  company_tagline TEXT NOT NULL,
  nca_registration_number TEXT NOT NULL,
  nca_category TEXT NOT NULL,
  iso_certifications TEXT NOT NULL,
  logo_url TEXT,
  phone TEXT NOT NULL,
  emergency_phone TEXT,
  email TEXT NOT NULL,
  support_email TEXT,
  address TEXT NOT NULL,
  city_country TEXT NOT NULL,
  whatsapp_number TEXT,
  google_maps_embed_url TEXT,
  business_hours TEXT NOT NULL,
  about_summary TEXT NOT NULL,
  mission TEXT NOT NULL,
  vision TEXT NOT NULL,
  core_values TEXT[] DEFAULT '{}',
  stats_experience_years INT NOT NULL DEFAULT 24,
  stats_projects_completed INT NOT NULL DEFAULT 184,
  stats_workforce_count INT NOT NULL DEFAULT 1450,
  stats_safety_record_hours TEXT NOT NULL DEFAULT '6.2M+ Safe Man-Hours without LTI',
  social_facebook TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  social_instagram TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Helper Function to Check Admin or Manager
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles can be viewed by anyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.is_admin_or_manager());

-- Projects (Public can read, Admins can write)
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL USING (public.is_admin_or_manager());

-- Project Images
CREATE POLICY "Project images viewable by everyone" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage project images" ON public.project_images FOR ALL USING (public.is_admin_or_manager());

-- Services (Public can read, Admins can write)
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (public.is_admin_or_manager());

-- Quotes (Anyone can insert, Owner or Admin can read/update)
CREATE POLICY "Anyone can submit quote requests" ON public.quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own quotes" ON public.quote_requests FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_manager());
CREATE POLICY "Admins can update quotes" ON public.quote_requests FOR ALL USING (public.is_admin_or_manager());

-- Contact Messages (Anyone can submit, Admins can read/manage)
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read contact messages" ON public.contact_messages FOR ALL USING (public.is_admin_or_manager());

-- Testimonials, Team, Blog, Settings (Public read, Admin write)
CREATE POLICY "Testimonials public select" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Testimonials admin all" ON public.testimonials FOR ALL USING (public.is_admin_or_manager());

CREATE POLICY "Team public select" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Team admin all" ON public.team_members FOR ALL USING (public.is_admin_or_manager());

CREATE POLICY "Blog public select" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Blog admin all" ON public.blog_posts FOR ALL USING (public.is_admin_or_manager());

CREATE POLICY "Site Settings public select" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Site Settings admin all" ON public.site_settings FOR ALL USING (public.is_admin_or_manager());

-- Automatic Profile Creation Trigger on Supabase Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;

  const copySql = () => {
    navigator.clipboard.writeText(fullSqlSchema);
    setCopiedSql(true);
    showToast('Complete Supabase SQL Schema copied to clipboard!', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded">
                Database Architecture
              </span>
              <span className="text-xs text-slate-400 font-mono">Engine: PostgreSQL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Supabase Setup & Production Integration
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Connect external Supabase project credentials, configure storage buckets, and run the SQL schema.
            </p>
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow transition-colors shrink-0"
          >
            <span>Open Supabase Dashboard</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Current Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Supabase Connection State</span>
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isSupabaseConfigured ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {isSupabaseConfigured ? 'Live Connected' : 'Local Fallback Mode'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">VITE_SUPABASE_URL:</span>
                <span className="text-white truncate max-w-[200px]">{supabaseUrl}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">VITE_SUPABASE_ANON_KEY:</span>
                <span className="text-white">{supabaseKey}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              When real Supabase credentials are provided in your environment, the platform automatically switches from local storage to live PostgreSQL, auth sessions, and bucket uploads.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-400" />
              <span>Required Supabase Storage Buckets (4 Total)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">project-photos</span>
                  <span className="text-[11px] text-slate-400">Site photos, renders (10MB limit)</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Public</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">company-assets</span>
                  <span className="text-[11px] text-slate-400">Logos, certifications, PDFs (5MB limit)</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Public</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">blog-covers</span>
                  <span className="text-[11px] text-slate-400">Engineering blog covers (5MB limit)</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Public</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">tender-documents</span>
                  <span className="text-[11px] text-slate-400">BOQ, CAD DWG, Tender RFP (50MB)</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded">Private RLS</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Create these 4 storage buckets in your Supabase Storage dashboard. The migration script automatically inserts bucket records and RLS policies for you.
            </p>
          </div>
        </div>

        {/* SQL Script Section */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <span>PostgreSQL Database Schema & RLS Policies</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Execute this in your Supabase Project's SQL Editor to instantiate all tables and RBAC policies.
              </p>
            </div>
            <button
              onClick={copySql}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow transition-colors shrink-0 cursor-pointer"
            >
              {copiedSql ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>SQL Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL Script</span>
                </>
              )}
            </button>
          </div>

          <pre className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-slate-300 font-mono text-[11px] max-h-96 overflow-y-auto leading-relaxed">
            {fullSqlSchema}
          </pre>
        </div>

      </div>
    </AdminLayout>
  );
};
