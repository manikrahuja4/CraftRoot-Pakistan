import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, CreditCard, Truck, User, Smartphone, Landmark, AlertCircle, Info } from "lucide-react";
import { useCart } from "../components/layout/Navbar";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { cn } from "../lib/utils";

export default function Checkout() {
  const { cart, clearCart, cartCount } = useCart();
  const { formatPrice } = useSettings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: "",
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.salePrice || item.price) * item.quantity, 0);
  const shipping = subtotal > 3000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login?redirect=checkout");
      return;
    }

    setIsLoading(true);
    setError("");
    
    const now = new Date().toISOString();
    
    // Capture order data for the success page before clearing cart
    const orderData = {
      orderId: `CR-${Math.floor(Math.random() * 90000) + 10000}-PAK`,
      userId: user.uid,
      items: cart.map(item => ({...item})),
      total,
      subtotal,
      shipping,
      paymentMethod: selectedPayment,
      status: "pending",
      formData: { ...formData },
      createdAt: serverTimestamp(),
      timestamp: now, // For UI and Success page
      trackingTimeline: [
        { status: "Order Registered", timestamp: now }
      ]
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
      clearCart();
      navigate("/success", { state: { orderData } });
    } catch (err: any) {
      console.error("Checkout Error:", err);
      setError("Failed to secure order. Portals are unstable, please retry.");
      setIsLoading(false);
    }
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream/50 p-8">
        <div className="text-center space-y-8">
          <h2 className="serif text-6xl text-brand-indigo font-medium italic">Empty Archives</h2>
          <p className="text-lg text-brand-indigo/60 font-light tracking-tight max-w-sm mx-auto">
            Your shopping cart is currently empty. Please select a masterpiece to begin the checkout process.
          </p>
          <Link to="/shop" className="btn-modern-outline inline-block px-12 py-5">
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream/50 min-h-screen py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-16">
          <Link to="/cart" className="group inline-flex items-center text-[10px] uppercase tracking-[0.4em] font-black text-brand-indigo/30 hover:text-brand-maroon transition-all">
            <ArrowLeft size={14} className="mr-4 group-hover:-translate-x-2 transition-transform" />
            Back to Registry
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Checkout Form */}
          <div className="space-y-16">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-brand-maroon">
                <div className="w-10 h-[1px] bg-brand-maroon/30" />
                <span className="text-[10px] uppercase tracking-[0.5em] font-black">Secure Checkout</span>
              </div>
              <h1 className="serif text-6xl md:text-8xl font-medium tracking-tighter text-brand-indigo leading-none">Shipping <span className="italic font-light text-brand-maroon">Details</span></h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              <section className="space-y-8">
                <div className="flex items-center gap-4 text-brand-indigo/40 border-b border-brand-earth/20 pb-4">
                  <User size={18} />
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-black">Contact Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-indigo/40 ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      className="w-full bg-white/40 border border-brand-earth/20 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth/20 transition-all font-light tracking-tight"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-indigo/40 ml-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+92 XXX XXXXXXX"
                      className="w-full bg-white/40 border border-brand-earth/20 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth/20 transition-all font-light tracking-tight"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-4 text-brand-indigo/40 border-b border-brand-earth/20 pb-4">
                  <Truck size={18} />
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-black">Shipping Destination</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-indigo/40 ml-1">First Name</label>
                    <input
                      required
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white/40 border border-brand-earth/20 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth/20 transition-all font-light tracking-tight"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-indigo/40 ml-1">Last Name</label>
                    <input
                      required
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-white/40 border border-brand-earth/20 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth/20 transition-all font-light tracking-tight"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-indigo/40 ml-1">Physical Address</label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-white/40 border border-brand-earth/20 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth/20 transition-all font-light tracking-tight"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-indigo/40 ml-1">City / Region</label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-white/40 border border-brand-earth/20 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth/20 transition-all font-light tracking-tight"
                  />
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-4 text-brand-indigo/40 border-b border-brand-earth/20 pb-4">
                  <CreditCard size={18} />
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-black">Payment Gateway</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'cod', name: 'Cash on Delivery', icon: Truck, desc: 'Pay at your doorstep.' },
                    { id: 'card', name: 'Debit/Credit Card', icon: CreditCard, desc: 'Visa, Mastercard, UnionPay.' },
                    { id: 'easypaisa', name: 'EasyPaisa', icon: Smartphone, desc: 'Mobile wallet payment.' },
                    { id: 'jazzcash', name: 'JazzCash', icon: Landmark, desc: 'Fast mobile payments.' },
                  ].map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={cn(
                        "p-6 rounded-3xl border transition-all cursor-pointer flex flex-col gap-4",
                        selectedPayment === method.id 
                          ? "bg-brand-maroon text-white border-brand-maroon shadow-lg scale-[1.02]" 
                          : "bg-white border-brand-earth/10 hover:border-brand-maroon/30"
                      )}
                    >
                       <div className="flex justify-between items-start">
                          <method.icon size={22} className={selectedPayment === method.id ? "text-brand-earth" : "text-brand-maroon"} />
                          <div className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                            selectedPayment === method.id ? "border-brand-earth" : "border-gray-200"
                          )}>
                             {selectedPayment === method.id && <div className="w-1.5 h-1.5 bg-brand-earth rounded-full" />}
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest">{method.name}</p>
                          <p className={cn("text-[8px] font-light italic", selectedPayment === method.id ? "text-white/60" : "text-brand-indigo/40")}>
                            {method.desc}
                          </p>
                       </div>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 text-xs font-black uppercase tracking-widest animate-pulse">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <div className="p-4 bg-brand-earth/10 border border-brand-earth/20 rounded-2xl flex items-center gap-4 text-brand-earth text-[10px] font-black uppercase tracking-widest">
                  <Info size={16} /> This is a demonstration - no real payment required.
                </div>
              </section>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-modern-primary w-full py-8 text-sm tracking-[0.6em] group relative overflow-hidden disabled:opacity-50"
              >
                {isLoading ? "Preserving Order..." : "Place Order"}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
              </button>
            </form>
          </div>

          {/* Order Summary Stick-to-Top Sidebar */}
          <aside className="sticky top-32">
            <div className="bg-brand-indigo text-brand-cream p-12 rounded-[4rem] space-y-12 shadow-5xl relative overflow-hidden textile-texture-light">
              <div className="absolute inset-0 ajrak-pattern-subtle opacity-5 pointer-events-none" />
              
              <div className="relative z-10 space-y-12">
                <div className="space-y-4">
                  <h3 className="serif text-3xl font-medium text-brand-earth italic border-b border-white/10 pb-6">Order Summary</h3>
                  <div className="space-y-8 max-h-[30vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-6 items-center">
                        <div className="w-16 h-20 bg-white/10 rounded-xl overflow-hidden shrink-0 border border-white/10">
                          <img src={item.image} className="w-full h-full object-cover grayscale opacity-60" />
                        </div>
                        <div className="flex-grow space-y-1">
                          <p className="text-xs font-medium tracking-tight truncate max-w-[150px]">{item.name}</p>
                          <p className="text-[9px] uppercase tracking-[0.2em] opacity-40">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm serif italic text-brand-earth">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest font-black opacity-40">Subtotal Registry</span>
                    <span className="text-lg serif font-light italic opacity-80">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest font-black opacity-40">Climate-Safe Transit</span>
                    <span className="text-lg serif font-light italic opacity-80">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-8 border-t border-white/20">
                    <span className="serif text-2xl font-medium">Total Value</span>
                    <span className="text-4xl serif italic text-brand-earth font-light leading-none">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                   <div className="flex items-start gap-4">
                      <ShieldCheck className="text-brand-earth/40 mt-1" size={18} />
                      <div className="space-y-1">
                         <p className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-earth/60">Digital Provenance Encrypted</p>
                         <p className="text-[8px] leading-relaxed text-brand-cream/30 font-light">Your transaction is secured through high-grade heritage encryption, preserving your financial and cultural record.</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
