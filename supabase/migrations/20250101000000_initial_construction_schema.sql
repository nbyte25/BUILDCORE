-- =====================================================================
-- BUILDCORE CONSTRUCTION & ENGINEERING LTD - SUPABASE DATABASE MIGRATION
-- Production-grade schema with strict Row Level Security (RLS), triggers,
-- functions, indexes, and storage bucket definitions.
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'manager', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quote_status AS ENUM (
      'New', 
      'Under Review',
      'Reviewing', 
      'Contacted', 
      'Site Visit Scheduled', 
      'Quoted',
      'Quotation Sent', 
      'Approved', 
      'Rejected', 
      'Completed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_status AS ENUM ('unread', 'read', 'archived', 'replied');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (CONNECTED TO AUTH.USERS)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    active BOOLEAN NOT NULL DEFAULT true,
    company_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Building2',
    category TEXT NOT NULL DEFAULT 'Commercial',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    location TEXT NOT NULL,
    client TEXT NOT NULL,
    project_type TEXT NOT NULL,
    status project_status NOT NULL DEFAULT 'Planning',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completion_date DATE,
    budget TEXT,
    cover_image_url TEXT NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT false,
    square_meters TEXT,
    architect TEXT,
    engineer TEXT,
    challenges TEXT,
    solutions TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    gallery_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. PROJECT IMAGES TABLE (ONE-TO-MANY WITH PROJECTS)
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. QUOTE REQUESTS TABLE
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
    target_start_date DATE,
    preferred_start_date DATE,
    estimated_budget TEXT,
    budget TEXT NOT NULL,
    description TEXT NOT NULL,
    document_urls JSONB DEFAULT '[]'::jsonb,
    attachment_urls JSONB DEFAULT '[]'::jsonb,
    status quote_status NOT NULL DEFAULT 'New',
    admin_notes TEXT,
    estimated_quote_amount TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status message_status NOT NULL DEFAULT 'unread',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    company TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    image_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    active BOOLEAN NOT NULL DEFAULT true,
    project_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    biography TEXT NOT NULL,
    image_url TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    display_order INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    qualifications JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL DEFAULT 'BuildCore Engineering Team',
    category TEXT NOT NULL DEFAULT 'Engineering & Technology',
    tags JSONB DEFAULT '["Construction", "Engineering"]'::jsonb,
    read_time_minutes INT DEFAULT 5,
    published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. SITE SETTINGS TABLE (SINGLETON OR KEY-VALUE STORE)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial site settings
INSERT INTO public.site_settings (key, value)
VALUES (
  'main_config',
  '{
    "company_name": "BuildCore Construction & Engineering Ltd",
    "company_tagline": "Building Africa’s Enduring Infrastructure & Architectural Landmarks",
    "nca_registration_number": "NCA/1/0892/24 [NCA 1 ACCREDITED]",
    "nca_category": "NCA 1 - Building Works & Heavy Civil Engineering (Unlimited Value)",
    "iso_certifications": "ISO 9001:2015 (QMS) | ISO 14001:2015 (EMS) | ISO 45001:2018 (OH&S)",
    "logo_url": "/logo.svg",
    "phone": "+254 (0) 20 780 9000",
    "emergency_phone": "+254 (0) 700 890 123",
    "email": "info@buildcore.co.ke",
    "support_email": "projects@buildcore.co.ke",
    "address": "BuildCore Towers, 8th Floor, Hospital Road, Upper Hill",
    "city_country": "Nairobi, Kenya (P.O. Box 45892-00100)",
    "whatsapp_number": "+254700890123",
    "business_hours": "Monday - Friday: 07:30 - 17:30 | Saturday: 08:00 - 13:00 (Emergency 24/7)",
    "about_summary": "BuildCore Construction & Engineering Ltd is East Africa’s premier tier-one engineering, procurement, and construction (EPC) contractor. Registered with the National Construction Authority (NCA-1) with unlimited project value capacity, we have delivered over 180+ mission-critical commercial, civil, and industrial developments across Kenya and East Africa over the last 24 years.",
    "mission": "To construct enduring, sustainable, and engineering-sound infrastructure that accelerates socio-economic development across East Africa with zero-harm safety standards.",
    "vision": "To be the most trusted, innovative, and technologically advanced African construction conglomerate by 2030.",
    "stats_experience_years": 24,
    "stats_projects_completed": 184,
    "stats_workforce_count": 1450,
    "stats_safety_record_hours": "6.2M+ Safe Man-Hours without LTI"
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- =====================================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(active, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_user_id ON public.quote_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published, published_at DESC);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Helper function to check if current authenticated user is an admin or manager
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN AS $$
DECLARE
  user_role_val user_role;
BEGIN
  SELECT role INTO user_role_val FROM public.profiles WHERE id = auth.uid();
  RETURN (user_role_val IN ('admin', 'manager'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role_val user_role;
BEGIN
  SELECT role INTO user_role_val FROM public.profiles WHERE id = auth.uid();
  RETURN (user_role_val = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES RLS
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin_or_manager());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())); -- cannot elevate own role

CREATE POLICY "Admins can update any profile"
    ON public.profiles FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Allow trigger insert profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id OR public.is_admin());

-- 2. SERVICES RLS (Public read active, Admin full CRUD)
CREATE POLICY "Public read active services"
    ON public.services FOR SELECT
    USING (active = true OR public.is_admin_or_manager());

CREATE POLICY "Admins manage services"
    ON public.services FOR ALL
    USING (public.is_admin_or_manager());

-- 3. PROJECTS RLS (Public read all/published, Admin full CRUD)
CREATE POLICY "Public read projects"
    ON public.projects FOR SELECT
    USING (true);

CREATE POLICY "Admins manage projects"
    ON public.projects FOR ALL
    USING (public.is_admin_or_manager());

-- 4. PROJECT IMAGES RLS
CREATE POLICY "Public read project images"
    ON public.project_images FOR SELECT
    USING (true);

CREATE POLICY "Admins manage project images"
    ON public.project_images FOR ALL
    USING (public.is_admin_or_manager());

-- 5. QUOTE REQUESTS RLS
-- Anyone (guest or authenticated) can submit a quote request
CREATE POLICY "Anyone can insert quote request"
    ON public.quote_requests FOR INSERT
    WITH CHECK (true);

-- Authenticated customers can read their own quote requests
CREATE POLICY "Customers read own quotes"
    ON public.quote_requests FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin_or_manager());

