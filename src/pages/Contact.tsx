import { Mail, Phone, MapPin, Send, Globe } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  return (
    <div className="bg-brand-cream/50 min-h-screen pt-8 md:pt-16 pb-32 px-6 md:px-8 textile-texture-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
          {/* Narrative Info Side */}
          <div className="space-y-20">
            <div className="space-y-10">
               <div className="flex items-center gap-4 text-brand-maroon">
                  <div className="w-12 h-[1px] bg-brand-maroon/30" />
                  <span className="text-[10px] uppercase tracking-[0.5em] font-black">Connection Circle</span>
               </div>
               <h1 className="serif text-5xl sm:text-6xl md:text-[6rem] lg:text-[7.5rem] font-medium tracking-tighter leading-[0.85] text-brand-indigo">
                 Contact <br /><span className="italic font-light">Us</span>.
               </h1>
               <p className="text-xl md:text-2xl text-brand-indigo/60 leading-relaxed font-light tracking-tight max-w-lg">
                 Whether you're inquiring about artisan techniques, global logistics, or wholesale curation—our cultural consultants are ready.
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4 group">
                <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-brand-maroon shadow-5xl ring-1 ring-black/5 group-hover:bg-brand-maroon group-hover:text-white transition-all duration-700">
                  <Mail size={24} />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-indigo/30">Inquiries</p>
                  <p className="text-xl serif font-medium text-brand-indigo">heritage@craftroot.com</p>
                </div>
              </div>
              
              <div className="space-y-4 group">
                <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-brand-maroon shadow-5xl ring-1 ring-black/5 group-hover:bg-brand-maroon group-hover:text-white transition-all duration-700">
                  <Phone size={24} />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-indigo/30">Liaison</p>
                  <p className="text-xl serif font-medium text-brand-indigo">+92 300 1234567</p>
                </div>
              </div>

              <div className="space-y-4 group sm:col-span-2">
                <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-brand-maroon shadow-5xl ring-1 ring-black/5 group-hover:bg-brand-maroon group-hover:text-white transition-all duration-700">
                  <MapPin size={24} />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-indigo/30">Studio Hub</p>
                  <p className="text-xl serif font-medium text-brand-indigo">Design Cluster 10, Karachi Craft District, Pakistan</p>
                </div>
              </div>
            </div>

            <div className="p-16 rounded-5xl bg-brand-indigo text-brand-cream relative overflow-hidden shadow-5xl">
               <div className="absolute inset-0 ajrak-pattern-subtle opacity-10 pointer-events-none" />
               <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <Globe size={40} className="text-brand-earth/50" />
                  <p className="text-2xl serif font-light italic leading-snug">
                    "Culture is not what we exhibit, it's what we live through our fingerprints."
                  </p>
               </div>
            </div>
          </div>

          {/* Form Side - Modern Glass Panel */}
          <div className="bg-white/40 backdrop-blur-3xl p-12 md:p-20 rounded-[4rem] border border-white shadow-5xl">
            <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-indigo/30 block ml-1">Name</label>
                    <input 
                      type="text" 
                      placeholder="E.g. Zainab Khan"
                      className="w-full bg-transparent border-b border-brand-earth/40 py-4 focus:outline-none focus:border-brand-maroon transition-all duration-500 text-xl serif italic font-medium text-brand-indigo"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-indigo/30 block ml-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="zainab@example.com"
                      className="w-full bg-transparent border-b border-brand-earth/40 py-4 focus:outline-none focus:border-brand-maroon transition-all duration-500 text-xl serif italic font-medium text-brand-indigo"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-indigo/30 block ml-1">Reason for contact</label>
                  <select className="w-full bg-transparent border-b border-brand-earth/40 py-4 focus:outline-none focus:border-brand-maroon transition-all duration-500 text-xl serif italic font-medium text-brand-indigo cursor-pointer appearance-none">
                    <option>Curation Support</option>
                    <option>Logistics Inquiry</option>
                    <option>Global Curation</option>
                    <option>Artisan Legacy</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-indigo/30 block ml-1">Your message</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your desired connection..."
                    className="w-full bg-transparent border-b border-brand-earth/40 py-4 focus:outline-none focus:border-brand-maroon transition-all duration-500 text-xl serif italic font-medium text-brand-indigo resize-none"
                  />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-modern-primary w-full py-8 text-[11px] tracking-[0.4em] group"
              >
                Send Message <Send size={18} className="ml-4 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

