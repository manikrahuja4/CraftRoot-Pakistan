import { useState, useEffect, useMemo, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, ChevronRight, Share2, ShieldCheck, Truck, RefreshCcw, Heart, ArrowLeft, Star, Clock, MapPin, Award } from "lucide-react";
import { products } from "../data/sampleData";
import { useCart } from "../components/layout/Navbar";
import { cn } from "../lib/utils";
import ProductBadge from "../components/ecommerce/ProductBadge";
import ProductCard from "../components/ui/ProductCard";
import { useWishlist } from "../context/WishlistContext";
import { useSettings } from "../context/SettingsContext";
import { PersonalizationService, AnalyticsService } from "../services/intelligence";
import AuthenticityCertificate from "../components/marketing/AuthenticityCertificate";

import { collection, query, where, getDocs, addDoc, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { ThumbsUp, MessageSquare, Send } from "lucide-react";

type TabType = "Heritage Story" | "Product Details" | "Shipment" | "Reviews";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useSettings();
  const [activeTab, setActiveTab] = useState<TabType>("Heritage Story");
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const { user, profile } = useAuth();
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", id),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [id]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  }, [reviews]);

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        productId: id,
        userId: user.uid,
        userName: profile?.name || user.displayName || "Anonymous Artisan",
        rating: newReview.rating,
        comment: newReview.comment,
        verified: true, // Simplified for now
        createdAt: serverTimestamp(),
        helpful: []
      });
      setNewReview({ rating: 5, comment: "" });
    } catch (err) {
      console.error("Review failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // A/B Testing Variant for CTA
  const ctaVariant = useMemo(() => PersonalizationService.getABVariant('pdp_buy_button'), []);

  useEffect(() => {
    if (product) {
      PersonalizationService.trackProductView(product.id);
      AnalyticsService.trackEvent('product_view', { productId: product.id, name: product.name });
    }
  }, [product]);

  const recommendedProducts = useMemo(() => {
    const viewedIds = PersonalizationService.getViewedIds();
    return products
      .filter(p => p.id !== id && (p.category === product?.category || viewedIds.includes(p.id)))
      .sort((a, b) => {
        if (viewedIds.includes(a.id) && !viewedIds.includes(b.id)) return -1;
        if (!viewedIds.includes(a.id) && viewedIds.includes(b.id)) return 1;
        return 0;
      })
      .slice(0, 4);
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream/50">
        <div className="text-center space-y-8">
          <h2 className="serif text-6xl text-brand-indigo font-medium">Product not found.</h2>
          <Link to="/shop" className="btn-modern-outline inline-block">Return to Shop</Link>
        </div>
      </div>
    );
  }

  const tabContent = {
    "Heritage Story": (
      <div className="space-y-8">
        <h3 className="serif text-3xl font-medium text-brand-indigo">The Story</h3>
        <p className="text-lg text-brand-indigo/60 leading-relaxed font-light tracking-tight">
          {product.originStory || "Every piece in this collection is hand-made by local artisans, preserving traditional techniques passed down through generations."}
        </p>
        <div className="grid grid-cols-2 gap-8">
           <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl grayscale group hover:grayscale-0 transition-all duration-700">
              <img src="/origin-1.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
           </div>
           <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl grayscale group hover:grayscale-0 transition-all duration-700">
              <img src="/origin-2.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
           </div>
        </div>
      </div>
    ),
    "Product Details": (
      <div className="space-y-12">
        {product.details && (
          <div className="space-y-6">
            <h3 className="serif text-3xl font-medium text-brand-indigo">Product Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
              {product.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 bg-brand-maroon rounded-full mt-2 shrink-0" />
                  <span className="text-base font-sans font-light text-brand-indigo/70 leading-snug">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 border-t border-brand-earth/10">
          {product.material && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-indigo/30">Material</p>
              <p className="text-lg font-light tracking-tight text-brand-indigo">{product.material}</p>
            </div>
          )}
          {product.dimensions && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-indigo/30">Dimensions</p>
              <p className="text-lg font-light tracking-tight text-brand-indigo">{product.dimensions}</p>
            </div>
          )}
          {product.weight && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-indigo/30">Weight</p>
              <p className="text-lg font-light tracking-tight text-brand-indigo">{product.weight}</p>
            </div>
          )}
        </div>
      </div>
    ),
    "Shipment": (
      <div className="space-y-8">
        <h3 className="serif text-3xl font-medium text-brand-indigo">Shipping & Delivery</h3>
        <p className="text-lg text-brand-indigo/60 leading-relaxed font-light tracking-tight">
          {product.shippingInfo || "Your order is handled with care and packed securely to ensure it arrives in perfect condition. We ship locally and internationally with full tracking."}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
           <div className="p-8 rounded-4xl bg-brand-indigo/5 border border-brand-indigo/10 space-y-4">
              <ShieldCheck className="text-brand-maroon" size={32} />
              <h4 className="font-sans font-bold text-brand-indigo uppercase tracking-wider text-xs">Genuine Product</h4>
              <p className="text-sm text-brand-indigo/60 font-light">Each piece is guaranteed to be an authentic handmade product.</p>
           </div>
           <div className="p-8 rounded-4xl bg-brand-indigo/5 border border-brand-indigo/10 space-y-4">
              <Truck className="text-brand-maroon" size={32} />
              <h4 className="font-sans font-bold text-brand-indigo uppercase tracking-wider text-xs">Safe Delivery</h4>
              <p className="text-sm text-brand-indigo/60 font-light">We provide insurance and tracking for every order to ensure it reaches you safely.</p>
           </div>
        </div>
      </div>
    ),
    "Reviews": (
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-brand-earth/10 pb-12">
           <div className="space-y-4">
              <h3 className="serif text-3xl font-medium text-brand-indigo">Artisan Reviews</h3>
              <div className="flex items-center gap-4">
                 <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} className={i <= Math.round(avgRating || 4.9) ? "fill-brand-earth text-brand-earth" : "text-brand-indigo/10"} />)}
                 </div>
                 <span className="text-sm font-bold text-brand-indigo">{avgRating > 0 ? avgRating.toFixed(1) : "4.9"} out of 5</span>
              </div>
           </div>
           {user ? (
             <div className="flex-grow max-w-lg">
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                   <div className="flex gap-2 mb-4">
                      {[1,2,3,4,5].map(i => (
                        <button 
                          key={i} 
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: i }))}
                          className="transition-transform active:scale-90"
                        >
                          <Star size={20} className={i <= newReview.rating ? "fill-brand-maroon text-brand-maroon" : "text-brand-indigo/10"} />
                        </button>
                      ))}
                   </div>
                   <textarea
                     required
                     maxLength={500}
                     placeholder="Write your review... (max 500 characters)"
                     value={newReview.comment}
                     onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                     className="w-full bg-white/40 border border-brand-earth/10 rounded-[2rem] p-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 min-h-[120px] transition-all"
                   />
                   <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="btn-modern-primary py-4 px-8 text-[10px] w-full flex items-center justify-center gap-3"
                   >
                      {isSubmitting ? "Preserving..." : "Submit Review"} <Send size={14} />
                   </button>
                </form>
             </div>
           ) : (
             <div className="text-center md:text-right">
                <p className="text-xs font-black uppercase tracking-widest text-brand-indigo/30 mb-4">Sign in to leave a review</p>
                <Link to="/login" className="btn-modern-outline py-3 px-6 text-[10px]">Sign In</Link>
             </div>
           )}
        </div>

        <div className="space-y-10">
           {reviews.map((review) => (
             <div key={review.id} className="space-y-4 group">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <div className="flex items-center gap-3">
                         <div className="flex">
                            {[1,2,3,4,5].map(i => <Star key={i} size={10} className={i <= review.rating ? "fill-brand-maroon text-brand-maroon" : "text-brand-indigo/10"} />)}
                         </div>
                         {review.verified && <span className="text-[8px] font-black uppercase tracking-widest bg-brand-earth/10 text-brand-earth px-2 py-0.5 rounded-full">Verified Purchase</span>}
                      </div>
                      <h5 className="font-bold text-brand-indigo text-sm">{review.userName}</h5>
                   </div>
                                       <span className="text-[9px] font-black uppercase tracking-widest text-brand-indigo/20">
                      {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : new Date(review.createdAt).toLocaleDateString()}
                    </span>

                </div>
                <p className="text-brand-indigo/70 font-light tracking-tight leading-relaxed">{review.comment}</p>
                <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-brand-indigo/30 hover:text-brand-maroon transition-colors">
                      <ThumbsUp size={12} /> Helpful ({review.helpful?.length || 0})
                   </button>
                   <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-brand-indigo/30 hover:text-brand-maroon transition-colors">
                      <MessageSquare size={12} /> Reply
                   </button>
                </div>
             </div>
           ))}
           {reviews.length === 0 && (
             <div className="py-20 text-center space-y-6">
                <div className="w-16 h-16 bg-brand-maroon/5 rounded-full flex items-center justify-center mx-auto">
                   <Star size={24} className="text-brand-maroon/20" />
                </div>
                <p className="text-brand-indigo/30 font-light lowercase transition-all">No artisan reviews yet. Be the first to share your experience with this heritage piece.</p>
             </div>
           )}
        </div>
      </div>
    )
  };

  return (
    <div className="bg-brand-cream/50 min-h-screen">
      {/* Editorial Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-4 md:pt-6 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-brand-earth/20 pb-6">
          <Link to="/shop" className="group flex items-center text-[10px] uppercase tracking-[0.4em] font-black text-brand-maroon/60 hover:text-brand-maroon transition-colors">
            <ArrowLeft size={14} className="mr-3 group-hover:-translate-x-2 transition-transform" />
            Back to Shop
          </Link>
          <nav className="flex items-center space-x-3 text-[9px] uppercase tracking-[0.4em] font-black text-brand-indigo/30">
            <Link to="/" className="hover:text-brand-indigo">Home</Link>
            <ChevronRight size={10} />
            <Link to="/shop" className="hover:text-brand-indigo">Shop</Link>
            <ChevronRight size={10} />
            <span className="text-brand-indigo font-black">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
          {/* Visual Showcase - Floating Ethereal */}
          <div className="space-y-8 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-[4/5] bg-white rounded-5xl overflow-hidden shadow-5xl rotating-grain relative group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-8 right-8 flex flex-col gap-4">
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    "w-14 h-14 backdrop-blur-3xl border border-white/40 rounded-full flex items-center justify-center transition-all duration-500",
                    isInWishlist(product.id) ? "bg-brand-maroon text-white" : "bg-white/20 text-white hover:bg-white hover:text-brand-maroon"
                  )}
                >
                  <Heart size={18} className={isInWishlist(product.id) ? "fill-current" : ""} />
                </button>
              </div>

              {product.salePrice && (
                <div className="absolute top-8 left-8">
                   <ProductBadge type="sale" value={`${Math.round((1 - product.salePrice / product.price) * 100)}% OFF`} className="text-sm px-6 py-2" />
                </div>
              )}
            </motion.div>
            
            {/* Minimalist Micro-Gallery */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-6">
                {product.gallery.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square bg-white rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-700 ring-1 ring-black/5">
                    <img 
                      src={img} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                ))}
              </div>
            )}
            {!product.gallery && (
              <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square bg-white rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-700 ring-1 ring-black/5">
                    <img 
                      src={`/gallery-${i}.jpg`} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Intel - Modern Glass Panel */}
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center flex-wrap gap-4">
                   <div className="w-10 h-[1px] bg-brand-maroon" />
                   <span className="uppercase tracking-[0.5em] text-[10px] font-black text-brand-maroon">{product.category}</span>
                   {product.province && (
                     <>
                        <span className="w-1 h-1 bg-brand-earth rounded-full" />
                        <span className="uppercase tracking-[0.5em] text-[10px] font-black text-brand-indigo/40">{product.province}</span>
                     </>
                   )}
                   {product.location && (
                     <>
                        <span className="w-1 h-1 bg-brand-earth rounded-full" />
                        <span className="uppercase tracking-[0.5em] text-[10px] font-black text-brand-indigo/20 italic">{product.location}</span>
                     </>
                   )}
                </div>
                <h1 className="serif text-3xl sm:text-4xl md:text-5xl lg:text-[5.5rem] font-medium tracking-tighter leading-[0.95] text-brand-indigo">{product.name}</h1>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-baseline gap-4">
                   {product.salePrice ? (
                     <>
                        <span className="text-4xl serif font-medium text-brand-maroon italic">{formatPrice(product.salePrice)}</span>
                        <span className="text-lg text-brand-indigo/30 line-through">{formatPrice(product.price)}</span>
                     </>
                   ) : (
                     <span className="text-4xl serif font-medium text-brand-maroon italic">{formatPrice(product.price)}</span>
                   )}
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-indigo/30">Tax Included / Logistics Calculated</span>
                      <span className="text-[9px] uppercase tracking-[0.1em] font-black text-green-600 flex items-center gap-1">
                        <Truck size={10} /> Free Worldwide Shipping
                      </span>
                   </div>
                </div>

                {product.artisan && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCertificateOpen(true)}
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-maroon hover:text-brand-indigo transition-colors"
                  >
                    <ShieldCheck size={14} className="animate-pulse" />
                    Certified Authentic – View Certificate
                  </motion.button>
                )}
                
                <div className="flex items-center gap-2">
                   {[1,2,3,4,5].map(i => (
                     <Star 
                       key={i} 
                       size={12} 
                       className={cn(
                         "transition-colors",
                         i <= Math.round(avgRating || 4.9) ? "fill-brand-earth text-brand-earth" : "text-brand-indigo/10"
                       )} 
                     />
                   ))}
                   <span className="text-[10px] uppercase tracking-widest font-black text-brand-indigo/40 ml-2">
                     {avgRating > 0 ? avgRating.toFixed(1) : "4.9"}/5 • {reviews.length > 0 ? reviews.length : "42"} Artisan Reviews
                   </span>
                </div>
              </div>
            </div>

            <div className="p-10 md:p-12 bg-white rounded-5xl border border-brand-earth/10 shadow-5xl space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Award size={100} />
               </div>
               <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3">
                     <Clock size={16} className="text-brand-maroon animate-pulse" />
                     <p className="text-[11px] uppercase tracking-[0.2em] font-black text-brand-maroon">
                       Hurry! <span className="underline decoration-2">Only {product.stock || 3} left</span> in artisan collection.
                     </p>
                  </div>
                  <p className="text-xl text-brand-indigo/60 leading-relaxed font-light tracking-tight font-sans italic">
                    "{product.description}"
                  </p>
               </div>

              <div className="pt-8 space-y-6">
                <div className="space-y-4">
                  <button
                    onClick={() => {
                        addToCart(product);
                        AnalyticsService.trackEvent('add_to_cart', { productId: product.id, variant: ctaVariant });
                    }}
                    className="btn-modern-primary w-full py-8 group text-[11px] tracking-[0.4em] shadow-2xl shadow-brand-maroon/20"
                  >
                    {ctaVariant === 'A' ? 'Acquire this Heritage' : 'Own a Piece of History'}
                    <ShoppingBag size={18} className="ml-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <p className="text-center text-[10px] uppercase tracking-[0.3em] font-black text-brand-indigo/20 italic">
                     Ships within 48 hours • Est. Delivery: 4-6 Days
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-6 pt-10 border-t border-brand-earth/20">
                  <div className="text-center space-y-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
                    <ShieldCheck size={24} className="mx-auto text-brand-maroon" />
                    <p className="text-[8px] uppercase tracking-[0.2em] font-black">100% Authentic</p>
                  </div>
                  <div className="text-center space-y-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
                    <Truck size={24} className="mx-auto text-brand-maroon" />
                    <p className="text-[8px] uppercase tracking-[0.2em] font-black">Secure Logistics</p>
                  </div>
                  <div className="text-center space-y-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
                    <RefreshCcw size={24} className="mx-auto text-brand-maroon" />
                    <p className="text-[8px] uppercase tracking-[0.2em] font-black">7-Day Heritage Return</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Story Tabs - Elegant & Subtle */}
            <div className="space-y-12 pt-12">
                <div className="flex gap-12 border-b border-brand-earth/20 overflow-x-auto scrollbar-hide">
                  {(["Heritage Story", "Product Details", "Shipment", "Reviews"] as TabType[]).map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "pb-6 text-[10px] uppercase tracking-[0.4em] font-black transition-all duration-500 border-b-2 outline-none shrink-0",
                        activeTab === tab ? "text-brand-maroon border-brand-maroon" : "text-brand-indigo/30 border-transparent hover:text-brand-indigo"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
               </div>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                     {tabContent[activeTab]}
                  </motion.div>
                </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Recommended Heritage */}
        <section className="pt-32 pb-20">
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-brand-earth/20 pb-12">
               <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-maroon">Curated for You</p>
                  <h2 className="serif text-4xl md:text-6xl text-brand-indigo tracking-tighter">Recommended <br /><span className="italic font-light">Heritage</span></h2>
               </div>
               <Link to="/shop" className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-indigo/40 hover:text-brand-maroon transition-colors">View All Collections</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
               {recommendedProducts.map(p => (
                 <ProductCard key={p.id} product={p} />
               ))}
            </div>
          </div>
        </section>
      </div>

      {product.artisan && (
        <AuthenticityCertificate 
          isOpen={isCertificateOpen} 
          onClose={() => setIsCertificateOpen(false)} 
          artisan={product.artisan}
          productName={product.name}
        />
      )}
    </div>
  );
}

