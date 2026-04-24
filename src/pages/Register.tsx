import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "motion/react";
import { UserPlus, Mail, Lock, User } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      // Profile creation handled by AuthContext listener, but we can set extra fields here if needed
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: name,
        role: "user",
        addresses: [],
        createdAt: new Date().toISOString()
      });

      navigate("/profile");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/60 backdrop-blur-3xl rounded-[3rem] p-12 shadow-5xl border border-white"
      >
        <div className="text-center space-y-6 mb-12">
          <h1 className="serif text-4xl text-brand-indigo font-medium">Create <span className="italic font-light text-brand-maroon text-3xl">Archive</span></h1>
          <p className="text-sm text-brand-indigo/40 tracking-tight font-light transition-all">Join our community to preserve Pakistan's traditional heritage.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-indigo/20 group-focus-within:text-brand-maroon transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white rounded-full py-5 pl-14 pr-8 text-sm focus:outline-none ring-1 ring-black/5 focus:ring-brand-maroon/50 transition-all"
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-indigo/20 group-focus-within:text-brand-maroon transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white rounded-full py-5 pl-14 pr-8 text-sm focus:outline-none ring-1 ring-black/5 focus:ring-brand-maroon/50 transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-indigo/20 group-focus-within:text-brand-maroon transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white rounded-full py-5 pl-14 pr-8 text-sm focus:outline-none ring-1 ring-black/5 focus:ring-brand-maroon/50 transition-all"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500 text-center font-black uppercase tracking-widest">{error}</p>}

          <button 
            disabled={isLoading}
            className="w-full btn-modern-primary py-6 bg-brand-indigo text-white flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Account"} <UserPlus size={18} />
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-brand-earth/10 text-center">
          <p className="text-sm text-brand-indigo/40">
            Already have an archive? <Link to="/login" className="text-brand-maroon font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
