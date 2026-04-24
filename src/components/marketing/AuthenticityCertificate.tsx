import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, Award, MapPin, Clock, Fingerprint } from 'lucide-react';
import { Artisan } from '../../types';

interface AuthenticityCertificateProps {
  isOpen: boolean;
  onClose: () => void;
  artisan: Artisan;
  productName: string;
}

const AuthenticityCertificate: React.FC<AuthenticityCertificateProps> = ({ isOpen, onClose, artisan, productName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-indigo/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[#fdfcf8] shadow-2xl border-[8px] sm:border-[12px] border-brand-earth/20 rounded-sm max-h-[90vh] overflow-y-auto scrollbar-hide"
          >
            {/* Certificate Header Decoration */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-brand-maroon" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-brand-indigo/40 hover:text-brand-maroon transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 sm:p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-brand-earth/10 flex items-center justify-center text-brand-earth">
                  <ShieldCheck size={32} />
                </div>
              </div>

              <h2 className="serif text-3xl sm:text-4xl text-brand-indigo mb-2 italic">Certificate of Authenticity</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-maroon/60 mb-8">Heritage Collection • Pakistan</p>
              
              <div className="max-w-md mx-auto mb-10">
                <p className="text-brand-indigo/70 font-light leading-relaxed mb-6">
                  This document formally certifies that the <span className="font-medium text-brand-indigo italic">"{productName}"</span> is an authentic handcrafted artifact, created using traditional methods preserved through generations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-y-8 gap-x-4 text-left border-y border-brand-earth/10 py-10 mb-8">
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-black text-brand-earth mb-2 flex items-center gap-2">
                    <Award size={12} /> Master Artisan
                  </p>
                  <p className="serif text-lg text-brand-indigo italic">{artisan.name}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-black text-brand-earth mb-2 flex items-center gap-2">
                    <MapPin size={12} /> Craft Region
                  </p>
                  <p className="serif text-lg text-brand-indigo italic">{artisan.region}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-black text-brand-earth mb-2 flex items-center gap-2">
                    <Clock size={12} /> Creation Time
                  </p>
                  <p className="serif text-lg text-brand-indigo italic">{artisan.creationTime}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-black text-brand-earth mb-2 flex items-center gap-2">
                    <Fingerprint size={12} /> Certification ID
                  </p>
                  <p className="font-mono text-sm font-bold text-brand-indigo uppercase tracking-wider">{artisan.certificationId}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 opacity-40">
                <div className="serif text-xl italic text-brand-indigo opacity-60">Crafted with Heritage</div>
                <div className="text-[8px] uppercase tracking-widest font-bold">Verified by Indus Retail Ledger</div>
              </div>
              
              {/* Decorative Corner Seals */}
              <div className="absolute bottom-6 right-6 opacity-10">
                <Award size={120} strokeWidth={0.5} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthenticityCertificate;
