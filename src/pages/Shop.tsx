import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Grid3X3, Globe } from "lucide-react";
import { products, categories } from "../data/sampleData";
import ProductCard from "../components/ui/ProductCard";
import { cn } from "../lib/utils";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get("cat");
  const provParam = searchParams.get("province");
  
  const [activeCategory, setActiveCategory] = useState(catParam || "all");
  const [activeProvince, setActiveProvince] = useState(provParam || "all");
  const [sortBy, setSortBy] = useState("featured");

  const provinces = ["Sindh", "Punjab", "Balochistan", "KPK"];

  useEffect(() => {
    setActiveCategory(catParam || "all");
    setActiveProvince(provParam || "all");
  }, [catParam, provParam]);

  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory === "all" ? true : p.category === activeCategory;
    const matchesProv = activeProvince === "all" ? true : p.province === activeProvince;
    return matchesCat && matchesProv;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0; // Default featured
  });

  const handleCategoryChange = (cat: string) => {
    if (cat === "all") {
      searchParams.delete("cat");
    } else {
      searchParams.set("cat", cat);
    }
    setSearchParams(searchParams);
  };

  const handleProvinceChange = (prov: string) => {
    if (prov === "all") {
      searchParams.delete("province");
    } else {
      searchParams.set("province", prov);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-16 textile-texture-light">
      {/* Editorial Header */}
      <div className="mb-12 md:mb-20 space-y-6 md:space-y-10 max-w-4xl">
        <div className="flex items-center space-x-6">
           <div className="w-16 h-[1px] bg-brand-maroon/30" />
           <span className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-maroon">Our Selection</span>
        </div>
        <h1 className="serif text-[2.5rem] sm:text-[3.3rem] md:text-[4rem] lg:text-[4.5rem] font-medium tracking-tighter leading-[0.9] text-brand-indigo">
          The <span className="italic font-light text-brand-maroon">Heritage</span> <br />Shop
        </h1>
        <p className="text-xl md:text-2xl text-brand-indigo/60 leading-relaxed font-light tracking-tight font-sans border-l border-brand-earth/30 pl-10">
          "Every item in our collection is a unique piece of history. We verify every block strike, every indigo dip, and every artisan's touch."
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Modern Minimal Sidebar */}
        <aside className="w-full lg:w-80 space-y-10">
          <div className="space-y-10">
            <div className="flex items-center justify-between">
               <h3 className="uppercase tracking-[0.4em] text-[10px] font-black text-brand-indigo mb-6 flex items-center">
                 <Filter size={14} className="mr-3" /> Select Heritage
               </h3>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => handleCategoryChange("all")}
                className={cn(
                  "group flex items-center justify-between w-full text-left transition-all duration-500 py-3 border-b border-transparent",
                  activeCategory === "all" ? "text-brand-indigo border-brand-maroon" : "text-brand-indigo/40 hover:text-brand-indigo"
                )}
              >
                <div className="flex items-center">
                   <div className={cn("w-1.5 h-1.5 rounded-full mr-4 transition-colors", activeCategory === "all" ? "bg-brand-maroon" : "bg-transparent")} />
                   <span className="text-[11px] uppercase tracking-[0.3em] font-black">All Collection</span>
                </div>
                <span className="text-[10px] font-sans opacity-40">{products.length}</span>
              </button>
              
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={cn(
                    "group flex items-center justify-between w-full text-left transition-all duration-500 py-3 border-b border-transparent",
                    activeCategory === cat.id ? "text-brand-indigo border-brand-maroon" : "text-brand-indigo/40 hover:text-brand-indigo"
                  )}
                >
                  <div className="flex items-center">
                     <div className={cn("w-1.5 h-1.5 rounded-full mr-4 transition-colors", activeCategory === cat.id ? "bg-brand-maroon" : "bg-transparent")} />
                     <span className="text-[11px] uppercase tracking-[0.3em] font-black">{cat.name}</span>
                  </div>
                  <span className="text-[10px] font-sans opacity-40">{products.filter(p => p.category === cat.id).length}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <h3 className="uppercase tracking-[0.4em] text-[10px] font-black text-brand-indigo mb-6 flex items-center">
              <Globe size={14} className="mr-3" /> Province Registry
            </h3>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleProvinceChange("all")}
                className={cn(
                  "px-4 py-2 rounded-full text-[9px] uppercase tracking-[0.2em] font-black transition-all duration-300",
                  activeProvince === "all" 
                    ? "bg-brand-maroon text-white shadow-lg" 
                    : "bg-white/50 text-brand-indigo/40 hover:bg-brand-maroon/10"
                )}
              >
                All Regions
              </button>
              {provinces.map((prov) => (
                <button
                  key={prov}
                  onClick={() => handleProvinceChange(prov)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[9px] uppercase tracking-[0.2em] font-black transition-all duration-300",
                    activeProvince === prov 
                      ? "bg-brand-maroon text-white shadow-lg" 
                      : "bg-white/50 text-brand-indigo/40 hover:bg-brand-maroon/10"
                  )}
                >
                  {prov}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="uppercase tracking-[0.4em] text-[10px] font-black text-brand-indigo mb-4 flex items-center">
              <SlidersHorizontal size={14} className="mr-3" /> Sort Currency
            </h3>
            <div className="relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-3xl rounded-2xl border border-brand-earth/20 px-6 py-4 text-[10px] focus:outline-none focus:border-brand-maroon cursor-pointer font-black uppercase tracking-[0.2em] appearance-none"
              >
                <option value="featured">Best Selling</option>
                <option value="price-low">Value: Low to High</option>
                <option value="price-high">Value: High to Low</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                 <ChevronDown size={14} />
              </div>
            </div>
          </div>
          
          <div className="p-10 bg-brand-indigo text-brand-cream rounded-4xl shadow-5xl relative overflow-hidden group">
            <div className="absolute inset-0 ajrak-pattern-subtle opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative z-10 space-y-4">
              <h4 className="serif text-2xl font-medium text-brand-earth italic">Authentic Quality</h4>
              <p className="text-xs leading-relaxed text-brand-cream/60 font-light font-sans tracking-tight">
                Every acquisition directly validates a rural cluster. Provenance is digitally certified and physically stitched.
              </p>
            </div>
          </div>
        </aside>

        {/* Product Grid - Spacious */}
        <div className="flex-grow space-y-12">
          <div className="flex items-center justify-between mb-12 text-[10px] uppercase tracking-widest font-black text-brand-indigo/40 pb-6 border-b border-brand-earth/20">
             <div className="flex items-center gap-4">
                <Grid3X3 size={14} />
                <span>Found {sortedProducts.length} Results</span>
             </div>
             <span className="italic font-light serif text-[12px] opacity-100 text-brand-indigo">Currency: PKR</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-40 bg-white/30 backdrop-blur-xl rounded-5xl border border-dashed border-brand-earth/30">
              <p className="serif text-3xl text-brand-indigo/40 font-light italic">The archives are currently empty for this selection.</p>
              <button 
                onClick={() => handleCategoryChange("all")}
                className="mt-8 btn-modern-outline"
              >
                Reset Collection Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Minimalist Chevron Icon since it was missing in imports but useful
function ChevronDown({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

