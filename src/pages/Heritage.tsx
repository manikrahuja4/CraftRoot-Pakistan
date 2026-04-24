import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Wind, Droplets, MapPin } from "lucide-react";

export default function Heritage() {
  const eras = [
    {
      year: "3000 BCE",
      title: "Ancient Roots",
      desc: "Old cotton pieces found in Mohenjo-Daro show how people have been using handmade dyes for thousands of years.",
      img: "/heritage-era-1.jpg",
      accent: "Mohenjo-Daro"
    },
    {
      year: "14th Century",
      title: "Artisan Growth",
      desc: "Ajrak patterns are inspired by local culture and nature, creating beautiful designs that are known all over the world.",
      img: "/heritage-era-2.jpg",
      accent: "Hala, Sindh"
    },
    {
      year: "Present Day",
      title: "Helping Local Artisans",
      desc: "CraftRoot works with local communities to make sure their skills and traditions continue to grow today.",
      img: "/heritage-current.jpg",
      accent: "Thar Desert"
    }
  ];

  return (
    <div className="pb-32 textile-texture-light bg-brand-cream/50 overflow-x-hidden">
      {/* Editorial Heritage Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto w-full min-h-[50vh] bg-brand-indigo rounded-[3rem] overflow-hidden shadow-sm relative flex items-center justify-center px-6 py-12">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <img
              src="/heritage-hero.jpg"
              className="w-full h-full object-cover opacity-60 grayscale mix-blend-overlay"
              alt="Heritage Background"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-indigo via-transparent to-brand-indigo/40" />
          </div>

          <div className="relative z-10 text-center space-y-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-8"
            >
              <span className="inline-flex items-center space-x-3 px-6 py-2.5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full text-[10px] uppercase tracking-[0.4em] font-black text-brand-earth shadow-sm mx-auto">
                <Globe size={14} />
                <span>The History of the Indus</span>
              </span>
              
              <h1 className="serif text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-medium leading-[0.85] tracking-tighter text-brand-cream">
                Our <br />
                <span className="italic font-light text-brand-earth">Heritage</span>
              </h1>

              <p className="text-lg md:text-xl text-brand-cream/60 max-w-xl mx-auto leading-relaxed font-light font-sans tracking-tight">
                Tracing 5,000 years of history through handmade local crafts. We don't just sell products; we help preserve our culture.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Timeline - Asymmetrical Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-32">
            {eras.map((era, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex flex-col gap-12 items-center",
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                )}
              >
                <div className="w-full lg:w-1/2 space-y-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 text-brand-maroon">
                        <span className="text-[10px] uppercase tracking-[0.5em] font-black">{era.year}</span>
                        <div className="w-12 h-[1px] bg-brand-maroon/30" />
                      </div>
                      <h2 className="serif text-3xl md:text-[4.5rem] font-medium leading-none tracking-tighter text-brand-indigo">
                        {era.title.split(' ')[0]} <br />
                        <span className="italic font-light text-brand-maroon">{era.title.split(' ')[1]}</span>
                      </h2>
                   </div>
                   <p className="text-xl md:text-2xl text-brand-indigo/60 leading-relaxed max-w-lg font-light tracking-tight">
                     {era.desc}
                   </p>
                   <div className="flex items-center gap-6">
                      <MapPin size={18} className="text-brand-maroon" />
                      <span className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-indigo/40">{era.accent}</span>
                   </div>
                </div>

                <div className="w-full lg:w-1/2 relative group">
                   <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-5xl rotating-grain relative z-10 transition-transform duration-1000 group-hover:scale-[1.02]">
                      <img src={era.img} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" referrerPolicy="no-referrer" />
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-maroon/5 rounded-full blur-[100px] group-hover:bg-brand-maroon/10 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Elements Section */}
      <section className="bg-brand-indigo py-20 md:py-32 rounded-[3rem] mx-4 md:mx-8 shadow-5xl relative overflow-hidden">
        <div className="absolute inset-0 ajrak-pattern-subtle opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 space-y-6">
             <h2 className="serif text-3xl md:text-[4rem] font-medium text-brand-cream tracking-tighter">Natural <span className="italic font-light text-brand-earth">Elements</span></h2>
             <div className="w-24 h-[1px] bg-brand-earth mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: <Wind />, title: "The Wind", desc: "The dry desert air in Hala is perfect for drying fabrics after they are dyed with natural colors." },
              { icon: <Droplets />, title: "The Water", desc: "The special minerals in the Indus river help the natural colors stick perfectly to the fabric." },
              { icon: <Globe />, title: "The Earth", desc: "Our dyes are made from natural things like pomegranate skin, leaves, and desert minerals." }
            ].map((element, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-2xl p-16 rounded-[3rem] border border-white/10 space-y-10 hover:bg-white/15 transition-all duration-700">
                <div className="text-brand-earth scale-150 transform origin-left w-12 h-12">
                   {element.icon}
                </div>
                <div className="space-y-4">
                  <h4 className="serif text-3xl font-medium text-brand-cream">{element.title}</h4>
                  <p className="text-sm text-brand-cream/50 leading-relaxed font-light font-sans tracking-tight">{element.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Editorial Call */}
      <section className="py-24 md:py-32 text-center px-6">
        <div className="max-w-4xl mx-auto space-y-12">
           <div className="w-1px h-24 bg-brand-maroon/20 mx-auto" />
           <p className="serif text-3xl md:text-5xl font-light italic text-brand-indigo tracking-tight leading-snug">
             "To buy a piece of CraftRoot is to help preserve our culture. You are holding five thousand years of history."
           </p>
           <div className="pt-8">
             <Link to="/shop" className="btn-modern-primary min-w-[280px]">
                Shop the Collection
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
}

// Helper function for conditional classes if not already available in global scope
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
