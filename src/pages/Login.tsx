import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/profile");
    } catch (err: any) {
      setError(err.message);
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
          <h1 className="serif text-4xl text-brand-indigo font-medium">Welcome <span className="italic font-light text-brand-maroon text-3xl">Back</span></h1>
          <p className="text-sm text-brand-indigo/40 tracking-tight font-light lowercase transition-all">Sign in to access your artisan archive and support heritage clusters.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
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
            {isLoading ? "Signing In..." : "Sign In"} <LogIn size={18} />
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-brand-earth/10 text-center space-y-6">
          <button 
            onClick={handleGoogleLogin}
            className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-indigo/30 hover:text-brand-indigo transition-colors"
          >
            Or Sign In With Google
          </button>
          
          <p className="text-sm text-brand-indigo/40">
            Don't have an archive? <Link to="/register" className="text-brand-maroon font-bold hover:underline">Register Now</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
