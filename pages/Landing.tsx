import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spotlight } from '../components/ui/Spotlight';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBrandGoogle, IconLoader, IconMail, IconLock, IconUser, IconArrowRight, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { supabase } from '../lib/supabase';
import { clsx } from 'clsx';

export const Landing = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
      email: '',
      password: '',
      fullName: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        if (isLogin) {
            // Login Logic
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });
            if (error) throw error;
            if (data.user) {
                navigate('/dashboard');
            }
        } else {
            // Signup Logic
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
                    }
                }
            });
            if (error) throw error;
            
            // If email confirmation is disabled in Supabase, user is logged in immediately
            if (data.session) {
                navigate('/dashboard');
            } else if (data.user) {
                // If email confirmation is enabled
                setError("Account created! Please check your email to confirm.");
            }
        }
    } catch (err: any) {
        console.error("Auth error:", err);
        setError(err.message || "An unexpected error occurred");
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
        if (error) throw error;
    } catch (err: any) {
        setError(err.message);
    }
  };

  return (
    <div className="h-screen w-full flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-10 md:pt-0 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        
        {/* Left Side: Hero Text */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left max-w-2xl"
        >
            <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 pb-4 leading-tight">
                Master Your <br/> <span className="text-cyan-400">Technical Interview</span>
            </h1>
            <p className="mt-4 font-normal text-lg text-neutral-300 leading-relaxed">
                Join thousands of engineers using AI-powered feedback, real-time analytics, and personalized roadmaps to crack their dream jobs.
            </p>
            
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-neutral-500 font-medium">
                <div className="flex items-center gap-1">
                    <IconCheck className="text-green-500" size={16} /> Data Structures
                </div>
                <div className="flex items-center gap-1">
                    <IconCheck className="text-green-500" size={16} /> System Design
                </div>
                <div className="flex items-center gap-1">
                    <IconCheck className="text-green-500" size={16} /> Behavioral
                </div>
            </div>
        </motion.div>

        {/* Right Side: Auth Card */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-md"
        >
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Gradient Top Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-blue-500" />
                
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isLogin ? "Welcome back" : "Create an account"}
                    </h2>
                    <p className="text-neutral-400 text-sm">
                        {isLogin ? "Enter your credentials to access your dashboard." : "Start your preparation journey today."}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="relative group">
                                    <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        placeholder="Full Name"
                                        required={!isLogin}
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className="w-full bg-neutral-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative group">
                        <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                        <input 
                            type="email" 
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-neutral-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                        <input 
                            type="password" 
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-neutral-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                        />
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2"
                        >
                            <IconAlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                    >
                        {isLoading ? (
                            <IconLoader className="animate-spin" size={20} />
                        ) : (
                            <>
                                {isLogin ? "Sign In" : "Create Account"}
                                <IconArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px bg-white/5 flex-1" />
                    <span className="text-xs text-neutral-500 font-medium">OR CONTINUE WITH</span>
                    <div className="h-px bg-white/5 flex-1" />
                </div>

                <button 
                    onClick={handleGoogleLogin}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                    <IconBrandGoogle size={20} />
                    Google
                </button>

                <div className="mt-8 text-center">
                    <p className="text-sm text-neutral-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button 
                            onClick={() => { setIsLogin(!isLogin); setError(null); }}
                            className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-all"
                        >
                            {isLogin ? "Sign up" : "Log in"}
                        </button>
                    </p>
                </div>
            </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
};