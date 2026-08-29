import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Dr. Elena Rostova',
      role: 'Lead Quantum Physicist, Oxford Q-Lab',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      comment:
        'TaskVerse AI is the only system that handles multi-tier academic research schedules, laboratory time-blocking, and daily habits with effortless zero friction. It feels like software built in 2035.',
      rating: 5,
    },
    {
      name: 'Marcus Sterling',
      role: 'Founding Engineer, HyperScale AI',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      comment:
        'The Web Audio sound synthesis and instant NLP task capture replaced 4 separate tools for me (Notion, Todoist, Forest, and Apple Calendar). The 6-axis mastery radar is pure dopamine.',
      rating: 5,
    },
    {
      name: 'Sarah Chen',
      role: 'Venture Partner & Triathlete',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      comment:
        'The combination of OKR strategic goal tracking and the habit streak matrix kept me consistent for 90 days straight. Worth every single dollar for high performers.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 relative select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            PROVEN BY VISIONARIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
            Loved by Elite Engineers & Researchers
          </h2>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            Discover why world-class thinkers, builders, and scholars rely on TaskVerse AI daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl hover:border-amber-500/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: rev.rating }).map((_, r) => (
                    <Star key={r} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                  &quot;{rev.comment}&quot;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                />
                <div>
                  <h4 className="text-xs font-extrabold text-white">{rev.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
