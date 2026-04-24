
import React, { useMemo } from 'react';
import { products } from '../../data/sampleData';
import { PersonalizationService } from '../../services/intelligence';
import ProductCard from '../ui/ProductCard';

export default function RecentlyViewed() {
  const viewedIds = PersonalizationService.getViewedIds();
  
  const viewedProducts = useMemo(() => {
    return products.filter(p => viewedIds.includes(p.id));
  }, [viewedIds]);

  if (viewedProducts.length === 0) return null;

  return (
    <section className="py-24 border-t border-brand-earth/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-maroon/40">Continuity</span>
            <h2 className="serif text-4xl md:text-5xl text-brand-indigo tracking-tight">Your <span className="italic font-light opacity-60">Recent</span> Views</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {viewedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
