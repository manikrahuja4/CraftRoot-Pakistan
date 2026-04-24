import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Globe, ShieldCheck, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="pb-12 md:pb-24 textile-texture-light flex flex-col gap-10 bg-brand-cream/50">
      {/* Editorial Story Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center p-4 md:p-8">
        <div className="absolute inset-0 m-4 md:m-8 rounded-[3rem] overflow-hidden bg-brand-indigo">
          <img 
            src="/about-hero.jpg" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay grayscale"
            alt="Heritage Background"
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-indigo/60 via-transparent to-brand-indigo/20" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 space-y-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center space-x-3 px-6 py-2 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full text-[10px] uppercase tracking-[0.5em] font-black text-brand-earth">
              The Story of CraftRoot
            </span>
            <h1 className="serif text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-medium text-brand-cream tracking-tighter leading-[0.85]">
              Handmade <br /> 
              <span className="italic font-light text-brand-earth italic">With</span> Soul
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Philosophy: The Core Manifesto */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-12 space-y-16">
             <div className="max-w-4xl space-y-8">
               <h2 className="serif text-3xl md:text-5xl font-medium tracking-tighter leading-tight text-brand-indigo">
                 We believe in the dignity of slow time.
               </h2>
               <p className="text-xl md:text-3xl text-brand-indigo/60 leading-relaxed font-light tracking-tight font-sans border-l-4 border-brand-maroon pl-12 italic">
                 In an era of disposable uniformity, CraftRoot is an traditional art revival. We preserve the human touch in every block strike and every hand-loomed thread.
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
               {[
                 { title: "Direct Contact", icon: <Globe size={24} />, desc: "We work directly with artisans, cutting out the middlemen." },
                 { title: "Preserving Art", icon: <ShieldCheck size={24} />, desc: "We document traditional techniques to keep them alive for future generations." },
                 { title: "Fair Wages", icon: <Heart size={24} />, desc: "We pay fair wages and reinvest in the well-being of our artisan partners." }
               ].map((item, i) => (
                 <div key={i} className="p-12 bg-white/40 backdrop-blur-3xl rounded-4xl border border-white shadow-2xl space-y-8 group hover:bg-brand-maroon transition-all duration-700">
                   <div className="w-16 h-16 rounded-full bg-brand-maroon/5 flex items-center justify-center text-brand-maroon group-hover:bg-brand-cream group-hover:text-brand-maroon transition-all">
                     {item.icon}
                   </div>
                   <div className="space-y-4">
                     <h4 className="text-xl serif font-medium text-brand-indigo group-hover:text-brand-cream transition-colors">{item.title}</h4>
                     <p className="text-sm text-brand-indigo/60 group-hover:text-brand-cream/60 leading-relaxed font-sans">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* Image Narrative Gallery */}
      <section className="px-6 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="aspect-[4/5] rounded-5xl overflow-hidden shadow-5xl rotating-grain ring-1 ring-black/5">
              <img src="/about-story-1.jpg" className="w-full h-full object-cover transition-transform duration-[4000ms] hover:scale-110" referrerPolicy="no-referrer" />
           </div>
           <div className="flex flex-col gap-8">
              <div className="aspect-square rounded-5xl overflow-hidden shadow-5xl ring-1 ring-black/5">
                 <img src="/about-story-2.jpg" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" referrerPolicy="no-referrer" />
              </div>
              <div className="bg-brand-indigo p-16 rounded-5xl text-brand-cream flex flex-col justify-center space-y-8 shadow-5xl">
                 <h3 className="serif text-4xl md:text-6xl font-medium tracking-tighter">The <span className="italic font-light text-brand-earth">Indus</span> <br />Art</h3>
                 <p className="text-lg text-brand-cream/50 leading-relaxed font-light font-sans tracking-tight">
                   From the camel-dung treatment in the Hala winds to the final wash in the sacred Indus. Nature is our co-artisan.
                 </p>
                 <Link to="/heritage" className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-earth hover:text-white transition-colors flex items-center">
                    Biological Records <ArrowRight size={14} className="ml-3" />
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* The Masters - High Fashion Grid */}
      <section className="py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-6">
             <h2 className="serif text-3xl md:text-[4.5rem] font-medium tracking-tighter text-brand-indigo">The <span className="italic font-light">Masters</span></h2>
             <div className="w-24 h-[1px] bg-brand-maroon mx-auto" />
             <p className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-indigo/30">Crafted by Hand</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { name: "Ghulam Nabi", skill: "Master Ajrak Artist", loc: "Hala, Sindh", img: "/artisan-ghulam-nabi.jpg" },
              { name: "Mai Safoora", skill: "Ralli Artist", loc: "Thar Desert", img: "/artisan-mai-safoora.jpg" },
              { name: "Ali Ahmed", skill: "Master Loom Weaver", loc: "Multan City", img: "/artisan-ali-ahmed.jpg" }
            ].map((artisan, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="group space-y-10"
              >
                <div className="aspect-[3/4] rounded-5xl overflow-hidden shadow-5xl ring-1 ring-black/5 relative">
                  <img src={artisan.img} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-brand-indigo/10 group-hover:bg-transparent transition-colors duration-1000" />
                </div>
                <div className="space-y-4 px-4">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.4em] font-black text-brand-maroon">
                    <span>{artisan.skill}</span>
                    <span className="opacity-40">{artisan.loc}</span>
                  </div>
                  <h4 className="serif text-4xl font-medium tracking-tighter text-brand-indigo">{artisan.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Closing - Ethereal Soft */}
      <section className="bg-white/30 backdrop-blur-3xl mx-4 md:mx-8 mb-8 rounded-[3rem] py-24 md:py-32 text-center space-y-10 shadow-inner border border-white/50">
        <h2 className="serif text-3xl md:text-[5rem] font-medium tracking-tighter text-brand-indigo leading-none">
          Own a piece <br />of <span className="italic font-light">History</span>.
        </h2>
        <p className="text-xl md:text-2xl text-brand-indigo/50 leading-relaxed max-w-2xl mx-auto font-light tracking-tight font-sans">
          Every product you buy supports traditional crafts and brings a piece of history to your modern home.
        </p>
        <div className="pt-8">
           <Link to="/shop" className="btn-modern-primary min-w-[280px]">
              Shop the Collection
           </Link>
        </div>
      </section>
    </div>
  );
}

