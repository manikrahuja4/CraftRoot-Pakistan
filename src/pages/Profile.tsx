import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  LogOut, 
  Clock, 
  ChevronRight,
  Shield,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Profile() {
  const { user, profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'settings'>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore Timestamp to Date object if needed
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        return {
          id: doc.id,
          ...data,
          _createdAtDate: createdAt // Helper for sorting
        };
      }).sort((a: any, b: any) => b._createdAtDate.getTime() - a._createdAtDate.getTime());
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const newName = formData.get('name') as string;

    try {
      setUpdateStatus('Updating...');
      await updateDoc(doc(db, 'users', user.uid), {
        name: newName,
        updatedAt: new Date().toISOString()
      });
      setUpdateStatus('Profile updated successfully');
      setTimeout(() => setUpdateStatus(null), 3000);
    } catch (error) {
      console.error('Update failed:', error);
      setUpdateStatus('Failed to update profile');
    }
  };

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const addressId = Math.random().toString(36).substring(7);
      const addressWithId = { ...newAddress, id: addressId };
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        addresses: arrayUnion(addressWithId)
      });

      setShowAddressModal(false);
      setNewAddress({ firstName: '', lastName: '', address: '', city: '', phone: '', isDefault: false });
    } catch (error) {
      console.error('Add address failed:', error);
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!user || !profile) return;
    
    try {
      const addressToDelete = profile.addresses.find((a: any) => a.id === addressId);
      if (!addressToDelete) return;

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        addresses: arrayRemove(addressToDelete)
      });
    } catch (error) {
      console.error('Delete address failed:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream/30">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-earth border-t-transparent rounded-full animate-spin" />
          <p className="serif italic text-brand-indigo">Summoning your legacy...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Acquisitions', icon: Package },
    { id: 'addresses', label: 'Heritage Points', icon: MapPin },
    { id: 'settings', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-brand-cream/30 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
         {/* Sidebar Navigation */}
         <aside className="w-full lg:w-80 space-y-8">
            <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3.5rem] border border-brand-indigo/5 shadow-sm space-y-8">
               <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-brand-indigo flex items-center justify-center text-brand-cream text-3xl serif shadow-xl mb-2">
                    {profile.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="serif text-xl text-brand-indigo">{profile.name}</h2>
                    <p className="text-[10px] uppercase font-black tracking-widest text-brand-indigo/30">{profile.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-2 px-3 py-1 bg-brand-earth/10 text-brand-earth text-[8px] font-black uppercase tracking-[0.2em] rounded-full">
                        Curator Admin
                      </span>
                    )}
                  </div>
               </div>

               <div className="space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={cn(
                        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group",
                        activeTab === item.id 
                          ? "bg-brand-indigo text-brand-cream shadow-lg shadow-brand-indigo/20 translate-x-2"
                          : "hover:bg-brand-indigo/5 text-brand-indigo/60"
                      )}
                    >
                      <item.icon size={18} className={cn(
                        "transition-transform",
                        activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                      )} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">{item.label}</span>
                      <ChevronRight size={14} className={cn(
                        "ml-auto transition-all",
                        activeTab === item.id ? "opacity-100" : "opacity-0 -translate-x-2"
                      )} />
                    </button>
                  ))}
               </div>

               <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-brand-maroon hover:bg-brand-maroon/5 transition-all group"
               >
                  <LogOut size={18} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Seal Session</span>
               </button>
            </div>

            <div className="bg-brand-indigo p-10 rounded-[3.5rem] shadow-sm relative overflow-hidden text-brand-cream">
               <div className="absolute inset-0 ajrak-pattern-subtle opacity-10 pointer-events-none" />
               <h4 className="serif text-lg italic mb-2 relative z-10">Artisan Support</h4>
               <p className="text-sm text-brand-cream/60 leading-relaxed font-light relative z-10">Need help with an acquisition or heritage artifact?</p>
               <button className="mt-6 text-[10px] font-black uppercase tracking-widest border-b border-brand-earth text-brand-earth hover:text-brand-cream transition-colors relative z-10">Connect via WhatsApp</button>
            </div>
         </aside>

         {/* Main Content Area */}
         <main className="flex-1">
            <AnimatePresence mode="wait">
               {activeTab === "overview" && (
                 <motion.div 
                   key="overview"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-12"
                 >
                    <div className="flex justify-between items-end">
                       <h2 className="serif text-5xl text-brand-indigo">Digital <span className="italic font-light">Heritage</span></h2>
                       <p className="text-[10px] uppercase font-black tracking-widest text-brand-indigo/30 border-b border-brand-indigo/10 pb-2">Last Sync: {new Date().toLocaleTimeString()}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-brand-indigo/5 space-y-6">
                          <div className="p-4 bg-brand-indigo/5 rounded-3xl w-fit text-brand-indigo"><Package size={24} /></div>
                          <div>
                            <h3 className="serif text-2xl text-brand-indigo">{orders.length} <span className="italic font-light text-lg ml-1">Acquisitions</span></h3>
                            <p className="text-sm text-brand-indigo/40 mt-2 font-light">Total heritage pieces added to your collection.</p>
                          </div>
                          <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black uppercase tracking-widest text-brand-earth mt-4">View Collection Trace</button>
                       </div>
                       
                       <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-brand-indigo/5 space-y-6">
                          <div className="p-4 bg-brand-earth/5 rounded-3xl w-fit text-brand-earth"><MapPin size={24} /></div>
                          <div>
                            <h3 className="serif text-2xl text-brand-indigo">{profile.addresses?.length || 0} <span className="italic font-light text-lg ml-1">Heritage Points</span></h3>
                            <p className="text-sm text-brand-indigo/40 mt-2 font-light">Saved shipping locations for artifact delivery.</p>
                          </div>
                          <button onClick={() => setActiveTab('addresses')} className="text-[10px] font-black uppercase tracking-widest text-brand-indigo/40 mt-4">Manage Destinations</button>
                       </div>
                    </div>

                    <div className="bg-brand-indigo p-12 rounded-[4rem] text-brand-cream relative overflow-hidden">
                       <div className="absolute inset-0 ajrak-pattern-subtle opacity-5 pointer-events-none" />
                       <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                          <div className="space-y-4">
                             <h3 className="serif text-3xl font-light">Curator <span className="italic font-serif">Community</span></h3>
                             <p className="text-brand-cream/60 text-sm max-w-md font-light leading-relaxed tracking-wide">You are a valued guardian of South Asian crafts. Exclusive early access to artisan drops is unlocked for your profile.</p>
                          </div>
                          <div className="text-center md:text-right">
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-earth mb-4">Membership Class</p>
                             <div className="px-8 py-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 inline-block">
                                <span className="serif italic text-xl">Silver Artisan</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeTab === "orders" && (
                 <motion.div 
                   key="orders"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                 >
                    <div className="flex justify-between items-center">
                       <h2 className="serif text-4xl text-brand-indigo">Acquisition <span className="italic font-light">History</span></h2>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-indigo/30">
                          <Clock size={12} />
                          <span>Timeline Archive</span>
                       </div>
                    </div>

                    <div className="space-y-6">
                       {orders.length === 0 ? (
                         <div className="py-32 text-center space-y-6 border-2 border-dashed border-brand-indigo/10 rounded-[4rem]">
                            <p className="text-brand-indigo/40 italic font-light">Your heritage library is currently empty.</p>
                            <button 
                              onClick={() => navigate('/shop')}
                              className="btn-modern-primary py-4 px-10 text-[10px]"
                            >Start Exploration</button>
                         </div>
                       ) : (
                         orders.map((order) => (
                           <div key={order.id} className="bg-white/80 p-10 rounded-[3.5rem] border border-brand-indigo/5 hover:border-brand-earth/20 transition-all group">
                              <div className="flex flex-col md:flex-row justify-between gap-8">
                                 <div className="flex gap-8">
                                    <div className="w-24 h-24 rounded-3xl overflow-hidden bg-brand-cream shrink-0 ring-1 ring-brand-indigo/5">
                                       <img 
                                          src={order.items[0]?.image} 
                                          alt={order.items[0]?.name}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                       />
                                    </div>
                                    <div className="space-y-2">
                                       <p className="text-[10px] font-black uppercase tracking-widest text-brand-earth">{order.orderId}</p>
                                       <h4 className="serif text-xl text-brand-indigo">
                                          {order.items.length === 1 ? order.items[0].name : `${order.items[0].name} +${order.items.length - 1} artifacts`}
                                       </h4>
                                       <div className="flex items-center gap-4 text-xs font-medium text-brand-indigo/40">
                                          <span>{order._createdAtDate ? order._createdAtDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
                                          <span className="w-1 h-1 rounded-full bg-brand-earth/30" />
                                          <span className="text-brand-maroon font-bold">{formatPrice(order.total)}</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex flex-col md:items-end justify-between">
                                    <div className={cn(
                                      "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest inline-block ring-1",
                                      order.status === 'delivered' ? "bg-green-50 text-green-600 ring-green-100" :
                                      order.status === 'shipped' ? "bg-blue-50 text-blue-600 ring-blue-100" :
                                      "bg-brand-earth/5 text-brand-earth ring-brand-earth/10"
                                    )}>
                                      {order.status}
                                    </div>
                                    <button 
                                      onClick={() => navigate(`/order/${order.id}`)}
                                      className="text-[10px] font-black uppercase tracking-widest text-brand-indigo hover:text-brand-earth transition-colors hidden md:block"
                                    >Track Artifact</button>
                                 </div>
                              </div>
                           </div>
                         ))
                       )}
                    </div>
                 </motion.div>
               )}

               {activeTab === "addresses" && (
                 <motion.div 
                   key="addresses"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-10"
                 >
                    <div className="flex justify-between items-center">
                       <h2 className="serif text-4xl text-brand-indigo">Heritage <span className="italic font-light">Points</span></h2>
                       <button 
                          onClick={() => setShowAddressModal(true)}
                          className="btn-modern-primary py-4 px-10 text-[10px] font-black uppercase"
                       >New Destination</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {profile.addresses?.map((addr: any) => (
                         <div key={addr.id} className="bg-white/60 p-8 rounded-[2.5rem] border border-brand-indigo/5 space-y-6 relative group">
                            <div className="flex justify-between items-start">
                               <div className="p-3 bg-brand-indigo/5 rounded-2xl text-brand-indigo/40"><MapPin size={18} /></div>
                               <button 
                                  onClick={() => deleteAddress(addr.id)}
                                  className="p-3 text-brand-maroon/20 hover:text-brand-maroon transition-colors"
                               >
                                  <Trash2 size={16} />
                               </button>
                            </div>
                            <div className="space-y-1">
                               <p className="font-bold text-brand-indigo">{addr.firstName} {addr.lastName}</p>
                               <p className="text-sm text-brand-indigo/60 leading-relaxed tracking-tight">{addr.address}, {addr.city}</p>
                               <p className="text-[10px] font-black text-brand-indigo/30 uppercase tracking-widest mt-2">{addr.phone}</p>
                            </div>
                            {addr.isDefault && <span className="text-[8px] uppercase tracking-widest font-black text-brand-earth absolute bottom-8 right-8">Default</span>}
                         </div>
                       ))}
                       {(!profile.addresses || profile.addresses.length === 0) && (
                         <div className="col-span-full py-20 text-center border-2 border-dashed border-brand-earth/20 rounded-[3rem]">
                            <p className="text-brand-indigo/30 font-light lowercase">Secure your delivery details for faster heritage acquisitions.</p>
                         </div>
                       )}
                    </div>

                    {/* Address Modal */}
                    <AnimatePresence>
                       {showAddressModal && (
                         <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-24 bg-black/40 backdrop-blur-md">
                            <motion.div 
                               initial={{ opacity: 0, scale: 0.9 }}
                               animate={{ opacity: 1, scale: 1 }}
                               exit={{ opacity: 0, scale: 0.9 }}
                               className="bg-white w-full max-w-xl rounded-[4rem] p-12 relative overflow-hidden shadow-2xl"
                            >
                               <button onClick={() => setShowAddressModal(false)} className="absolute top-8 right-8 text-brand-indigo/30 hover:text-brand-indigo transition-colors"><Trash2 size={24} className="rotate-45" /></button>
                               <h3 className="serif text-3xl text-brand-indigo mb-8">Add <span className="italic font-light">Address</span></h3>
                               
                               <form onSubmit={addAddress} className="grid grid-cols-2 gap-4">
                                  <input
                                    required
                                    placeholder="First Name"
                                    value={newAddress.firstName}
                                    onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                                    className="bg-brand-cream/40 border border-brand-earth/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth/20"
                                  />
                                  <input
                                    required
                                    placeholder="Last Name"
                                    value={newAddress.lastName}
                                    onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                                    className="bg-brand-cream/40 border border-brand-earth/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth/20"
                                  />
                                  <input
                                    required
                                    placeholder="Full Address"
                                    value={newAddress.address}
                                    onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                                    className="col-span-2 bg-brand-cream/40 border border-brand-earth/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth/20"
                                  />
                                  <input
                                    required
                                    placeholder="City"
                                    value={newAddress.city}
                                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                    className="bg-brand-cream/40 border border-brand-earth/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth/20"
                                  />
                                  <input
                                    required
                                    placeholder="Phone Number"
                                    value={newAddress.phone}
                                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                                    className="bg-brand-cream/40 border border-brand-earth/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth/20"
                                  />
                                  <button type="submit" className="col-span-2 btn-modern-primary py-5 mt-4">Save Heritage Destination</button>
                               </form>
                            </motion.div>
                         </div>
                       )}
                    </AnimatePresence>
                 </motion.div>
               )}

               {activeTab === "settings" && (
                 <motion.div 
                   key="settings"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                 >
                    <h2 className="serif text-4xl text-brand-indigo">Account <span className="italic font-light">Settings</span></h2>
                    
                    <form onSubmit={handleUpdateName} className="bg-white/40 p-10 rounded-[3rem] border border-brand-earth/10 space-y-8 max-w-xl">
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-black tracking-widest text-brand-indigo/40 ml-4">Full Name</label>
                             <input
                               name="name"
                               defaultValue={profile.name}
                               className="w-full bg-white border border-brand-earth/10 rounded-full px-8 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 transition-all font-medium"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-black tracking-widest text-brand-indigo/40 ml-4">Email Address</label>
                             <input
                               disabled
                               value={profile.email}
                               className="w-full bg-gray-50 border border-gray-100 rounded-full px-8 py-4 text-sm text-gray-400 cursor-not-allowed"
                             />
                          </div>
                       </div>
                       
                       {updateStatus && <p className="text-[10px] font-black uppercase text-green-500 ml-4">{updateStatus}</p>}
                       
                       <button type="submit" className="btn-modern-primary py-5 px-12 text-[10px] w-full">Save Profile Updates</button>
                    </form>

                    <div className="p-10 rounded-[3rem] border border-brand-maroon/10 bg-brand-maroon/5 space-y-4 max-w-xl">
                       <h4 className="text-[10px] uppercase font-black tracking-[0.4em] text-brand-maroon">Advanced Security</h4>
                       <p className="text-sm text-brand-maroon/60 font-light leading-relaxed">Password management is handled securely via our authentication portal. To change your password, please sign out and use the "forgot password" flow.</p>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </main>
      </div>
    </div>
  );
}
