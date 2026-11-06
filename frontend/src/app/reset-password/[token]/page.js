'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Lock, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        setStatus('loading');
        try {
            await axios.post(`/api/auth/reset-password/${token}`, { password });
            setStatus('success');
            setMessage('Your password has been reset successfully.');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Invalid or expired reset link.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="glass rounded-[40px] p-8 md:p-12 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-4 bg-primary rounded-3xl shadow-glow mb-6">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-4xl font-black text-foreground tracking-tight mb-2">
                            New <span className="text-primary italic">Security</span>
                        </h2>
                        <p className="text-foreground/40 font-medium">
                            Create a strong new password for your account
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6"
                            >
                                <div className="bg-success/10 border border-success/20 text-success p-8 rounded-[32px] flex flex-col items-center">
                                    <CheckCircle2 className="h-12 w-12 mb-4" />
                                    <p className="font-bold text-lg leading-tight">{message}</p>
                                </div>
                                <p className="text-sm text-foreground/40 italic animate-pulse">Redirecting to login...</p>
                            </motion.div>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                                onSubmit={handleSubmit}
                            >
                                {status === 'error' && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-2xl flex items-center space-x-3">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <span>{message}</span>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground/20 group-focus-within:text-primary transition-colors">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="block w-full pl-12 pr-12 py-5 bg-foreground/[0.03] border border-foreground/5 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                                            placeholder="New Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-5 flex items-center text-foreground/20 hover:text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground/20 group-focus-within:text-primary transition-colors">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="block w-full pl-12 pr-5 py-5 bg-foreground/[0.03] border border-foreground/5 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                                            placeholder="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="group relative w-full flex justify-center items-center py-5 px-4 border border-transparent font-black rounded-2xl text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-glow disabled:opacity-70"
                                >
                                    {status === 'loading' ? (
                                        <div className="h-6 w-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Update Security Protocol</span>
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
