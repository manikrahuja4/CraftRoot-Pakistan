import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, ArrowLeft, Truck, CreditCard, Smartphone, Landmark } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../components/layout/Navbar";
import { useSettings } from "../context/SettingsContext";
import { products } from "../data/sampleData";
import ProductCard from "../components/ui/ProductCard";
import { AnalyticsService } from "../services/intelligence";
import { useMemo } from "react";

export default function Cart() {
  const { cart, removeFromCart, addToCart, cartCount } = useCart();
  const { formatPrice } = useSettings();
  
  const subtotal = cart.reduce((acc, item) => acc + (item.salePrice || item.price) * item.quantity, 0);
  const bundleDiscount = cartCount >= 2 ? subtotal * 0.1 : 0;
  const shippingThreshold = 3000;
  const shipping = subtotal > shippingThreshold ? 0 : 500;
  const total = subtotal - bundleDiscount + shipping;

  const progressToFreeShipping = Math.min((subtotal / shippingThreshold) * 100, 100);
  const amountToFreeShipping = shippingThreshold - subtotal;

  const upsellProducts = useMemo(() => {
    const cartIds = cart.map(i => i.id);
    return products
      .filter(p => !cartIds.includes(p.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [cart]);

  if (cartCount === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center textile-texture-light">
        <div className="w-32 h-32 bg-white/50 backdrop-blur-3xl rounded-full flex items-center justify-center mb-12 shadow-5xl ring-1 ring-black/5 text-brand-maroon/20">
          <ShoppingBag size={48} />
        </div>
        <h2 className="serif text-5xl md:text-7xl mb-6 font-medium tracking-tighter text-brand-indigo">Your cart is <span className="italic font-light">empty</span>.</h2>
        <p className="text-xl text-brand-indigo/60 mb-12 max-w-sm font-light tracking-tight">Your shopping cart is currently empty. Bring home a piece of tradition.</p>
        <Link 
          to="/shop" 
          className="btn-modern-primary px-16 py-6"
        >
          Explore All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-24 bg-brand-cream/50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Cart Listing - Clean Editorial */}
        <div className="flex-grow space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-brand-earth/20 pb-10">
            <div className="space-y-4">
               <div className="flex items-center gap-4 text-brand-maroon">
                  <div className="w-8 h-[1px] bg-brand-maroon/30" />
                  <span className="text-[9px] uppercase tracking-[0.5em] font-black">Your Items</span>
               </div>
               <h1 className="serif text-5xl md:text-7xl font-medium tracking-tighter text-brand-indigo">Your Cart</h1>
            </div>
            <p className="text-brand-indigo/30 text-[9px] uppercase font-black tracking-[0.4em] pb-1">{cartCount} Items</p>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col sm:flex-row gap-8 p-6 bg-white/40 backdrop-blur-3xl rounded-4xl border border-white/50 shadow-xl group transition-all duration-700 hover:shadow-2xl"
                >
                  <div className="w-28 sm:w-36 aspect-[3/4] bg-white rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 shrink-0">
                    <img 
                      src={item.image} 
                      className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 duration-1000 group-hover:scale-105" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <Link to={`/product/${item.id}`} className="serif text-2xl font-medium text-brand-indigo hover:text-brand-maroon transition-colors leading-tight block">{item.name}</Link>
                          <p className="text-[8px] uppercase tracking-[0.3em] text-brand-maroon font-black">{item.category}</p>
                        </div>
                        <span className="text-xl serif font-medium text-brand-maroon italic whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 mt-6 border-t border-brand-earth/10">
                      <div className="flex items-center space-x-4 bg-white/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-brand-earth/10">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-brand-indigo/40 hover:text-brand-maroon transition-colors p-1"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-[10px] font-black tracking-widest w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="text-brand-indigo/40 hover:text-brand-maroon transition-colors p-1"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-brand-indigo/20 hover:text-brand-maroon transition-colors flex items-center space-x-2 text-[8px] uppercase font-black tracking-[0.3em]"
                      >
                        <Trash2 size={10} />
                        <span>Discard</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="mt-20 pt-20 border-t border-brand-earth/10">
            <h3 className="serif text-2xl text-brand-indigo mb-10 tracking-tight">Curated <span className="italic font-light opacity-60">Additions</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {upsellProducts.map(p => (
                 <ProductCard key={p.id} product={p} />
               ))}
            </div>
          </div>

          <div className="mt-12">
            <Link to="/shop" className="inline-flex items-center text-[9px] uppercase tracking-[0.4em] font-black text-brand-indigo/30 hover:text-brand-maroon transition-all group">
              <ArrowLeft size={12} className="mr-3 group-hover:-translate-x-2 transition-transform" /> 
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Status Aside - Modern Minimalist */}
        <aside className="w-full lg:w-[560px] sticky top-32">
          <div className="bg-brand-indigo text-brand-cream p-12 md:p-14 rounded-[3.5rem] space-y-12 shadow-5xl relative overflow-hidden group">
            <div className="absolute inset-0 ajrak-pattern-subtle opacity-5 group-hover:opacity-10 transition-opacity" />
            
            <div className="relative z-10 space-y-12">
            <div className="flex justify-between items-center border-b border-white/10 pb-8">
               <h3 className="serif text-4xl font-medium text-brand-earth italic">Summary</h3>
               <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-earth rounded-full animate-pulse" />
                  <span className="text-[8px] uppercase tracking-[0.2em] font-black opacity-40">Secured Session</span>
               </div>
            </div>
            
            {/* Free Shipping Progress */}
            <div className="space-y-5 bg-white/5 p-8 rounded-3xl border border-white/5">
               <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] font-black">
                  <span className="opacity-60">Heritage Logistics</span>
                  <span className="text-brand-earth">{progressToFreeShipping >= 100 ? 'Complimentary' : formatPrice(amountToFreeShipping) + ' to unlock'}</span>
               </div>
               <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToFreeShipping}%` }}
                    className="h-full bg-brand-earth shadow-[0_0_10px_rgba(212,163,115,0.5)]" 
                  />
               </div>
               {progressToFreeShipping >= 100 ? (
                 <p className="text-[9px] text-green-400 font-black uppercase tracking-[0.1em] flex items-center gap-2">
                    <Truck size={12} /> Standard worldwide shipping included
                 </p>
               ) : (
                 <p className="text-[8px] text-brand-cream/30 font-light italic">Complimentary shipping on orders over {formatPrice(shippingThreshold)}</p>
               )}
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-center text-brand-cream/60">
                <span className="text-[10px] uppercase tracking-[0.3em] font-black">Subtotal</span>
                <span className="text-xl serif italic font-light">{formatPrice(subtotal)}</span>
              </div>
              {bundleDiscount > 0 && (
                <div className="flex justify-between items-center text-brand-earth">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">Bundle Discount (10%)</span>
                  <span className="text-xl serif italic font-light">- {formatPrice(bundleDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-brand-cream/60">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black">Shipping & Handling</span>
                </div>
                <span className="text-xl serif italic font-light">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
            </div>

            <div className="pt-10 border-t border-white/10 flex justify-between items-baseline">
              <span className="serif text-3xl font-medium tracking-tight">Total Price</span>
              <div className="text-right">
                 <span className="text-5xl md:text-6xl serif italic text-brand-earth font-light leading-none block">{formatPrice(total)}</span>
              </div>
            </div>

            <Link 
              to="/checkout" 
              onClick={() => AnalyticsService.trackEvent('checkout_click', { total: total })}
              className="btn-modern-primary w-full py-10 text-base tracking-[0.5em] text-brand-indigo bg-brand-earth hover:bg-white hover:text-brand-maroon block text-center shadow-4xl group relative overflow-hidden"
            >
              <span className="relative z-10">Checkout</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            </Link>
              
              <div className="space-y-6 pt-12 border-t border-white/5">
                <div className="flex items-start gap-5 text-brand-cream/40">
                  <ShieldCheck size={24} className="text-brand-earth/50 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black">Provenance Protection</p>
                    <p className="text-[9px] font-sans opacity-40 tracking-tight leading-relaxed">Each physical piece is registered within our artisan ledger, ensuring direct compensation and authenticity verification.</p>
                  </div>
                </div>

                <div className="pt-8 flex justify-center gap-6 opacity-20 hover:opacity-40 transition-opacity">
                   <div className="flex flex-col items-center gap-2">
                      <CreditCard size={16} />
                      <span className="text-[7px] uppercase font-black tracking-widest">Visa</span>
                   </div>
                   <div className="flex flex-col items-center gap-2">
                      <Smartphone size={16} />
                      <span className="text-[7px] uppercase font-black tracking-widest">EasyPaisa</span>
                   </div>
                   <div className="flex flex-col items-center gap-2">
                      <Landmark size={16} />
                      <span className="text-[7px] uppercase font-black tracking-widest">Bank</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

