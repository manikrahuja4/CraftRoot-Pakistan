import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ArrowRight, Share2, Printer, CheckCircle2, ChevronRight, X, Truck, Box, Calendar } from "lucide-react";
import { useState } from "react";
import { useSettings } from "../context/SettingsContext";

import { jsPDF } from "jspdf";

export default function Success() {
  const location = useLocation();
  const { formatPrice } = useSettings();
  const orderData = location.state?.orderData;
  const [showTracker, setShowTracker] = useState(false);

  // Default fallback if someone lands here without state
  const orderId = orderData?.orderId || "CR-77241-PAK";

  const handleDownloadReceipt = () => {
    if (!orderData) {
      // Fallback if no data, just print
      window.print();
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("CraftRoot Heritage", 20, 30);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("AUTHENTIC ARTISAN ARCHIVE", 20, 36);

    // Order Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 140, 30);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${orderId}`, 140, 36);
    const orderDate = orderData?.timestamp || orderData?.createdAt;
    doc.text(`Date: ${orderDate ? new Date(orderDate).toLocaleDateString() : 'Recent'}`, 140, 41);

    // Ship To
    doc.setFont("helvetica", "bold");
    doc.text("SHIP TO:", 20, 55);
    doc.setFont("helvetica", "normal");
    doc.text(`${orderData?.formData?.firstName || 'Valued'} ${orderData?.formData?.lastName || 'Customer'}`, 20, 60);
    doc.text(orderData?.formData?.address || '', 20, 65);
    doc.text(`${orderData?.formData?.city || ''}`, 20, 70);
    doc.text(orderData?.formData?.phone || '', 20, 75);

    // Table Header
    doc.setDrawColor(230, 230, 230);
    doc.line(20, 85, 190, 85);
    doc.setFont("helvetica", "bold");
    doc.text("Product", 20, 92);
    doc.text("Qty", 120, 92);
    doc.text("Price", 140, 92);
    doc.text("Total", 170, 92);
    doc.line(20, 96, 190, 96);

    // Items
    let y = 105;
    doc.setFont("helvetica", "normal");
    orderData.items.forEach((item: any) => {
      doc.text(item.name, 20, y);
      doc.text(item.quantity.toString(), 120, y);
      doc.text(formatPrice(item.price), 140, y);
      doc.text(formatPrice(item.price * item.quantity), 170, y);
      y += 10;
    });

    // Summary
    y += 10;
    doc.line(130, y, 190, y);
    y += 10;
    doc.text("Subtotal:", 130, y);
    doc.text(formatPrice(orderData.subtotal), 170, y);
    
    y += 8;
    doc.text("Shipping:", 130, y);
    doc.text(orderData.shipping === 0 ? "Free" : formatPrice(orderData.shipping), 170, y);
    
    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total Price:", 130, y);
    doc.setTextColor(153, 27, 27); // Brand Maroon-ish
    doc.text(formatPrice(orderData.total), 170, y);

    // Footer
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for supporting heritage craftsmanship.", 105, 280, { align: "center" });

    doc.save(`Invoice-${orderId}.pdf`);
  };

  const handleShare = async () => {
    const shareText = `I just brought home a piece of tradition from CraftRoot! Order: ${orderId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CraftRoot Heritage Order',
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(shareText);
      alert("Order details copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream/50 flex flex-col items-center justify-center py-24 px-6 relative overflow-hidden print:bg-white print:py-0">
      {/* Scrollable container for print */}
      <div className="max-w-3xl w-full relative z-10 text-center space-y-16 print:space-y-8">
        
        {/* Confirmed Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="relative inline-block print:hidden"
        >
          <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-5xl ring-1 ring-black/5 relative">
             <CheckCircle2 size={60} className="text-brand-maroon stroke-[1px]" />
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute inset-[-8px] border border-dashed border-brand-earth/30 rounded-full"
             />
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="serif text-5xl md:text-7xl font-medium tracking-tighter text-brand-indigo leading-none">
              Order <span className="italic font-light text-brand-maroon">Placed!</span>
            </h1>
            <p className="uppercase tracking-[0.4em] text-[10px] font-black text-brand-indigo/30">Order ID: {orderId}</p>
          </div>
          
          <p className="text-lg md:text-xl text-brand-indigo/60 leading-relaxed font-light tracking-tight max-w-xl mx-auto print:text-sm">
            Thank you for supporting our artisans. Your heritage items are being prepared with care and will be with you soon.
          </p>
        </div>

        {/* Action Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start print:hidden">
           {/* Track Order Card */}
           <motion.div 
              whileHover={{ y: -5 }}
              onClick={() => setShowTracker(true)}
              className="bg-white/60 backdrop-blur-3xl border border-white p-10 rounded-[3rem] shadow-5xl space-y-8 text-left cursor-pointer group"
           >
              <Package className="text-brand-maroon" size={28} />
              <div className="space-y-1">
                <h3 className="serif text-2xl font-medium text-brand-indigo">Track Delivery</h3>
                <p className="text-[11px] text-brand-indigo/50 font-light leading-relaxed">See exactly where your handcrafted items are in their journey.</p>
              </div>
              <button className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] font-black text-brand-maroon">
                Check Status <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
              </button>
           </motion.div>

           {/* Share Card */}
           <motion.div 
              whileHover={{ y: -5 }}
              onClick={handleShare}
              className="bg-brand-indigo text-brand-cream p-10 rounded-[3rem] shadow-5xl space-y-8 text-left cursor-pointer group relative overflow-hidden"
           >
              <div className="absolute inset-0 ajrak-pattern-subtle opacity-5 pointer-events-none" />
              <Share2 className="text-brand-earth" size={28} />
              <div className="space-y-1 relative z-10">
                <h3 className="serif text-2xl font-medium text-brand-earth italic">Tell Your Friends</h3>
                <p className="text-[11px] text-brand-cream/40 font-light leading-relaxed">Share your heritage archive and inspire others to preserve tradition.</p>
              </div>
              <button className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] font-black text-brand-earth relative z-10">
                Share Link <Share2 size={12} className="group-hover:rotate-12 transition-transform" />
              </button>
           </motion.div>
        </div>

        {/* Order Details for Printing */}
        {orderData && (
          <div className="hidden print:block text-left p-8 border border-gray-100 rounded-3xl space-y-6">
            <div className="flex justify-between items-start border-b pb-6">
               <div>
                  <h2 className="serif text-2xl text-brand-indigo">CraftRoot Heritage</h2>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400">Authentic Artisan Archive</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black">{orderId}</p>
                  <p className="text-[9px] text-gray-400">
                    {orderData?.timestamp || orderData?.createdAt ? new Date(orderData.timestamp || orderData.createdAt).toLocaleDateString() : 'Recent'}
                  </p>
               </div>
            </div>
            
            <div className="space-y-4">
               {orderData?.items?.map((item: any) => (
                 <div key={item.id} className="flex justify-between text-sm">
                    <span className="font-light">{item.name} x {item.quantity}</span>
                    <span className="serif italic">{formatPrice(item.price * item.quantity)}</span>
                 </div>
               ))}
            </div>

            <div className="border-t pt-4 space-y-2">
               <div className="flex justify-between text-xs opacity-60">
                  <span>Subtotal</span>
                  <span>{formatPrice(orderData?.subtotal || 0)}</span>
               </div>
               <div className="flex justify-between text-xs opacity-60">
                  <span>Shipping Status</span>
                  <span>{orderData?.shipping === 0 ? "Free" : formatPrice(orderData?.shipping || 0)}</span>
               </div>
               <div className="flex justify-between text-lg serif font-medium pt-2 border-t mt-2">
                  <span>Total Price</span>
                  <span className="text-brand-maroon">{formatPrice(orderData?.total || 0)}</span>
               </div>
            </div>

            <div className="pt-6 space-y-1">
               <p className="text-[9px] uppercase tracking-widest font-black opacity-30">Destination</p>
               <p className="text-xs font-light">{orderData?.formData?.address}, {orderData?.formData?.city}</p>
               <p className="text-xs font-light">{orderData?.formData?.phone}</p>
            </div>
          </div>
        )}

        <div className="pt-12 border-t border-brand-earth/20 print:hidden space-y-12">
           <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-brand-indigo/30">
              <div className="flex items-center gap-3">
                 <Truck size={16} className="text-brand-earth" />
                 <span className="text-[8px] uppercase tracking-[0.2em] font-black">Worldwide Shipping</span>
              </div>
              <div className="w-1 h-1 bg-brand-earth/20 rounded-full hidden md:block" />
              <div className="flex items-center gap-3">
                 <Package size={16} className="text-brand-maroon" />
                 <span className="text-[8px] uppercase tracking-[0.2em] font-black">Eco-Friendly Packaging</span>
              </div>
              <div className="w-1 h-1 bg-brand-earth/20 rounded-full hidden md:block" />
              <div className="flex items-center gap-3">
                 <CheckCircle2 size={16} className="text-green-500" />
                 <span className="text-[8px] uppercase tracking-[0.2em] font-black">Guaranteed Authentic</span>
              </div>
           </div>

           <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <Link to="/shop" className="btn-modern-primary px-16 py-6 group text-sm tracking-widest bg-brand-indigo text-white">
                Back to Shop <ArrowRight size={18} className="ml-4 group-hover:translate-x-2 transition-transform" />
              </Link>
              <button 
                onClick={handleDownloadReceipt}
                className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-brand-indigo/30 hover:text-brand-indigo transition-colors group"
              >
                <Printer size={16} /> 
                <span>Download Receipt</span>
              </button>
           </div>
        </div>
      </div>

      {/* Tracking Modal Overlay */}
      <AnimatePresence>
        {showTracker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-indigo/80 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 50 }}
               className="max-w-lg w-full bg-white rounded-[3rem] p-12 relative shadow-6xl"
             >
                <button 
                  onClick={() => setShowTracker(false)}
                  className="absolute top-8 right-8 text-brand-indigo/20 hover:text-brand-indigo transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="space-y-12">
                   <div className="text-center space-y-4">
                      <h2 className="serif text-4xl text-brand-indigo">Tracking <span className="italic font-light">History</span></h2>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-maroon">Expected Delivery: 3-5 Business Days</p>
                   </div>

                   <div className="space-y-8">
                      {[
                        { icon: CheckCircle2, label: 'Order Registered', time: 'Just now', active: true, completed: true },
                        { icon: Box, label: 'Preparing Package', time: 'In progress', active: true, completed: false },
                        { icon: Truck, label: 'Handed to Logistics', time: '--', active: false, completed: false },
                        { icon: Calendar, label: 'Estimated Delivery', time: '--', active: false, completed: false },
                      ].map((step, i) => (
                        <div key={i} className="flex gap-6 relative">
                           <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step.completed ? 'bg-green-500 border-green-500 text-white' : step.active ? 'border-brand-maroon text-brand-maroon bg-white' : 'border-gray-100 text-gray-200'}`}>
                                 <step.icon size={18} />
                              </div>
                              {i < 3 && <div className={`w-[1px] h-full ${step.completed ? 'bg-green-500' : 'bg-gray-100'} mt-2`} />}
                           </div>
                           <div className="pt-2">
                              <p className={`text-[10px] font-black uppercase tracking-widest ${step.active ? 'text-brand-indigo' : 'text-gray-300'}`}>{step.label}</p>
                              <p className="text-[9px] text-gray-400 mt-1">{step.time}</p>
                           </div>
                        </div>
                      ))}
                   </div>

                   <button 
                     onClick={() => setShowTracker(false)}
                     className="w-full btn-modern-primary py-6 bg-brand-indigo text-white text-xs tracking-widest"
                   >
                     Got it
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
