import { ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    { icon: <ShieldCheck size={20} />, text: "Secure Payment" },
    { icon: <Award size={20} />, text: "Handmade Authentic" },
    { icon: <RotateCcw size={20} />, text: "7-Day Returns" },
    { icon: <Truck size={20} />, text: "Free over Rs. 3k" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {badges.map((badge, i) => (
        <div key={i} className="flex items-center gap-4 p-4 md:p-6 bg-white/40 backdrop-blur-3xl rounded-3xl border border-white">
          <div className="w-10 h-10 rounded-full bg-brand-maroon/5 flex items-center justify-center text-brand-maroon">
            {badge.icon}
          </div>
          <span className="text-[10px] uppercase tracking-widest font-black text-brand-indigo/60">{badge.text}</span>
        </div>
      ))}
    </div>
  );
}
