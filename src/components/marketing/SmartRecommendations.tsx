
import React, { useMemo } from 'react';
import { products } from '../../data/sampleData';
import { PersonalizationService } from '../../services/intelligence';
import ProductCard from '../ui/ProductCard';

export default function SmartRecommendations() {
  const viewedIds = PersonalizationService.getViewedIds();
  
  const recommended = useMemo(() => {
    // 1. Get categories of viewed items
    const viewedProducts = products.filter(p => viewedIds.includes(p.id));
    const viewedCategories = Array.from(new Set(viewedProducts.map(p => p.category)));

    // 2. Filter products not viewed yet
    const unseen = products.filter(p => !viewedIds.includes(p.id));

    // 3. Weighting: Same category > isFeatured > random
    return unseen
      .sort((a, b) => {
        const aInCategory = viewedCategories.includes(a.category) ? 1 : 0;
        const bInCategory = viewedCategories.includes(b.category) ? 1 : 0;
        if (aInCategory !== bInCategory) return bInCategory - aInCategory;

        const aFeatured = a.isFeatured ? 1 : 0;
        const bFeatured = b.isFeatured ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;

        return Math.random() - 0.5;
      })
      .slice(0, 4);
  }, [viewedIds]);

  return (
    <section className="py-24 bg-brand-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-maroon/40">Discovery</span>
            <h2 className="serif text-4xl md:text-5xl text-brand-indigo tracking-tight">Handpicked <span className="italic font-light opacity-60">for You</span></h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {recommended.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
