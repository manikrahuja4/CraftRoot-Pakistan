import React, { useState, createContext, useContext, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, Globe, Heart, DollarSign, ShieldCheck as ShieldIcon } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { CartItem, Product } from "../../types";
import { cn } from "../../lib/utils";
import PromoBanner from "../ecommerce/PromoBanner";
import { useWishlist } from "../../context/WishlistContext";
import { useSettings } from "../../context/SettingsContext";
import { products } from "../../data/sampleData";
import { AnalyticsService } from "../../services/intelligence";
import { useAuth } from "../../context/AuthContext";
import { User, LogIn } from "lucide-react";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem("craftroot_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { wishlist } = useWishlist();
  const { currency, setCurrency } = useSettings();

  useEffect(() => {
    localStorage.setItem("craftroot_cart", JSON.stringify(cart));
  }, [cart]);

  const { user, isAdmin } = useAuth();

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addToCart = useCallback((product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount
  }), [cart, addToCart, removeFromCart, clearCart, cartCount]);

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Heritage", href: "/heritage" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <CartContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col bg-brand-cream/50">
        {/* Modern Dynamic Navigation */}
        <header 
          className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-700 pointer-events-none flex flex-col",
            isScrolled ? "pt-4 md:pt-6 px-4 md:px-8" : "pt-0"
          )}
        >
          <AnimatePresence>
            {!isScrolled && <PromoBanner />}
          </AnimatePresence>
          <nav 
            className={cn(
              "max-w-7xl mx-auto w-full pointer-events-auto transition-all duration-700",
              isScrolled 
                ? "bg-white/80 backdrop-blur-3xl border border-white/40 rounded-full shadow-2xl px-8 md:px-12 py-5 mt-2" 
                : "bg-white/40 backdrop-blur-md border-b border-brand-earth/20 px-6 md:px-16 py-8"
            )}
          >
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link to="/" className="flex flex-col group items-center">
                <img 
                  src={isScrolled ? "/logo-scroll.png" : "/logo.png"} 
                  alt="CraftRoot" 
                  className={cn(
                    "transition-all duration-700 object-contain",
                    isScrolled ? "h-12" : "h-20"
                  )}
                  onError={(e) => {
                    // Fallback to text if image is missing
                    e.currentTarget.style.display = 'none';
                    const textLogo = e.currentTarget.parentElement?.querySelector('.text-logo');
                    if (textLogo) textLogo.classList.remove('hidden');
                  }}
                />
                <div className={cn(
                  "text-logo transition-all duration-700 flex flex-col items-center",
                  "hidden" // Hidden by default, shown if image fails
                )}>
                  <span className={cn(
                    "serif font-medium tracking-tighter text-brand-indigo group-hover:text-brand-maroon transition-all duration-700",
                    isScrolled ? "text-2xl" : "text-3xl md:text-4xl"
                  )}>
                    CraftRoot
                  </span>
                  {!isScrolled && (
                    <span className="text-[8px] uppercase tracking-[0.5em] font-black text-brand-indigo/30 group-hover:text-brand-maroon/50 transition-all duration-700">
                      Artisan Crafts
                    </span>
                  )}
                </div>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center space-x-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      "text-[10px] uppercase font-black tracking-[0.3em] transition-all duration-500",
                      location.pathname === link.href ? "text-brand-maroon" : "text-brand-indigo/40 hover:text-brand-maroon"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Functional Icons */}
              <div className="flex items-center space-x-6 md:space-x-8 text-brand-indigo/40">
                {/* Currency Switcher */}
                <button 
                  onClick={() => setCurrency(currency === 'PKR' ? 'USD' : 'PKR')}
                  className="group flex items-center gap-2 hover:text-brand-maroon transition-all duration-500 overflow-hidden"
                >
                   <div className="relative w-4 h-4 overflow-hidden rounded-full border border-current flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.span 
                          key={currency}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          className="text-[8px] font-black absolute"
                        >
                          {currency === 'PKR' ? '$' : '₨'}
                        </motion.span>
                      </AnimatePresence>
                   </div>
                   <span className="text-[9px] font-black tracking-widest hidden md:block">{currency}</span>
                </button>

                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:text-brand-maroon transition-colors"
                >
                  <Search size={isScrolled ? 16 : 18} />
                </button>
                <Link to="/wishlist" className="relative hover:text-brand-maroon transition-all duration-500 hidden md:block">
                  <Heart size={isScrolled ? 16 : 18} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-maroon w-2 h-2 rounded-full" />
                  )}
                </Link>
                <Link to="/cart" className="relative hover:text-brand-maroon transition-all duration-500">
                  <ShoppingBag size={isScrolled ? 16 : 18} />
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-brand-maroon text-white text-[8px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-black shadow-xl border-2 border-white"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>

                {/* User Profile / Login */}
                <div className="flex items-center gap-3">
                  <Link 
                    to={user ? "/profile" : "/login"} 
                    className={cn(
                      "flex items-center gap-2 group transition-all duration-500",
                      user ? "text-brand-maroon" : "hover:text-brand-maroon"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full border border-current flex items-center justify-center transition-all duration-700",
                      isScrolled ? "scale-90" : "scale-100"
                    )}>
                      {user ? <User size={14} /> : <LogIn size={14} />}
                    </div>
                    <span className="text-[9px] font-black tracking-widest hidden xl:block uppercase">
                      {user ? "Archive" : "Sign In"}
                    </span>
                  </Link>

                  {isAdmin && (
                    <Link 
                      to="/admin"
                      className="p-2 text-brand-indigo/40 hover:text-brand-maroon transition-colors"
                      title="Curator Suite"
                    >
                      <ShieldIcon size={16} />
                    </Link>
                  )}
                </div>

                <button
                  className="lg:hidden text-brand-indigo/60"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </nav>

          {/* Search Overlay */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-3xl p-8 md:p-12 border-b border-brand-earth/20 pointer-events-auto shadow-6xl"
              >
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="serif text-2xl text-brand-indigo">Search the Heritage</h3>
                    <button onClick={() => setIsSearchOpen(false)}><X size={20} /></button>
                  </div>
                  <div className="relative">
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Search items, origins, or artisans..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-brand-indigo/10 py-6 text-2xl md:text-4xl serif font-light focus:outline-none focus:border-brand-maroon transition-colors"
                    />
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="space-y-6 pt-4">
                      <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-indigo/30">Suggestions</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {searchResults.map(p => (
                          <Link 
                            key={p.id} 
                            to={`/product/${p.id}`} 
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-6 group p-4 hover:bg-brand-maroon/5 rounded-3xl transition-colors"
                          >
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-brand-cream ring-1 ring-black/5">
                              <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div>
                              <h4 className="serif text-lg text-brand-indigo group-hover:text-brand-maroon transition-colors">{p.name}</h4>
                              <p className="text-[9px] uppercase tracking-widest font-black text-brand-indigo/40">{p.category} • Sindh</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Overlay Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="lg:hidden mt-4 bg-white/95 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/50 shadow-5xl pointer-events-auto"
              >
                <div className="space-y-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-4xl serif font-medium text-brand-indigo hover:text-brand-maroon transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-8 border-t border-brand-earth/20 flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-brand-indigo/40">
                     <span>Discover more</span>
                     <Globe size={16} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Dynamic Content Spacer */}
        <main className="flex-grow pt-28 md:pt-40">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-brand-indigo text-brand-cream py-20 rounded-t-[3rem] overflow-hidden relative textile-texture-light">
          <div className="absolute inset-0 ajrak-pattern-subtle opacity-5 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 px-4">
              <div className="space-y-10">
                <Link to="/" className="flex flex-col group items-start">
                  <img 
                    src="/logo-light.png" 
                    alt="CraftRoot" 
                    className="h-24 w-auto object-contain mb-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const textLogo = e.currentTarget.parentElement?.querySelector('.text-logo-footer');
                      if (textLogo) textLogo.classList.remove('hidden');
                    }}
                  />
                  <div className="text-logo-footer hidden flex flex-col items-start">
                    <span className="serif text-4xl font-medium tracking-tight text-brand-earth">
                      CraftRoot
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.6em] font-black text-brand-cream/30">
                      Handmade
                    </span>
                  </div>
                </Link>
                <p className="text-brand-cream/40 text-lg leading-relaxed font-light tracking-tight max-w-sm">
                  Sharing the beauty of Pakistani crafts with the world. Every piece is handmade by local artisans.
                </p>
                <div className="flex gap-6">
                  {['IG', 'FB', 'TW'].map(s => (
                    <div key={s} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black hover:bg-white/10 transition-colors cursor-pointer">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="uppercase tracking-[0.5em] text-[10px] font-black mb-10 text-brand-earth">Products</h4>
                <ul className="space-y-6 text-sm text-brand-cream/50 tracking-tight font-light">
                  <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
                  <li><Link to="/shop?cat=ajrak" className="hover:text-white transition-colors">Ajrak Shawls</Link></li>
                  <li><Link to="/shop?cat=topi" className="hover:text-white transition-colors">Sindhi Topi</Link></li>
                  <li><Link to="/shop?cat=ralli" className="hover:text-white transition-colors">Ralli Quilts</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="uppercase tracking-[0.5em] text-[10px] font-black mb-10 text-brand-earth">Information</h4>
                <ul className="space-y-6 text-sm text-brand-cream/50 tracking-tight font-light">
                  <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                  <li><Link to="/heritage" className="hover:text-white transition-colors">Craft Heritage</Link></li>
                  <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Information</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>

              <div className="space-y-10">
                <h4 className="uppercase tracking-[0.5em] text-[10px] font-black text-brand-earth">Newsletter</h4>
                <p className="text-sm text-brand-cream/40 font-light leading-relaxed">Sign up for updates on our newest crafts and community stories.</p>
                <div className="flex items-center gap-4 group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-transparent border-b border-white/20 pb-4 text-sm w-full focus:outline-none focus:border-brand-earth/50 transition-colors uppercase tracking-[0.2em]"
                  />
                  <button className="whitespace-nowrap pb-4 border-b border-white/20 text-brand-earth hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.4em] font-black text-brand-cream/20">
              <p>© 2024 CraftRoot Collective. Preserving Local Culture.</p>
              <div className="flex space-x-10 mt-8 md:mt-0">
                <span className="hover:text-brand-cream transition-colors cursor-pointer">Privacy Policy</span>
                <span className="hover:text-brand-cream transition-colors cursor-pointer">Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </CartContext.Provider>
  );
}

