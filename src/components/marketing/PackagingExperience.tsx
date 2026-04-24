
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Heart, GraduationCap, ShieldCheck } from 'lucide-react';

const icons = [
  { 
    icon: Package, 
    title: "Eco Packaging", 
    desc: "Hand-wrapped in 100% recycled acid-free paper and biodegradable boxes." 
  },
  { 
    icon: Heart, 
    title: "Artisan Thank-You", 
    desc: "Every piece includes a signed note from the master artisan who created it." 
  },
  { 
    icon: GraduationCap, 
    title: "Heritage Story Card", 
    desc: "A collector's card detailing the 400+ year history of your specific craft." 
  },
  { 
    icon: ShieldCheck, 
    title: "Authenticity Seal", 
    desc: "Verification certificate ensuring real artisan wages and genuine materials." 
  }
];

export default function PackagingExperience() {
  return (
    <section className="py-24 bg-brand-indigo text-brand-cream overflow-hidden relative">
      <div className="absolute inset-0 ajrak-pattern-subtle opacity-5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-earth/60">The Unboxing</span>
          <h2 className="serif text-4xl md:text-5xl">What You Receive</h2>
          <p className="text-brand-cream/60 max-w-xl mx-auto font-light">
            Luxury is in the details. We ensure every delivery feels like an inheritance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {icons.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-6 group"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-earth/20 transition-colors duration-500">
                <item.icon size={28} className="text-brand-earth" />
              </div>
              <div className="space-y-2">
                <h3 className="serif text-xl">{item.title}</h3>
                <p className="text-sm text-brand-cream/50 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