-- Admins/managers can update quotes
CREATE POLICY "Admins manage quote requests"
    ON public.quote_requests FOR ALL
    USING (public.is_admin_or_manager());

-- 6. CONTACT MESSAGES RLS
CREATE POLICY "Anyone can submit contact message"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins manage contact messages"
    ON public.contact_messages FOR ALL
    USING (public.is_admin_or_manager());

-- 7. TESTIMONIALS RLS
CREATE POLICY "Public read active testimonials"
    ON public.testimonials FOR SELECT
    USING (active = true OR public.is_admin_or_manager());

CREATE POLICY "Admins manage testimonials"
    ON public.testimonials FOR ALL
    USING (public.is_admin_or_manager());

-- 8. TEAM MEMBERS RLS
CREATE POLICY "Public read active team"
    ON public.team_members FOR SELECT
    USING (active = true OR public.is_admin_or_manager());

CREATE POLICY "Admins manage team"
    ON public.team_members FOR ALL
    USING (public.is_admin_or_manager());

-- 9. BLOG POSTS RLS
CREATE POLICY "Public read published blog posts"
    ON public.blog_posts FOR SELECT
    USING (published = true OR public.is_admin_or_manager());

CREATE POLICY "Admins manage blog posts"
    ON public.blog_posts FOR ALL
    USING (public.is_admin_or_manager());

-- 10. SITE SETTINGS RLS
CREATE POLICY "Public read site settings"
    ON public.site_settings FOR SELECT
    USING (true);

CREATE POLICY "Admins manage site settings"
    ON public.site_settings FOR ALL
    USING (public.is_admin_or_manager());

-- =====================================================================
-- DATABASE TRIGGERS
-- =====================================================================

-- Auto handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_quote_requests_updated_at BEFORE UPDATE ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto create profile on auth.user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, active)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        'customer',
        true
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- STORAGE BUCKETS AND STORAGE POLICIES
-- =====================================================================
-- Note: In Supabase Storage, buckets are created in storage.buckets:
INSERT INTO storage.buckets (id, name, public) VALUES 
('project-photos', 'project-photos', true),
('company-assets', 'company-assets', true),
('blog-covers', 'blog-covers', true),
('tender-documents', 'tender-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Access Policies
CREATE POLICY "Public Read Public Buckets"
ON storage.objects FOR SELECT
USING (bucket_id IN ('project-photos', 'company-assets', 'blog-covers'));

CREATE POLICY "Admin Uploads All Buckets"
ON storage.objects FOR ALL
USING (public.is_admin_or_manager());

CREATE POLICY "Customer Upload Tender Documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tender-documents');

CREATE POLICY "Customer Read Own Tender Documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'tender-documents' AND (auth.uid() = owner OR public.is_admin_or_manager()));
