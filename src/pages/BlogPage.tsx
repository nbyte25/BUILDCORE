import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, User, ArrowRight, Search, Tag } from 'lucide-react';
import { BlogPost } from '../types';
import { db } from '../lib/database';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await db.getBlogPosts();
        setPosts(list.filter(p => p.published));
        setFilteredPosts(list.filter(p => p.published));
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let result = posts;

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      );
    }

    setFilteredPosts(result);
  }, [selectedCategory, searchQuery, posts]);

  const categories = ['All', 'Structural Engineering', 'Regulatory Compliance', 'Technology & BIM', 'Civil Infrastructure'];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* 1. HERO HEADER */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Engineering Whitepapers & Insights
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Construction Technology, Concrete Dynamics & NCA Regulatory Guidance
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Technical articles and thought leadership authored by ApexBuild’s structural engineers, quantity surveyors, and project directors.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FILTER BAR */}
      <section className="bg-slate-50 border-b border-slate-200 py-6 sticky top-20 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles & guides..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-400 shadow-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. ARTICLES LIST */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No matching technical articles found</h3>
              <p className="text-xs text-slate-500">Try selecting a different category or clearing search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <article
                  key={post.id}
                  id={`blog-post-card-${post.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-900">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {post.read_time_minutes || 5} min read
                        </span>
                        <span>•</span>
                        <span>{post.author_name}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-950 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors"
                      >
                        <span>Read Paper</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
