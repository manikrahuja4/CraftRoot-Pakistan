import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ui/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight, HeartOff } from "lucide-react";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="bg-brand-cream/50 min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-brand-earth/20 pb-12 mb-16">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-maroon">Your Selection</p>
            <h1 className="serif text-4xl md:text-6xl text-brand-indigo tracking-tighter">Saved <br /><span className="italic font-light">Heritage</span></h1>
          </div>
          <Link to="/shop" className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-indigo/40 hover:text-brand-maroon transition-colors">Continue Exploring</Link>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 space-y-12">
            <div className="w-24 h-24 rounded-full border border-brand-indigo/10 flex items-center justify-center mx-auto grayscale opacity-20">
               <HeartOff size={32} />
            </div>
            <div className="space-y-6">
              <h2 className="serif text-3xl text-brand-indigo">Your selection is empty.</h2>
              <p className="text-brand-indigo/40 text-sm max-w-sm mx-auto leading-relaxed">
                Explore our curated collection of handmade Pakistani crafts and save the pieces that speak to your heart.
              </p>
            </div>
            <Link to="/shop" className="btn-modern-primary px-12 inline-block">
              Start Exploring <ArrowRight size={16} className="ml-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
