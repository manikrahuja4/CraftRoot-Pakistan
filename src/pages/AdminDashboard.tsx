import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package, 
  AlertCircle, 
  LogIn, 
  Lock, 
  ShieldCheck as ShieldIcon, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Edit3, 
  Save, 
  Star,
  RefreshCw
} from 'lucide-react';
import { AnalyticsService } from '../services/intelligence';
import { products } from '../data/sampleData';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy, doc, updateDoc, onSnapshot, deleteDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'reviews'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    fetchStats();
    
    const unsubOrders = onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    const unsubInventory = onSnapshot(collection(db, "inventory"), (snapshot) => {
      setInventory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubReviews = onSnapshot(query(collection(db, "reviews"), orderBy("createdAt", "desc")), (snapshot) => {
      setAllReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubOrders();
      unsubInventory();
      unsubReviews();
    };
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const s = await AnalyticsService.getStats();
      setStats(s);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const timelineEntry = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: `Status updated by Curatorial Admin`
      };
      
      const order = orders.find(o => o.id === orderId);
      const currentHistory = order?.history || [];

      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        history: arrayUnion(timelineEntry)
      });
    } catch (err) {
      console.error("Order update failed:", err);
    }
  };

  const updateStock = async (productId: string, newStockValue: number) => {
    try {
      const invRef = doc(db, "inventory", productId);
      await updateDoc(invRef, {
        stock: newStockValue,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      // If inventory doc doesn't exist, create it
       await setDoc(doc(db, 'inventory', productId), {
         stock: newStockValue,
         reorderLevel: 5,
         lastUpdated: new Date().toISOString()
       });
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!window.confirm("Strike this feedback from the public record?")) return;
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
    } catch (err) {
      console.error("Review deletion failed:", err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream/30">
        <div className="w-12 h-12 border-4 border-brand-earth border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream/50 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-5xl border border-white space-y-12 text-center"
        >
           <div className="w-24 h-24 bg-brand-indigo/5 rounded-full flex items-center justify-center mx-auto text-brand-indigo">
              <Lock size={40} />
           </div>
           <div className="space-y-4">
              <h1 className="serif text-4xl text-brand-indigo">Restricted <span className="italic font-light">Access</span></h1>
              <p className="text-brand-indigo/40 font-light tracking-tight leading-relaxed">This secure environment is reserved for authorized curators and operational managers.</p>
           </div>
           <button onClick={() => navigate('/login')} className="btn-modern-primary w-full py-6">Authorize to Proceed</button>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Intelligence', icon: BarChart3 },
    { id: 'orders', label: 'Acquisitions', icon: ShoppingCart },
    { id: 'inventory', label: 'Treasury', icon: Package },
    { id: 'reviews', label: 'Artisan Feedback', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 pt-32">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-earth/20 pb-12">
          <div className="space-y-4">
            <h1 className="serif text-5xl text-brand-indigo tracking-tight">Curator <span className="italic font-light">Suite</span></h1>
            <p className="text-brand-indigo/40 font-mono text-[10px] uppercase tracking-[0.3em]">Operational Intelligence Panel</p>
          </div>
          
          <nav className="flex gap-4">
             {navItems.map(item => (
               <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={cn(
                    "px-8 py-3 rounded-full text-[10px] uppercase font-black tracking-widest transition-all",
                    activeTab === item.id ? "bg-brand-indigo text-white shadow-xl shadow-brand-indigo/20 translate-y-[-2px]" : "bg-white text-brand-indigo/30 hover:bg-white/80"
                  )}
               >
                  {item.label}
               </button>
             ))}
          </nav>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Revenue', value: formatPrice(orders.reduce((acc, o) => acc + (o.total || 0), 0)), icon: DollarSign, color: 'text-green-500' },
                  { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-blue-500' },
                  { label: 'Low Stock', value: inventory.filter(i => i.stock <= (i.reorderLevel || 5)).length, icon: AlertCircle, color: 'text-orange-500' },
                  { label: 'Artisan reviews', value: allReviews.length, icon: Star, color: 'text-yellow-500' },
                ].map((card, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6 hover:shadow-xl transition-all duration-500 group">
                    <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform`}><card.icon size={24} /></div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">{card.label}</p>
                      <p className="text-3xl font-medium text-brand-indigo">{card.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="serif text-2xl">High Frequency Heritage</h3>
                    <RefreshCw size={16} className="text-gray-300 animate-spin-slow" />
                  </div>
                  <div className="space-y-6">
                    {products.slice(0, 5).map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm"><img src={p.image} className="w-full h-full object-cover" /></div>
                          <div>
                            <p className="text-xs font-bold text-brand-indigo">{p.name}</p>
                            <p className="text-[9px] uppercase tracking-widest text-gray-400">{p.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-brand-maroon">{formatPrice(p.price)}</p>
                          <p className="text-[9px] text-green-500 font-black">+12% vs last week</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-indigo text-brand-cream p-10 rounded-[3rem] shadow-sm space-y-8 relative overflow-hidden">
                   <div className="absolute inset-0 ajrak-pattern-subtle opacity-5 pointer-events-none" />
                   <h3 className="serif text-2xl italic relative z-10">Real-time Stream</h3>
                   <div className="space-y-6 relative z-10">
                      {stats?.recentEvents?.slice(0, 5).map((event: any, i: number) => (
                        <div key={i} className="space-y-1 relative pl-6 border-l border-white/10">
                           <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-brand-earth" />
                           <p className="text-[10px] font-black uppercase text-brand-earth">{event.eventName?.replace('_', ' ')}</p>
                           <p className="text-[9px] text-brand-cream/40">{event.timestamp?.seconds ? new Date(event.timestamp.seconds * 1000).toLocaleTimeString() : 'Recent'}</p>
                        </div>
                      ))}
                      {(!stats?.recentEvents || stats.recentEvents.length === 0) && (
                        <p className="text-sm text-brand-cream/20 italic">No real-time events captured.</p>
                      )}
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden"
            >
               <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                     <tr>
                        <th className="p-8 text-[10px] uppercase font-black tracking-widest text-brand-indigo/40">Order Ref</th>
                        <th className="p-8 text-[10px] uppercase font-black tracking-widest text-brand-indigo/40">Customer</th>
                        <th className="p-8 text-[10px] uppercase font-black tracking-widest text-brand-indigo/40">Value</th>
                        <th className="p-8 text-[10px] uppercase font-black tracking-widest text-brand-indigo/40">Status</th>
                        <th className="p-8 text-[10px] uppercase font-black tracking-widest text-brand-indigo/40 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {orders.map((order) => (
                       <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-8">
                             <p className="text-xs font-bold text-brand-indigo">{order.orderId}</p>
                             <p className="text-[9px] text-gray-400">
                               {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}
                             </p>
                          </td>
                          <td className="p-8">
                             <p className="text-xs font-bold text-brand-indigo">{order.formData.firstName} {order.formData.lastName}</p>
                             <p className="text-[9px] text-gray-400">{order.formData.email}</p>
                          </td>
                          <td className="p-8">
                             <p className="text-xs font-bold text-brand-maroon">{formatPrice(order.total)}</p>
                             <p className="text-[9px] text-gray-400">{order.items?.length || 0} items</p>
                          </td>
                          <td className="p-8">
                             <div className={cn(
                                "inline-flex items-center gap-2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                'bg-brand-earth/10 text-brand-earth'
                             )}>
                                {order.status}
                             </div>
                          </td>
                          <td className="p-8 text-right space-x-2">
                             {order.status === 'pending' && (
                               <button 
                                  onClick={() => updateOrderStatus(order.id, 'shipped')}
                                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                  title="Mark as Shipped"
                               ><Truck size={14} /></button>
                             )}
                             {order.status === 'shipped' && (
                               <button 
                                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                  title="Mark as Delivered"
                               ><CheckCircle2 size={14} /></button>
                             )}
                             {order.status !== 'cancelled' && order.status !== 'delivered' && (
                               <button 
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                  title="Cancel Order"
                               ><XCircle size={14} /></button>
                             )}
                          </td>
                       </tr>
                     ))}
                     {orders.length === 0 && (
                       <tr>
                         <td colSpan={5} className="p-32 text-center text-brand-indigo/30 italic">No acquisitions archived in the registry.</td>
                       </tr>
                     )}
                  </tbody>
               </table>
            </motion.div>
          )}

          {activeTab === "inventory" && (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {products.map(p => {
                    const inv = inventory.find(i => i.id === p.id) || { stock: p.stock || 5, reorderLevel: 5 };
                    const isLow = inv.stock <= inv.reorderLevel;
                    return (
                      <div key={p.id} className={cn(
                        "bg-white p-8 rounded-[3rem] border shadow-sm transition-all duration-700 hover:shadow-lg",
                        isLow ? "border-red-200 bg-red-50/20" : "border-gray-100"
                      )}>
                         <div className="flex gap-6 items-center mb-8">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-inner"><img src={p.image} className="w-full h-full object-cover" /></div>
                            <div>
                               <h4 className="text-xs font-black uppercase text-brand-indigo truncate max-w-[150px]">{p.name}</h4>
                               <p className="text-[9px] text-gray-400">ID: {p.id.slice(0, 8)}</p>
                            </div>
                            {isLow && <div className="ml-auto w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 animate-pulse"><AlertCircle size={16} /></div>}
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                               <p className="text-[8px] font-black uppercase text-gray-400">Current Stock</p>
                               <input 
                                  type="number" 
                                  value={inv.stock} 
                                  onChange={(e) => updateStock(p.id, parseInt(e.target.value))}
                                  className="bg-transparent border-none focus:ring-0 p-0 text-xl font-bold text-brand-indigo w-full"
                                />
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                               <p className="text-[8px] font-black uppercase text-gray-400">Safety Limit</p>
                               <p className="text-xl font-bold font-mono">{inv.reorderLevel}</p>
                            </div>
                         </div>
                         
                         <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest border-t border-gray-50 pt-4 mt-2">
                            <span className="text-gray-300">Last Synced</span>
                            <span className="text-brand-indigo/40">{inv.lastUpdated ? new Date(inv.lastUpdated).toLocaleDateString() : 'Initial'}</span>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div 
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden"
            >
               <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                     <tr>
                        <th className="p-8 text-[10px] uppercase font-black tracking-widest text-brand-indigo/40">Product</th>
                        <th className="p-8 text-[10px] uppercase font-black tracking-widest text-brand-indigo/40">User</th>
                        <th className="p-8 text-[10px] uppercase font-black tracking-widest text-brand-indigo/40">Rating</th>
                        <th className="p-8 text-[10px] uppercase font-black tracking-widest text-brand-indigo/40">Comment</th>
                        <th className="p-8 text-[10px] uppercase font-black tracking-widest text-brand-indigo/40 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {allReviews.map((review) => {
                       const p = products.find(prod => prod.id === review.productId);
                       return (
                         <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-8">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white ring-1 ring-black/5 shadow-sm"><img src={p?.image || ""} className="w-full h-full object-cover" /></div>
                                  <p className="text-xs font-bold text-brand-indigo max-w-[150px] truncate">{p?.name || "Unknown Artifact"}</p>
                               </div>
                            </td>
                            <td className="p-8">
                               <p className="text-xs font-bold text-brand-indigo">{review.userName}</p>
                               <p className="text-[9px] text-gray-400">
                                 {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : new Date(review.createdAt).toLocaleDateString()}
                               </p>
                            </td>
                            <td className="p-8">
                               <div className="flex gap-0.5">
                                  {[1,2,3,4,5].map(i => <Star key={i} size={8} className={cn(i <= review.rating ? "fill-brand-earth text-brand-earth" : "text-brand-indigo/10")} />)}
                               </div>
                            </td>
                            <td className="p-8">
                               <p className="text-[11px] text-brand-indigo/60 max-w-sm italic line-clamp-2">"{review.comment}"</p>
                            </td>
                            <td className="p-8 text-right">
                               <button 
                                  onClick={() => deleteReview(review.id)}
                                  className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm"
                                  title="Delete Review"
                               ><XCircle size={14} /></button>
                            </td>
                         </tr>
                       );
                     })}
                     {allReviews.length === 0 && (
                       <tr>
                         <td colSpan={5} className="p-32 text-center">
                            <div className="space-y-4">
                              <AlertCircle className="mx-auto text-brand-indigo/10" size={40} />
                              <p className="text-sm text-brand-indigo/30 italic">No community feedback archived yet.</p>
                            </div>
                         </td>
                       </tr>
                     )}
                  </tbody>
               </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const ShoppingCart = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);
