import React, { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Product } from "../../types";
import { useCart } from "../layout/Navbar";
import ProductBadge from "../ecommerce/ProductBadge";
import { useWishlist } from "../../context/WishlistContext";
import { Heart, Plus, ArrowRight, Star } from "lucide-react";
import { cn } from "../../lib/utils";

import { useSettings } from "../../context/SettingsContext";
import { AnalyticsService } from "../../services/intelligence";

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useSettings();

  const handleAddToCart = () => {
    addToCart(product);
    AnalyticsService.trackEvent('add_to_cart', { productId: product.id, name: product.name });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col h-full bg-white/40 backdrop-blur-sm rounded-3xl textile-texture-light hover:shadow-2xl transition-all duration-700 p-4"
    >
      {/* Image Container */}
      <Link 
        to={`/product/${product.id}`} 
        className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-5 block"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-brand-indigo/0 group-hover:bg-brand-indigo/5 transition-colors duration-700" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
          {product.salePrice && <ProductBadge type="sale" value={`${Math.round((1 - product.salePrice/product.price) * 100)}% OFF`} />}
          {product.isBestSeller && <ProductBadge type="bestseller" />}
          {product.stock <= 5 && <ProductBadge type="limited" />}
        </div>

        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={cn(
            "absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-500 z-10",
            isInWishlist(product.id) ? "bg-brand-maroon text-white" : "bg-white/40 text-brand-indigo hover:bg-white"
          )}
        >
          <Heart size={14} className={isInWishlist(product.id) ? "fill-current" : ""} />
        </button>
      </Link>

      {/* Info Core */}
      <div className="flex-grow space-y-3">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-[8px] uppercase tracking-[0.4em] font-black text-brand-maroon/50">
                {product.category}
              </p>
              {product.province && (
                <>
                  <span className="w-1 h-1 bg-brand-earth rounded-full" />
                  <p className="text-[8px] uppercase tracking-[0.4em] font-black text-brand-indigo/30">
                    {product.province}
                  </p>
                </>
              )}
            </div>
            <h3 className="serif text-xl md:text-2xl font-medium tracking-tight text-brand-indigo leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
               <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star 
                      key={i} 
                      size={8} 
                      className={cn(
                        "transition-colors",
                        i <= Math.round(product.rating || 4.5) ? "fill-brand-earth text-brand-earth" : "text-brand-indigo/10"
                      )} 
                    />
                  ))}
               </div>
               <span className="text-[7px] font-black uppercase tracking-widest text-brand-indigo/30">
                 {product.rating || "4.5"} ({Math.floor(Math.random() * 20) + 10} reviews)
               </span>
            </div>
          </div>
          <div className="text-right">
            {product.salePrice ? (
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-brand-maroon/40 line-through">{formatPrice(product.price)}</span>
                <span className="text-sm font-bold text-brand-maroon">{formatPrice(product.salePrice)}</span>
              </div>
            ) : (
              <p className="text-sm font-bold text-brand-maroon mt-1">
                {formatPrice(product.price)}
              </p>
            )}
            <div className="mt-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
               <span className="w-1 h-1 bg-green-500 rounded-full" />
               <span className="text-[8px] uppercase tracking-tighter font-black text-brand-indigo/40 italic">Handmade in 10+ days</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link 
            to={`/product/${product.id}`}
            onClick={() => AnalyticsService.trackEvent('product_view', { productId: product.id, source: 'card' })}
            className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-indigo/40 hover:text-brand-maroon transition-colors flex items-center gap-2 group/link"
          >
            Explore <ArrowRight size={12} className="group-hover/link:translate-x-1.5 transition-transform duration-500" />
          </Link>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-brand-indigo text-white flex items-center justify-center hover:bg-brand-maroon transition-all duration-500 shadow-xl active:scale-95"
          >
            <Plus size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default ProductCard;


