import { BlogPost, ContactMessage, MediaAsset, Profile, Project, ProjectImage, QuoteRequest, Service, SiteSettings, TeamMember, Testimonial, UserRole } from '../types';
import { 
  INITIAL_BLOG_POSTS, 
  INITIAL_CONTACT_MESSAGES, 
  INITIAL_PROJECTS, 
  INITIAL_QUOTE_REQUESTS, 
  INITIAL_SERVICES, 
  INITIAL_SITE_SETTINGS, 
  INITIAL_TEAM, 
  INITIAL_TESTIMONIALS 
} from './seedData';
import { isSupabaseConfigured, supabase } from './supabase';
import { uploadFile as storageUploadFile, UploadOptions } from './storage';

const STORAGE_KEYS = {
  SERVICES: 'buildcore_services_v1',
  PROJECTS: 'buildcore_projects_v1',
  QUOTES: 'buildcore_quotes_v1',
  MESSAGES: 'buildcore_messages_v1',
  TESTIMONIALS: 'buildcore_testimonials_v1',
  TEAM: 'buildcore_team_v1',
  BLOG: 'buildcore_blog_v1',
  SETTINGS: 'buildcore_settings_v1',
  PROFILES: 'buildcore_profiles_v1',
  MEDIA: 'buildcore_media_v1'
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const db = {
  // ==========================================
  // SERVICES
  // ==========================================
  async getServices(): Promise<Service[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data as Service[];
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local store:', e);
      }
    }
    return getLocal<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES)
      .sort((a, b) => a.display_order - b.display_order);
  },

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const services = await this.getServices();
    return services.find(s => s.slug === slug) || null;
  },

  async createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
    const newService: Service = {
      ...service,
      id: 'srv-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('services')
          .insert([service])
          .select()
          .single();
        if (!error && data) return data as Service;
      } catch (e) {
        console.error('Supabase service insert error:', e);
      }
    }

    const list = await this.getServices();
    const updated = [...list, newService];
    setLocal(STORAGE_KEYS.SERVICES, updated);
    return newService;
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('services')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as Service;
      } catch (e) {
        console.error('Supabase service update error:', e);
      }
    }

    const list = await this.getServices();
    const index = list.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Service not found');
    const updated = { ...list[index], ...updates, updated_at: new Date().toISOString() };
    list[index] = updated;
    setLocal(STORAGE_KEYS.SERVICES, list);
    return updated;
  },

  async deleteService(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase service delete error:', e);
      }
    }
    const list = await this.getServices();
    const filtered = list.filter(s => s.id !== id);
    setLocal(STORAGE_KEYS.SERVICES, filtered);
  },

  // ==========================================
  // PROJECTS
  // ==========================================
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*, images:project_images(*)')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Project[];
      } catch (e) {
        console.warn('Supabase fetch failed for projects:', e);
      }
    }
    return getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const list = await this.getProjects();
    return list.find(p => p.slug === slug) || null;
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: 'proj-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: project.images || []
    };

    if (isSupabaseConfigured) {
      try {
        const { images, ...projData } = project;
        const { data, error } = await supabase
          .from('projects')
          .insert([projData])
          .select()
          .single();
        if (!error && data) {
          if (images && images.length > 0) {
            const imagePayload = images.map((img, idx) => ({
              project_id: data.id,
              image_url: img.image_url,
              caption: img.caption,
              display_order: idx + 1
            }));
            await supabase.from('project_images').insert(imagePayload);
          }
          return data as Project;
        }
      } catch (e) {
        console.error('Supabase project insert error:', e);
      }
    }

    const list = await this.getProjects();
    const updated = [newProject, ...list];
    setLocal(STORAGE_KEYS.PROJECTS, updated);
    return newProject;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (isSupabaseConfigured) {
      try {
        const { images, ...projData } = updates;
        const { data, error } = await supabase
          .from('projects')
          .update({ ...projData, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as Project;
      } catch (e) {
        console.error('Supabase project update error:', e);
      }
    }

    const list = await this.getProjects();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    const updated = { ...list[index], ...updates, updated_at: new Date().toISOString() };
    list[index] = updated;
    setLocal(STORAGE_KEYS.PROJECTS, list);
    return updated;
  },

  async deleteProject(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase project delete error:', e);
      }
    }
    const list = await this.getProjects();
    const filtered = list.filter(p => p.id !== id);
    setLocal(STORAGE_KEYS.PROJECTS, filtered);
  },

  // ==========================================
  // QUOTE REQUESTS
  // ==========================================
  async getQuoteRequests(): Promise<QuoteRequest[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('quote_requests')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as QuoteRequest[];
      } catch (e) {
        console.warn('Supabase fetch failed for quote requests:', e);
      }
    }
    return getLocal<QuoteRequest[]>(STORAGE_KEYS.QUOTES, INITIAL_QUOTE_REQUESTS);
  },

  async getCustomerQuotes(userId?: string, email?: string): Promise<QuoteRequest[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('quote_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        } else if (email) {
          query = query.eq('email', email);
        }

        const { data, error } = await query;
        if (!error && data) return data as QuoteRequest[];
      } catch (e) {
        console.warn('Supabase fetch failed for customer quotes:', e);
      }
    }
    const all = await this.getQuoteRequests();
    if (userId) {
      return all.filter(q => q.user_id === userId);
    }
    if (email) {
      return all.filter(q => q.email.toLowerCase() === email.toLowerCase());
    }
    return all;
  },

  async createQuoteRequest(quote: Omit<QuoteRequest, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<QuoteRequest> {
    const newQuote: QuoteRequest = {
      ...quote,
      id: 'qr-' + Date.now(),
      status: 'New',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('quote_requests')
          .insert([{ ...quote, status: 'New' }])
          .select()
          .single();
        if (!error && data) return data as QuoteRequest;
      } catch (e) {
        console.error('Supabase quote request insert error:', e);
      }
    }

    const list = await this.getQuoteRequests();
    const updated = [newQuote, ...list];
    setLocal(STORAGE_KEYS.QUOTES, updated);
    return newQuote;
  },

  async updateQuoteStatus(id: string, status: QuoteRequest['status'], admin_notes?: string, estimated_quote_amount?: string): Promise<QuoteRequest> {
    const updates: Partial<QuoteRequest> = { status, updated_at: new Date().toISOString() };
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;
    if (estimated_quote_amount !== undefined) updates.estimated_quote_amount = estimated_quote_amount;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('quote_requests')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as QuoteRequest;
      } catch (e) {
        console.error('Supabase quote update error:', e);
      }
    }

    const list = await this.getQuoteRequests();
    const index = list.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quote request not found');
    const updated = { ...list[index], ...updates };
    list[index] = updated;
    setLocal(STORAGE_KEYS.QUOTES, list);
    return updated;
  },

  async updateQuoteRequest(id: string, updates: Partial<QuoteRequest>): Promise<QuoteRequest> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('quote_requests')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as QuoteRequest;
      } catch (e) {
        console.error('Supabase quote update error:', e);
      }
    }

    const list = await this.getQuoteRequests();
    const index = list.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quote request not found');
    const updated = { ...list[index], ...updates, updated_at: new Date().toISOString() };
    list[index] = updated;
    setLocal(STORAGE_KEYS.QUOTES, list);
    return updated;
  },

  async deleteQuoteRequest(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('quote_requests').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase quote delete error:', e);
      }
    }
    const list = await this.getQuoteRequests();
    const filtered = list.filter(q => q.id !== id);
    setLocal(STORAGE_KEYS.QUOTES, filtered);
  },

  async getUserQuoteRequests(userId?: string, email?: string): Promise<QuoteRequest[]> {
    return this.getCustomerQuotes(userId, email);
  },

  // ==========================================
  // CONTACT MESSAGES
  // ==========================================
  async getContactMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as ContactMessage[];
      } catch (e) {
        console.warn('Supabase fetch failed for contact messages:', e);
      }
    }
    return getLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_CONTACT_MESSAGES);
  },

  async createContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      status: 'unread',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .insert([{ ...msg, status: 'unread' }])
          .select()
          .single();
        if (!error && data) return data as ContactMessage;
      } catch (e) {
        console.error('Supabase contact message insert error:', e);
      }
    }

    const list = await this.getContactMessages();
    const updated = [newMsg, ...list];
    setLocal(STORAGE_KEYS.MESSAGES, updated);
    return newMsg;
  },

  async updateContactMessageStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
    return this.updateContactMessage(id, { status });
  },

  async updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as ContactMessage;
      } catch (e) {
        console.error('Supabase contact message update error:', e);
      }
    }

    const list = await this.getContactMessages();
    const index = list.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Message not found');
    const updated = { ...list[index], ...updates, updated_at: new Date().toISOString() };
    list[index] = updated;
    setLocal(STORAGE_KEYS.MESSAGES, list);
    return updated;
  },

  async deleteContactMessage(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('contact_messages').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase contact message delete error:', e);
      }
    }
    const list = await this.getContactMessages();
    const filtered = list.filter(m => m.id !== id);
    setLocal(STORAGE_KEYS.MESSAGES, filtered);
  },

  // ==========================================
  // TESTIMONIALS
  // ==========================================
  async getTestimonials(): Promise<Testimonial[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Testimonial[];
      } catch (e) {
        console.warn('Supabase fetch failed for testimonials:', e);
      }
    }
    return getLocal<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  },

  async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: 'test-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .insert([testimonial])
          .select()
          .single();
        if (!error && data) return data as Testimonial;
      } catch (e) {
        console.error('Supabase testimonial insert error:', e);
      }
    }

    const list = await this.getTestimonials();
    const updated = [newTestimonial, ...list];
    setLocal(STORAGE_KEYS.TESTIMONIALS, updated);
    return newTestimonial;
  },

  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as Testimonial;
      } catch (e) {
        console.error('Supabase testimonial update error:', e);
      }
    }

    const list = await this.getTestimonials();
    const index = list.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Testimonial not found');
    const updated = { ...list[index], ...updates, updated_at: new Date().toISOString() };
    list[index] = updated;
    setLocal(STORAGE_KEYS.TESTIMONIALS, list);
    return updated;
  },

  async deleteTestimonial(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('testimonials').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase testimonial delete error:', e);
      }
    }
    const list = await this.getTestimonials();
    const filtered = list.filter(t => t.id !== id);
    setLocal(STORAGE_KEYS.TESTIMONIALS, filtered);
  },

  // ==========================================
  // TEAM MEMBERS
  // ==========================================
  async getTeamMembers(): Promise<TeamMember[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data as TeamMember[];
      } catch (e) {
        console.warn('Supabase fetch failed for team members:', e);
      }
    }
    return getLocal<TeamMember[]>(STORAGE_KEYS.TEAM, INITIAL_TEAM)
      .sort((a, b) => a.display_order - b.display_order);
  },

  async createTeamMember(member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember> {
    const newMember: TeamMember = {
      ...member,
      id: 'team-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .insert([member])
          .select()
          .single();
        if (!error && data) return data as TeamMember;
      } catch (e) {
        console.error('Supabase team member insert error:', e);
      }
    }

    const list = await this.getTeamMembers();
    const updated = [...list, newMember];
    setLocal(STORAGE_KEYS.TEAM, updated);
    return newMember;
  },

  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as TeamMember;
      } catch (e) {
        console.error('Supabase team update error:', e);
      }
    }

    const list = await this.getTeamMembers();
    const index = list.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Team member not found');
    const updated = { ...list[index], ...updates, updated_at: new Date().toISOString() };
    list[index] = updated;
    setLocal(STORAGE_KEYS.TEAM, list);
    return updated;
  },

  async deleteTeamMember(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('team_members').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase team delete error:', e);
      }
    }
    const list = await this.getTeamMembers();
    const filtered = list.filter(m => m.id !== id);
    setLocal(STORAGE_KEYS.TEAM, filtered);
  },

  // ==========================================
  // BLOG POSTS
  // ==========================================
  async getBlogPosts(): Promise<BlogPost[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false });
        if (!error && data && data.length > 0) return data as BlogPost[];
      } catch (e) {
        console.warn('Supabase fetch failed for blog posts:', e);
      }
    }
    return getLocal<BlogPost[]>(STORAGE_KEYS.BLOG, INITIAL_BLOG_POSTS);
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const list = await this.getBlogPosts();
    return list.find(b => b.slug === slug) || null;
  },

  async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: 'post-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([post])
          .select()
          .single();
        if (!error && data) return data as BlogPost;
      } catch (e) {
        console.error('Supabase blog insert error:', e);
      }
    }

    const list = await this.getBlogPosts();
    const updated = [newPost, ...list];
    setLocal(STORAGE_KEYS.BLOG, updated);
    return newPost;
  },

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as BlogPost;
      } catch (e) {
        console.error('Supabase blog update error:', e);
      }
    }

    const list = await this.getBlogPosts();
    const index = list.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Blog post not found');
    const updated = { ...list[index], ...updates, updated_at: new Date().toISOString() };
    list[index] = updated;
    setLocal(STORAGE_KEYS.BLOG, list);
    return updated;
  },

  async deleteBlogPost(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('blog_posts').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase blog delete error:', e);
      }
    }
    const list = await this.getBlogPosts();
    const filtered = list.filter(b => b.id !== id);
    setLocal(STORAGE_KEYS.BLOG, filtered);
  },

  // ==========================================
  // SITE SETTINGS
  // ==========================================
  async getSiteSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'main_config')
          .single();
        if (!error && data && data.value) return data.value as SiteSettings;
      } catch (e) {
        console.warn('Supabase fetch failed for settings:', e);
      }
    }
    return getLocal<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated: SiteSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('site_settings')
          .upsert({ key: 'main_config', value: updated, updated_at: new Date().toISOString() });
      } catch (e) {
        console.error('Supabase settings update error:', e);
      }
    }

    setLocal(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // ==========================================
  // PROFILES / CUSTOMERS (STRICT SUPABASE RBAC)
  // ==========================================
  async getProfiles(): Promise<Profile[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as Profile[];
      } catch (e) {
        console.warn('Supabase fetch failed for profiles:', e);
      }
    }
    return getLocal<Profile[]>(STORAGE_KEYS.PROFILES, []);
  },

  async getProfileById(id: string): Promise<Profile | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) return data as Profile;
      } catch (e) {
        console.warn('Supabase fetch profile by id failed:', e);
      }
    }
    const list = await this.getProfiles();
    return list.find(p => p.id === id) || null;
  },

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as Profile;
      } catch (e) {
        console.error('Supabase profile update error:', e);
      }
    }

    const list = await this.getProfiles();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) {
      const newProf: Profile = {
        id,
        full_name: updates.full_name || 'Customer User',
        email: updates.email || '',
        role: updates.role || 'customer',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates
      };
      setLocal(STORAGE_KEYS.PROFILES, [...list, newProf]);
      return newProf;
    }

    const updated = { ...list[index], ...updates, updated_at: new Date().toISOString() };
    list[index] = updated;
    setLocal(STORAGE_KEYS.PROFILES, list);
    return updated;
  },

  async updateUserRole(id: string, role: UserRole): Promise<Profile> {
    return this.updateProfile(id, { role });
  },

  // ==========================================
  // MEDIA STORAGE ASSETS
  // ==========================================
  async getMediaAssets(): Promise<MediaAsset[]> {
    return getLocal<MediaAsset[]>(STORAGE_KEYS.MEDIA, [
      {
        id: 'med-1',
        name: 'nairobi-tower-facade.jpg',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        bucket: 'project-images',
        size_bytes: 2450000,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'med-2',
        name: 'heavy-civil-paving.jpg',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
        bucket: 'project-images',
        size_bytes: 1890000,
        created_at: '2024-01-02T00:00:00Z'
      },
      {
        id: 'med-3',
        name: 'highway-expansion.jpg',
        url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
        bucket: 'project-images',
        size_bytes: 3100000,
        created_at: '2024-01-03T00:00:00Z'
      },
      {
        id: 'med-4',
        name: 'karen-eco-villas.jpg',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        bucket: 'project-images',
        size_bytes: 2780000,
        created_at: '2024-01-04T00:00:00Z'
      },
      {
        id: 'med-5',
        name: 'industrial-steel-park.jpg',
        url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
        bucket: 'project-images',
        size_bytes: 2150000,
        created_at: '2024-01-05T00:00:00Z'
      }
    ]);
  },

  async uploadMediaAsset(asset: Omit<MediaAsset, 'id' | 'created_at'>): Promise<MediaAsset> {
    const newAsset: MediaAsset = {
      ...asset,
      id: 'med-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const list = await this.getMediaAssets();
    const updated = [newAsset, ...list];
    setLocal(STORAGE_KEYS.MEDIA, updated);
    return newAsset;
  },

  async deleteMediaAsset(id: string): Promise<void> {
    const list = await this.getMediaAssets();
    const filtered = list.filter(m => m.id !== id);
    setLocal(STORAGE_KEYS.MEDIA, filtered);
  },

  async uploadFile(bucket: string, file: File): Promise<string> {
    const validBuckets = ['project-photos', 'company-assets', 'blog-covers', 'tender-documents'] as const;
    const targetBucket = validBuckets.includes(bucket as any) 
      ? (bucket as typeof validBuckets[number]) 
      : 'company-assets';

    try {
      const result = await storageUploadFile(file, { bucket: targetBucket });
      return result.url;
    } catch (e) {
      console.warn('Storage upload warning, using object URL fallback:', e);
      return URL.createObjectURL(file);
    }
  }
};
