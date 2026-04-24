import { motion } from "motion/react";
import { X } from "lucide-react";
import { useState } from "react";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-brand-maroon text-brand-cream py-2 px-4 relative z-[60] overflow-hidden pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-black">
          ✨ Get 10% OFF on your first order with code <span className="text-brand-earth">WELCOME10</span> • Free Shipping on orders over Rs. 3000 ✨
        </p>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-4 hover:scale-110 transition-transform"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}
