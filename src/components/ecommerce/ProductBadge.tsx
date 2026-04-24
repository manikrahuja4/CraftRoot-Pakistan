import { cn } from "../../lib/utils";

interface ProductBadgeProps {
  type: "sale" | "bestseller" | "limited";
  className?: string;
  value?: string;
}

export default function ProductBadge({ type, className, value }: ProductBadgeProps) {
  const styles = {
    sale: "bg-brand-maroon text-white",
    bestseller: "bg-brand-indigo text-brand-earth",
    limited: "bg-brand-earth text-brand-indigo",
  };

  const labels = {
    sale: value || "SALE",
    bestseller: "BEST SELLER",
    limited: "LIMITED STOCK",
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-lg",
      styles[type],
      className
    )}>
      {labels[type]}
    </span>
  );
}
