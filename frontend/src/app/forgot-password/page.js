'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronLeft, ArrowRight, Hash, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
    const [rollNo, setRollNo] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const { data } = await axios.post('/api/auth/forgot-password', { roll_no: rollNo });
            setStatus('success');
            setMessage('A reset link has been generated. For this demo, please use the token provided below.');
            // In a real app, this would be an email. We'll show the token for development visibility.
            console.log('Reset Token:', data.resetToken);
            // Wait 2 seconds then redirect to simulate email check (or just show the success state)
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="glass rounded-[40px] p-8 md:p-12 shadow-2xl">
                    <button
                        onClick={() => router.push('/login')}
                        className="flex items-center text-foreground/40 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-8 group"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </button>

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-4 bg-secondary rounded-3xl shadow-glow shadow-secondary/20 mb-6">
                            <Hash className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-4xl font-black text-foreground tracking-tight mb-2">
                            Reset <span className="text-secondary italic">Access</span>
                        </h2>
                        <p className="text-foreground/40 font-medium">
                            Enter your roll number to receive a reset link
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
                                <p className="text-xs text-foreground/40 italic">Check your institutional email for the reset link.</p>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full py-5 bg-foreground/5 text-foreground font-black rounded-2xl hover:bg-foreground/10 transition-all"
                                >
                                    Return to Login
                                </button>
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
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground/20 group-focus-within:text-secondary transition-colors">
                                            <Hash className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full pl-12 pr-5 py-5 bg-foreground/[0.03] border border-foreground/5 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all font-semibold"
                                            placeholder="Roll Number"
                                            value={rollNo}
                                            onChange={(e) => setRollNo(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="group relative w-full flex justify-center items-center py-5 px-4 border border-transparent font-black rounded-2xl text-white bg-secondary hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-secondary/20 transition-all shadow-glow shadow-secondary/20 disabled:opacity-70"
                                >
                                    {status === 'loading' ? (
                                        <div className="h-6 w-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Send Reset Link</span>
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

export default ForgotPassword;
