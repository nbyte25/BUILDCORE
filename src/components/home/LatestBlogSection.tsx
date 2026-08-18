import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { BlogPost } from '../../types';
import { db } from '../../lib/database';

export const LatestBlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const list = await db.getBlogPosts();
        setPosts(list.filter(p => p.published).slice(0, 3));
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      }
    }
    load();
  }, []);

  return (
    <section className="py-20 bg-slate-50 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Knowledge & Insights
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Engineering, Structural Dynamics & NCA Compliance
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mt-2">
              Authoritative industry analysis, concrete technology breakthroughs, and statutory guidelines from our engineering directors.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-950 hover:text-amber-600 transition-colors border-b-2 border-amber-500 pb-1 self-start md:self-auto"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
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

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors"
                  >
                    <span>Read Full Technical Paper</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
