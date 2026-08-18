import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  Share2, 
  Tag, 
  User, 
  Building2,
  CheckCircle2
} from 'lucide-react';
import { BlogPost } from '../types';
import { db } from '../lib/database';
import { useToast } from '../context/ToastContext';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const found = await db.getBlogPostBySlug(slug);
        setPost(found);

        if (found) {
          const all = await db.getBlogPosts();
          const rel = all.filter(p => p.published && p.id !== found.id && p.category === found.category);
          setRelatedPosts(rel.slice(0, 2));
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article URL copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Article Not Found</h2>
        <p className="text-xs text-slate-600">The technical whitepaper could not be located.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog & Insights</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* 1. HERO HEADER */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles & Whitepapers</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{post.read_time_minutes || 5} min read</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                {post.author_name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white">{post.author_name}</p>
                <p className="text-[11px] text-slate-400">{post.created_at.split('T')[0]}</p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. COVER IMAGE & ARTICLE CONTENT */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-[400px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Body Content */}
          <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return <h3 key={idx} className="text-xl font-bold text-slate-950 mt-8 mb-3">{paragraph.replace('### ', '')}</h3>;
              }
              if (paragraph.startsWith('## ')) {
                return <h2 key={idx} className="text-2xl font-black text-slate-950 mt-10 mb-4">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n- ');
                return (
                  <ul key={idx} className="space-y-2 my-4 list-disc list-inside text-slate-700">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400 mr-1" />
              {post.tags.map((t, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Author Box */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-950">Authored by {post.author_name}</h4>
              <p className="text-xs text-slate-600 mt-1">
                Senior engineering director at ApexBuild Engineering & Construction Ltd, specializing in tier-one statutory governance, post-tensioned concrete, and heavy infrastructure delivery.
              </p>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="pt-10 border-t border-slate-200 space-y-6">
              <h3 className="text-xl font-bold text-slate-950">Related Engineering Papers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPosts.map(rp => (
                  <Link
                    key={rp.id}
                    to={`/blog/${rp.slug}`}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all space-y-2 block"
                  >
                    <span className="text-[10px] uppercase font-bold text-amber-600">{rp.category}</span>
                    <h4 className="font-bold text-sm text-slate-950 line-clamp-2">{rp.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{rp.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </article>

    </div>
  );
};
