import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail } from "lucide-react";

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem("newsletter_seen");
      if (!hasSeen) {
        setIsVisible(true);
      }
    }, 5000); // Show after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("newsletter_seen", "true");
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(handleClose, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-brand-indigo/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-brand-cream rounded-[3rem] overflow-hidden shadow-6xl"
          >
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 text-brand-indigo/40 hover:text-brand-maroon transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-48 md:h-full bg-brand-indigo relative overflow-hidden">
                 <img src="/newsletter-img.jpg" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                 <div className="absolute inset-0 ajrak-pattern-subtle opacity-10" />
              </div>
              <div className="p-10 md:p-12 space-y-8">
                {isSubscribed ? (
                  <div className="text-center space-y-4 py-8">
                    <h3 className="serif text-3xl text-brand-indigo">Welcome!</h3>
                    <p className="text-sm font-light text-brand-indigo/60">Your 10% discount code has been sent.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <h3 className="serif text-3xl text-brand-indigo">Join the <span className="italic">Heritage</span></h3>
                      <p className="text-xs font-light text-brand-indigo/60 leading-relaxed uppercase tracking-wider">
                        Subscribe to get 10% OFF on your first acquisition and exclusive artisan updates.
                      </p>
                    </div>
                    <form onSubmit={handleSubscribe} className="space-y-4">
                      <div className="relative">
                        <Mail size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-maroon" />
                        <input 
                          type="email" 
                          required
                          placeholder="Your email address" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-transparent border-b border-brand-indigo/20 py-3 pl-8 text-sm focus:outline-none focus:border-brand-maroon transition-colors"
                        />
                      </div>
                      <button className="w-full btn-modern-primary py-4 text-[10px] tracking-[0.3em]">
                        Subscribe Now
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
