export type UserRole = 'customer' | 'manager' | 'admin';

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';

export type QuoteStatus = 
  | 'New' 
  | 'Under Review'
  | 'Reviewing' 
  | 'Contacted' 
  | 'Site Visit Scheduled' 
  | 'Quoted'
  | 'Quotation Sent' 
  | 'Approved' 
  | 'Rejected' 
  | 'Completed';

export type MessageStatus = 'unread' | 'read' | 'archived' | 'replied';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  active?: boolean;
  company_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  image_url: string;
  icon: string;
  category: string;
  features: string[];
  active: boolean;
  display_order?: number;
  order_index?: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  location: string;
  client: string;
  project_type: string; // e.g. Commercial, Residential, Civil Works, Infrastructure, Industrial
  status: ProjectStatus;
  start_date?: string;
  completion_date?: string;
  budget?: string;
  cover_image_url: string;
  featured: boolean;
  square_meters?: string;
  architect?: string;
  engineer?: string;
  challenges?: string;
  solutions?: string;
  features?: string[];
  gallery_urls?: string[];
  images?: ProjectImage[];
  order_index?: number;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequest {
  id: string;
  user_id?: string | null;
  name: string;
  company_name?: string;
  email: string;
  phone: string;
  service_id?: string;
  project_type: string;
  location: string;
  square_meters?: string;
  floors?: string;
  timeline?: string;
  target_start_date?: string;
  preferred_start_date?: string;
  estimated_budget?: string;
  budget?: string;
  description: string;
  document_urls?: string[];
  attachment_urls?: string[];
  status: QuoteStatus;
  admin_notes?: string;
  estimated_quote_amount?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name?: string;
  customer_name?: string;
  role?: string;
  company: string;
  content: string;
  rating: number;
  avatar_url?: string;
  image_url?: string;
  project_title?: string;
  project_reference?: string;
  featured?: boolean;
  active: boolean;
  order_index?: number;
  created_at: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  position?: string;
  bio?: string;
  biography?: string;
  image_url: string;
  email?: string;
  phone?: string;
  display_order?: number;
  order_index?: number;
  active: boolean;
  qualifications?: string | string[];
  created_at: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  excerpt?: string;
  content: string;
  cover_image_url: string;
  author?: string;
  author_id?: string;
  author_name?: string;
  category: string;
  tags?: string[];
  read_time_minutes?: number;
  published: boolean;
  published_date?: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id?: string;
  company_name: string;
  company_tagline: string;
  tagline?: string;
  nca_registration_number: string;
  nca_number?: string;
  nca_category: string;
  iso_certifications: string;
  logo_url: string;
  phone: string;
  emergency_phone?: string;
  email: string;
  support_email?: string;
  address: string;
  city_country?: string;
  whatsapp?: string;
  whatsapp_number?: string;
  google_maps_embed_url?: string;
  business_hours?: string;
  about_summary?: string;
  mission: string;
  vision: string;
  core_values?: string[];
  years_experience?: number;
  completed_projects_count?: number;
  equipment_count?: number;
  expert_workforce_count?: number;
  stats_experience_years?: number;
  stats_projects_completed?: number;
  stats_workforce_count?: number;
  stats_safety_record_hours?: string;
  social_facebook?: string;
  social_linkedin?: string;
  social_twitter?: string;
  social_instagram?: string;
  updated_at?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  bucket: string;
  size_bytes: number;
  created_at: string;
}
