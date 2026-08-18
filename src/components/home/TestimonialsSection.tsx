import React, { useEffect, useState } from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '../../types';
import { db } from '../../lib/database';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const list = await db.getTestimonials();
        setTestimonials(list.filter(t => t.active));
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      }
    }
    load();
  }, []);

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Client Endorsements
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Trusted by East Africa’s Foremost Developers
          </h2>
          <p className="text-sm text-slate-400">
            Read what corporate clients, institutional asset managers, and infrastructure directors say about partnering with ApexBuild.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(item => (
            <div
              key={item.id}
              className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-6 relative hover:border-amber-500/40 transition-all shadow-xl"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.customer_name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-sm">
                    {item.customer_name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs text-white">{item.customer_name}</h4>
                  <p className="text-[11px] text-slate-400">{item.company}</p>
                  {item.project_reference && (
                    <span className="text-[10px] text-amber-400 font-mono block mt-0.5">
                      Ref: {item.project_reference}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
