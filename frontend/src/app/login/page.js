'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Trophy, ChevronRight, Hash, Lock, AlertCircle, Sparkles, Shield, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Login = () => {
    const [rollNo, setRollNo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const user = await login(rollNo, password);
            if (user.role === 'admin') router.push('/admin');
            else if (user.role === 'sub_admin') router.push('/subadmin');
            else if (user.role === 'coach') router.push('/coach');
            else router.push('/student');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please check your Roll No and Password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Stadium Video Background - Full Colors */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/videos/stadium-loop.mp4" type="video/mp4" />
                </video>
                {/* Subtle overlay for readability */}
                <div className="absolute inset-0 bg-black/20 z-10" />
            </div>

            <div className="max-w-md w-full relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100"
                >
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="inline-flex items-center justify-center mb-6"
                        >
                            <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10 shadow-sm">
                                <Trophy className="h-10 w-10 text-primary" />
                            </div>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-black text-primary tracking-tight mb-2 uppercase"
                        >
                            Sports <span className="text-secondary">Portal</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-muted font-bold uppercase tracking-widest text-[10px] opacity-60"
                        >
                            Vignan Foundation for Science, Technology & Research
                        </motion.p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-2xl flex items-center space-x-3 overflow-hidden shadow-sm"
                                >
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                                    <Hash className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-12 pr-5 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl text-primary placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-semibold"
                                    placeholder="Roll Number"
                                    value={rollNo}
                                    onChange={(e) => setRollNo(e.target.value)}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-12 pr-5 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl text-primary placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-semibold"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center items-center py-5 px-4 border border-transparent font-black rounded-2xl text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-lg shadow-primary/10 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <div className="h-6 w-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign In to Portal</span>
                                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-50 text-center space-y-4">
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/register"
                                className="text-primary font-black text-sm hover:text-primary-hover flex items-center justify-center gap-2 group"
                            >
                                <span>New here? Create an Account</span>
                                <motion.span className="group-hover:translate-x-1 transition-transform"><ChevronRight className="w-4 h-4" /></motion.span>
                            </Link>
                            <button
                                onClick={() => router.push('/forgot-password')}
                                className="text-gray-400 hover:text-primary font-bold text-[10px] uppercase tracking-widest transition-all"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <div className="pt-4 mt-4 border-t border-gray-50">
                            <Link
                                href="/staff-login"
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-primary transition-all flex items-center justify-center gap-2"
                            >
                                <Shield className="w-3 h-3" /> Staff Portal
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Footer simple mark */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center"
                >
                    <p className="text-gray-300 text-xs font-bold tracking-widest uppercase">
                        &copy; 2026 Vignan Sports Portal
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
