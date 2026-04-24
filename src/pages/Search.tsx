import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, Filter, X, SlidersHorizontal, Star, Package, MapPin, Tag } from "lucide-react";
import { products, categories, regions } from "../data/sampleData";
import ProductCard from "../components/ui/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../context/SettingsContext";
import { cn } from "../lib/utils";

export default function Search() {
  const { formatPrice } = useSettings();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [minRating, setMinRating] = useState(0);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesQuery = !query || 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.location?.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchesProvince = selectedProvinces.length === 0 || (p.province && selectedProvinces.includes(p.province));
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesRating = !minRating || (p.rating || 4.5) >= minRating;
      const matchesStock = !onlyInStock || (p.stock || 5) > 0;

      return matchesQuery && matchesCategory && matchesProvince && matchesPrice && matchesRating && matchesStock;
    });
  }, [query, selectedCategories, selectedProvinces, priceRange, minRating, onlyInStock]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleProvince = (prov: string) => {
    setSelectedProvinces(prev => 
      prev.includes(prov) ? prev.filter(p => p !== prov) : [...prev, prov]
    );
  };

  return (
    <div className="bg-brand-cream/50 min-h-screen py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="space-y-12 mb-20">
           <div className="flex flex-col md:flex-row items-center gap-8 justify-between border-b border-brand-earth/20 pb-12">
              <div className="space-y-3 w-full md:w-auto">
                 <h1 className="serif text-5xl md:text-7xl text-brand-indigo tracking-tight">Archive <span className="italic font-light">Search</span></h1>
                 <p className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-indigo/30 italic">Indexing 5,000 Years of Heritage</p>
              </div>
              <div className="relative w-full md:w-1/2 group">
                 <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-indigo/20 group-focus-within:text-brand-maroon transition-colors" size={20} />
                 <input 
                    type="text" 
                    placeholder="Search by name, category, or origin..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-white rounded-full py-6 pl-16 pr-8 text-sm focus:outline-none ring-1 ring-black/5 focus:ring-brand-maroon/20 shadow-sm transition-all"
                 />
                 {query && <button onClick={() => setQuery("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-indigo/20 hover:text-brand-maroon transition-colors"><X size={16} /></button>}
              </div>
           </div>

           <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      "flex items-center gap-3 px-8 py-4 rounded-full border text-[10px] uppercase tracking-widest font-black transition-all",
                      showFilters ? "bg-brand-indigo text-white border-brand-indigo" : "bg-white text-brand-indigo/60 border-brand-earth/10 hover:border-brand-maroon/30"
                    )}
                 >
                    <SlidersHorizontal size={14} /> {showFilters ? "Hide Portals" : "Refine Search"}
                 </button>
                 <span className="text-[10px] uppercase tracking-widest font-black text-brand-indigo/30 ml-4 italic">
                    {filteredProducts.length} masterpieces found
                 </span>
              </div>
              
              <div className="flex gap-2">
                 {selectedCategories.map(c => (
                   <span key={c} className="px-3 py-1 bg-white border border-brand-earth/20 rounded-full text-[9px] font-black uppercase text-brand-maroon flex items-center gap-2">
                      {c} <button onClick={() => toggleCategory(c)}><X size={10} /></button>
                   </span>
                 ))}
                 {selectedProvinces.map(p => (
                   <span key={p} className="px-3 py-1 bg-white border border-brand-earth/20 rounded-full text-[9px] font-black uppercase text-brand-indigo flex items-center gap-2">
                      {p} <button onClick={() => toggleProvince(p)}><X size={10} /></button>
                   </span>
                 ))}
                 {(selectedCategories.length > 0 || selectedProvinces.length > 0) && (
                   <button onClick={() => {setSelectedCategories([]); setSelectedProvinces([]);}} className="text-[9px] font-black uppercase tracking-widest text-brand-maroon underline ml-2">Clear All</button>
                 )}
              </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
           <AnimatePresence>
              {showFilters && (
                <motion.aside 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "300px" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="space-y-12 overflow-hidden bg-white/40 p-10 rounded-[3rem] border border-brand-earth/10 shadow-inner"
                >
                   {/* Categories */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 text-brand-indigo">
                         <Tag size={16} className="text-brand-maroon" />
                         <h3 className="text-[10px] uppercase font-black tracking-widest">Heritage Type</h3>
                      </div>
                      <div className="flex flex-col gap-3">
                         {categories.map(cat => (
                           <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                checked={selectedCategories.includes(cat.name)}
                                onChange={() => toggleCategory(cat.name)}
                                className="w-4 h-4 rounded-full border-brand-earth/30 focus:ring-brand-maroon text-brand-maroon" 
                              />
                              <span className={`text-[11px] font-medium tracking-tight transition-colors ${selectedCategories.includes(cat.name) ? 'text-brand-maroon' : 'text-brand-indigo/60 group-hover:text-brand-indigo'}`}>{cat.name}</span>
                              <span className="ml-auto text-[8px] font-black text-brand-indigo/20">{products.filter(p => p.category === cat.name).length}</span>
                           </label>
                         ))}
                      </div>
                   </div>

                   {/* Provinces */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 text-brand-indigo">
                         <MapPin size={16} className="text-brand-maroon" />
                         <h3 className="text-[10px] uppercase font-black tracking-widest">Origin Region</h3>
                      </div>
                      <div className="flex flex-col gap-3">
                         {regions.map(r => (
                           <label key={r} className="flex items-center gap-3 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                checked={selectedProvinces.includes(r)}
                                onChange={() => toggleProvince(r)}
                                className="w-4 h-4 rounded-full border-brand-earth/30 focus:ring-brand-maroon text-brand-maroon" 
                              />
                              <span className={`text-[11px] font-medium tracking-tight transition-colors ${selectedProvinces.includes(r) ? 'text-brand-maroon' : 'text-brand-indigo/60 group-hover:text-brand-indigo'}`}>{r}</span>
                           </label>
                         ))}
                      </div>
                   </div>

                   {/* Rating */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 text-brand-indigo">
                         <Star size={16} className="text-brand-maroon" />
                         <h3 className="text-[10px] uppercase font-black tracking-widest">Master Rating</h3>
                      </div>
                      <div className="flex flex-col gap-3">
                         {[4.5, 4, 3.5].map(rating => (
                           <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                              <input 
                                type="radio" 
                                name="rating"
                                checked={minRating === rating}
                                onChange={() => setMinRating(rating)}
                                className="w-4 h-4 rounded-full border-brand-earth/30 focus:ring-brand-maroon text-brand-maroon" 
                              />
                              <div className="flex items-center gap-2">
                                 <span className="text-[11px] font-medium text-brand-indigo/60">{rating}+</span>
                                 <div className="flex">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={8} className={i <= rating ? "fill-brand-earth text-brand-earth" : "text-brand-indigo/10"} />)}
                                 </div>
                              </div>
                           </label>
                         ))}
                         <button onClick={() => setMinRating(0)} className="text-[9px] font-black uppercase text-brand-maroon text-left mt-2">Any Rating</button>
                      </div>
                   </div>

                   {/* Stock */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 text-brand-indigo">
                         <Package size={16} className="text-brand-maroon" />
                         <h3 className="text-[10px] uppercase font-black tracking-widest">Inventory Status</h3>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer group">
                         <input 
                           type="checkbox" 
                           checked={onlyInStock}
                           onChange={() => setOnlyInStock(!onlyInStock)}
                           className="w-4 h-4 rounded-full border-brand-earth/30 focus:ring-brand-maroon text-brand-maroon" 
                         />
                         <span className="text-[11px] font-medium tracking-tight text-brand-indigo/60">In Artisan Stock Only</span>
                      </label>
                   </div>
                </motion.aside>
              )}
           </AnimatePresence>

           <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                 {filteredProducts.map((product) => (
                   <ProductCard key={product.id} product={product} />
                 ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="py-32 text-center space-y-8 bg-white/40 rounded-[4rem] border border-brand-earth/10">
                   <div className="w-24 h-24 bg-brand-maroon/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                      <SearchIcon size={40} className="text-brand-maroon" />
                   </div>
                   <p className="text-xl text-brand-indigo/30 serif italic font-light">No artifacts found matching this portal's criteria.</p>
                   <button onClick={() => {setQuery(""); setSelectedCategories([]); setSelectedProvinces([]); setMinRating(0);}} className="btn-modern-outline px-12">Expand Search</button>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
