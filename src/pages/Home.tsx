import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Star, Quote, MapPin, ShoppingBag, Heart, Instagram, ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";
import { products, categories } from "../data/sampleData";
import ProductCard from "../components/ui/ProductCard";
import CountdownTimer from "../components/ecommerce/CountdownTimer";
import TrustBadges from "../components/ecommerce/TrustBadges";
import PackagingExperience from "../components/marketing/PackagingExperience";
import SmartRecommendations from "../components/marketing/SmartRecommendations";
import RecentlyViewed from "../components/marketing/RecentlyViewed";
import { cn } from "../lib/utils";

export default function Home() {
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);

  return (
    <div className="pb-32 textile-texture-light bg-brand-cream/50 overflow-x-hidden">
      {/* Modern Hero - Fluid & Atmospheric */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-4 md:px-8 pt-2 pb-8">
        <div className="max-w-7xl mx-auto w-full min-h-[60vh] bg-brand-maroon/5 rounded-[3rem] overflow-hidden shadow-sm relative flex items-center justify-center px-6 py-12 md:py-16">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <img
              src="/hero-bg.jpg"
              className="w-full h-full object-cover"
              alt="Heritage Background"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-indigo/20 via-brand-indigo/40 to-brand-indigo/80" />
            <div className="absolute inset-0 bg-brand-indigo/20 mix-blend-multiply" />
          </div>

          <div className="relative z-10 text-center space-y-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-8"
            >
              <div className="flex items-center justify-center space-x-6 opacity-80 mb-6">
                <span className="text-[10px] font-black tracking-[0.4em] text-brand-cream/60 uppercase">Est. 1947</span>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-earth/40" />
                <span className="text-[10px] font-black tracking-[0.4em] text-brand-cream/60 uppercase">Origin: swabi • hala • swatt</span>
              </div>

              <span className="inline-flex items-center space-x-3 px-6 py-2.5 bg-brand-cream/10 backdrop-blur-2xl border border-white/20 rounded-full text-[10px] uppercase tracking-[0.4em] font-black text-brand-cream shadow-sm mx-auto">
                <span className="w-1.5 h-1.5 bg-brand-earth rounded-full animate-pulse" />
                <span>Handmade Crafts. Real Stories.</span>
              </span>
              
              <h1 className="serif text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-[6.5rem] font-medium leading-[0.85] tracking-tighter text-brand-cream">
                Heritage <br />
                <span className="italic font-light text-brand-earth drop-shadow-sm">Pieces</span>
              </h1>

              <p className="text-lg md:text-xl text-brand-cream/90 font-medium max-w-xl mx-auto leading-relaxed font-sans tracking-tight">
                A curated collection of handmade quilts, shawls, and crafts from local experts across Pakistan.
              </p>
              
              <div className="pt-8">
                 <p className="text-[10px] uppercase tracking-[0.6em] font-black text-brand-earth/80">
                    "CraftRoot is a cultural preservation marketplace connecting heritage artisans with global luxury consumers."
                 </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-10"
            >
              <Link to="/shop" className="btn-modern-primary border-brand-earth text-brand-indigo bg-brand-earth hover:bg-brand-cream group shadow-5xl min-w-[200px]">
                Shop Now <ArrowRight size={18} className="ml-3 group-hover:translate-x-3 transition-transform duration-700" />
              </Link>
              <Link to="/about" className="text-xs uppercase tracking-[0.4em] font-black text-brand-cream/80 hover:text-brand-earth transition-all duration-500 px-6 py-3 border-b-2 border-transparent hover:border-brand-earth font-sans">
                Our Story
              </Link>
            </motion.div>
          </div>

          {/* Floating Sidebar Detail - inside the box now */}
          <div className="absolute bottom-12 left-12 hidden xl:flex flex-col gap-6 text-brand-cream/40 font-black tracking-[0.6em] text-[8px] uppercase vertical-text">
            <span>SINCE 1947</span>
            <div className="w-[1px] h-20 bg-current mx-auto opacity-30" />
            <span>ORIGIN HALA</span>
          </div>
        </div>
      </section>

      {/* Limited Time Sale Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20 lg:pt-32">
        <div className="bg-brand-indigo rounded-[3rem] overflow-hidden relative textile-texture-light p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 shadow-5xl border border-white/5">
          <div className="absolute inset-0 ajrak-pattern-subtle opacity-10 pointer-events-none" />
          <div className="relative z-10 space-y-8 max-w-xl text-center md:text-left">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1 bg-brand-earth/20 text-brand-earth rounded-full text-[10px] uppercase tracking-[0.4em] font-black">Limited Time Heritage Sale</span>
              <h2 className="serif text-4xl md:text-6xl text-brand-cream leading-tight">Artisanal Treasures <br /><span className="italic font-light">Up to 40% Off</span></h2>
              <p className="text-brand-cream/50 text-sm md:text-base leading-relaxed tracking-tight font-light">
                Secure 5,000 years of history at exclusive ceremonial prices. These pieces are one-of-a-kind and once sold, they belong to history.
              </p>
            </div>
            <CountdownTimer targetDate="2026-05-01T00:00:00" />
            <Link to="/shop" className="btn-modern-primary border-brand-earth text-brand-indigo bg-brand-earth hover:bg-white inline-block px-12 mt-4">
              Browse the Sale
            </Link>
          </div>
          <div className="relative w-full md:w-1/3 aspect-square max-w-sm">
             <div className="absolute inset-0 bg-brand-maroon/20 rounded-full blur-[100px]" />
             <img src="/baloch-pashk.jpg" className="w-full h-full object-cover rounded-[3rem] shadow-5xl relative z-10 ring-1 ring-white/10" />
          </div>
        </div>
      </section>

      <PackagingExperience />

      {/* Craft Narrative - Overlapping & Soft */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12 order-2 lg:order-1">
              <div className="space-y-6">
                <div className="w-20 h-[2px] bg-brand-maroon/20" />
                <h2 className="serif text-4xl md:text-[5rem] font-medium leading-[0.9] text-brand-indigo tracking-tighter">
                  Making <span className="italic text-brand-maroon">with</span> <br />Care
                </h2>
              </div>
              <p className="text-xl text-brand-indigo/70 leading-relaxed max-w-lg font-light tracking-tight">
                Our products are not made in factories. Each piece is handmade by skilled artisans using traditional methods that take time and focus.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-brand-earth/30">
                <div className="space-y-2">
                  <span className="text-4xl serif font-medium text-brand-maroon italic">21 Days</span>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-brand-indigo/40 font-black">Creation Cycle</p>
                </div>
                <div className="space-y-2">
                  <span className="text-4xl serif font-medium text-brand-indigo">400 yr</span>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-brand-indigo/40 font-black">Inherited Knowledge</p>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 1 }}
                className="aspect-[4/5] rounded-5xl overflow-hidden shadow-5xl relative z-10"
              >
                <img 
                  src="/craft-slow.jpg" 
                  className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-110"
                  alt="Textile Detail"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              {/* Glass Floating Component */}
              <div className="absolute -bottom-16 -left-16 bg-white/40 backdrop-blur-3xl p-16 rounded-4xl shadow-5xl border border-white/50 hidden xl:block z-20">
                 <div className="space-y-3 text-center">
                    <span className="block text-5xl serif font-medium text-brand-maroon italic">Pure</span>
                    <span className="block text-[10px] uppercase tracking-[0.5em] font-black text-brand-indigo/30">Certified Indigo</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Grid - Spacious & Clean */}
      <section className="bg-brand-sand/50 py-16 md:py-24 rounded-[3rem] mx-4 md:mx-6 shadow-sm border border-brand-earth/10 ajrak-pattern-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <h2 className="serif text-3xl md:text-[5rem] font-medium tracking-tighter text-brand-indigo leading-none">
              Today's <span className="italic font-light">Favorites</span>
            </h2>
            <div className="flex items-center justify-center gap-6">
              <div className="h-[1px] w-12 bg-brand-maroon/20" />
              <p className="text-[10px] uppercase tracking-[0.6em] font-black text-brand-maroon">Handmade in small batches</p>
              <div className="h-[1px] w-12 bg-brand-maroon/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-32 text-center">
             <Link to="/shop" className="btn-modern-outline min-w-[250px] group">
                Shop All Products <ArrowRight size={14} className="ml-3 group-hover:translate-x-2 transition-transform duration-500" />
             </Link>
          </div>
        </div>
      </section>

      {/* The Artisans - Editorial Spread */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6 relative p-4">
               <div className="space-y-6 pt-16">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-5xl ring-1 ring-black/5">
                     <img src="/artisan-nabi.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-5xl ring-1 ring-black/5">
                     <img src="/artisan-nabi-2.jpg" className="w-full h-full object-cover shadow-inner" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-5xl ring-1 ring-black/5">
                     <img src="/artisan-nabi-3.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-5xl ring-1 ring-black/5">
                     <img src="/artisan-nabi-4.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
               </div>
               {/* Decor circle */}
               <div className="absolute -top-8 -right-8 w-48 h-48 bg-brand-maroon/5 rounded-full blur-[80px] pointer-events-none" />
            </div>
 
            <div className="w-full lg:w-1/2 space-y-12">
               <div className="space-y-8">
                  <div className="flex items-center gap-6 text-brand-maroon">
                     <MapPin size={20} />
                     <span className="text-[11px] uppercase tracking-[0.5em] font-black">Cluster 09: Thar Desert</span>
                  </div>
                  <h2 className="serif text-4xl md:text-[5rem] font-medium leading-[0.8] tracking-tighter text-brand-indigo">
                    Made by <br /><span className="italic font-light">Human Hands</span>
                  </h2>
               </div>

               <div className="relative p-12 md:p-16 bg-white/20 backdrop-blur-3xl rounded-5xl border border-white/40 shadow-5xl">
                  <Quote size={40} className="absolute -top-8 -left-8 text-brand-maroon/10" />
                  <p className="text-2xl md:text-3xl serif font-light italic leading-snug text-brand-indigo mb-10 tracking-tight">
                    "We don't follow a factory plan. We follow the rhythm of the wooden blocks hitting the cotton. It is a song we sing with our hands."
                  </p>
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-[2px] bg-brand-maroon/30" />
                     <span className="text-[11px] uppercase tracking-[0.4em] font-black text-brand-maroon">Master Artisan Nabi</span>
                  </div>
               </div>

               <Link to="/about" className="btn-modern-primary min-w-[220px]">
                  Our Story
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Feature: Adopt an Artisan Cluster */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20">
        <div className="bg-brand-cream border border-brand-indigo/10 rounded-[3rem] p-10 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center shadow-inner relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <Award size={200} />
          </div>
          <div className="space-y-8 relative z-10">
            <span className="inline-block px-4 py-1 bg-brand-indigo/5 text-brand-maroon rounded-full text-[10px] uppercase tracking-[0.4em] font-black">Community Impact Tool</span>
            <div className="space-y-6">
              <h2 className="serif text-4xl md:text-6xl text-brand-indigo tracking-tighter leading-tight">Support a Master <br /><span className="italic font-light">Artisan Story</span></h2>
              <p className="text-brand-indigo/60 text-lg leading-relaxed font-light tracking-tight max-w-md">
                Directly support a specific cluster. Your contribution provides medical insurance, heritage toolkits, and schooling for artisan children.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                "100% Transparency in Fund Allocation",
                "Personalized updates on your artisan's work",
                "Exclusive invites to village workshops"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-brand-indigo/40 italic">
                  <div className="w-1.5 h-1.5 bg-brand-maroon rounded-full" />
                  {item}
                </div>
              ))}
            </div>
            <button className="btn-modern-primary px-12 group">
              Adopt A Cluster <ArrowRight size={16} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          <div className="relative aspect-square md:aspect-auto md:h-[400px] flex gap-6">
            <div className="flex-1 rounded-[3rem] overflow-hidden shadow-2xl mt-12 bg-brand-indigo">
               <img src="/artisan-ghulam-nabi.jpg" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" />
            </div>
            <div className="flex-1 rounded-[3rem] overflow-hidden shadow-2xl bg-brand-indigo">
               <img src="/artisan-mai-safoora.jpg" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & TrustSection */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20">
         <div className="space-y-20">
            <div className="text-center space-y-6">
              <h2 className="serif text-4xl md:text-6xl text-brand-indigo tracking-tight">Trusted by <span className="italic font-light">500+</span> Patrons</h2>
              <p className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-indigo/30 italic">Preserving Culture Across Borders</p>
            </div>
            <TrustBadges />
         </div>
      </section>

      {/* Testimonials section */}
      <section className="bg-brand-indigo py-24 md:py-32 rounded-[3.5rem] mx-4 md:mx-6 overflow-hidden relative textile-texture-light mt-12">
        <div className="absolute inset-0 ajrak-pattern-subtle opacity-5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
             <span className="inline-block px-4 py-1 bg-brand-earth/20 text-brand-earth rounded-full text-[10px] uppercase tracking-[0.4em] font-black">Patron Stories</span>
             <h2 className="serif text-4xl md:text-6xl text-brand-cream tracking-tight">Voices of the <span className="italic font-light">Patrons</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "Fatima Khalil", 
                role: "Interior Architect", 
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
                text: "The Ralli quilt is a masterpiece. You can feel the weight of tradition in every stitch. A true conversation piece in my modern home." 
              },
              { 
                name: "Zainab Malik", 
                role: "Art Collector", 
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
                text: "CraftRoot is doing something vital. Buying directly from these masters makes the piece feel like an investment in our culture." 
              },
              { 
                name: "Ahmed Raza", 
                role: "Industrial Designer", 
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
                text: "The packaging was incredibly secure for such fragile pottery. Exquisite service and unparalleled traditional quality." 
              }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-3xl p-8 md:p-10 rounded-[3rem] border border-white/10 flex flex-col justify-between h-full group hover:bg-white/10 transition-all duration-500 shadow-2xl"
              >
                <div className="space-y-6">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={12} className="fill-brand-earth text-brand-earth" />
                    ))}
                  </div>
                  <Quote className="text-brand-earth opacity-20 group-hover:opacity-40 transition-opacity" size={32} />
                  <p className="text-brand-cream/90 text-xl serif italic leading-relaxed tracking-tight">"{t.text}"</p>
                </div>
                
                <div className="pt-8 mt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-brand-earth/20 shadow-xl">
                      <img 
                        src={t.image} 
                        alt={t.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h5 className="text-brand-cream font-bold text-[10px] uppercase tracking-widest">{t.name}</h5>
                      <p className="text-brand-earth text-[8px] uppercase tracking-wider font-medium">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <ShieldCheck size={10} className="text-brand-earth" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-earth">Verified</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Style Gallery */}
      <section className="py-24">
         <div className="text-center mb-16 space-y-4">
            <h2 className="serif text-4xl md:text-6xl text-brand-indigo tracking-tight">Crafted In <span className="italic font-light">Nature</span></h2>
            <div className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-maroon flex items-center justify-center gap-3">
              <Instagram size={14} /> @CraftRootCollective
            </div>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 px-2">
            {[
              "/sindh-ralli.jpg", 
              "/baloch-earrings.jpg", 
              "/kpk-pakol.jpg", 
              "/punjab-khusa.jpg", 
              "/sindh-pottery.jpg", 
              "/kuchi-frock.jpg"
            ].map((img, i) => (
              <div key={i} className="aspect-square bg-brand-cream overflow-hidden group cursor-pointer relative">
                <img src={img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-brand-indigo/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <Instagram className="text-white scale-150" />
                </div>
              </div>
            ))}
         </div>
      </section>

      <SmartRecommendations />
      <RecentlyViewed />

      {/* Final Call - Immersive Soft */}
      <section className="mx-4 md:mx-6 overflow-hidden rounded-[3rem] bg-brand-indigo py-16 md:py-24 text-brand-cream relative shadow-5xl">
        <div className="absolute inset-0 opacity-10 ajrak-pattern-subtle mix-blend-overlay" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12">
           <div className="w-20 h-20 rounded-full border border-brand-earth/20 flex items-center justify-center mx-auto scale-110 shadow-2xl">
              <ShoppingBag size={32} className="text-brand-earth/60" />
           </div>
           <h2 className="serif text-3xl md:text-[5rem] font-medium leading-none tracking-tighter">
             Traditional <br /><span className="italic font-light text-brand-earth">Crafts</span>
           </h2>
           <p className="text-lg md:text-xl text-brand-cream/50 max-w-2xl mx-auto font-light leading-relaxed tracking-tight">
             Every piece brings the history of Pakistan to your home. Fast shipping and high quality guaranteed.
           </p>
           <div className="pt-10">
              <Link to="/shop" className="btn-modern bg-brand-earth text-brand-indigo hover:bg-white hover:text-brand-maroon hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all duration-700 font-black min-w-[280px] shadow-2xl py-6 px-12 rounded-full inline-block">
                 Shop Now
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}

